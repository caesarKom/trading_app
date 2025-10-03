import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../errors/index.js';
import Stock from '../../models/Stock.js';
import Holding from '../../models/Holding.js';
import User from '../../models/User.js';
import Order from '../../models/Order.js';
import jwt from 'jsonwebtoken';

export const buyStock = async (req, res) => {
  const { stock_id, quantity } = req.body;
  if (!stock_id || !quantity) {
    throw new BadRequestError('Please provide all values');
  }

  const accessToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(accessToken, process.env.SOCKET_TOKEN_SECRET);
  const userId = decoded.userId;

  try {
    const stock = await Stock.findById(stock_id);
    const buyPrice = stock.currentPrice;
    const totalPrice = buyPrice * quantity;
    const currentUser = await User.findById(userId);

    if (currentUser.balance < totalPrice) {
      throw new BadRequestError('Insufficient balance');
    }
    currentUser.balance -= totalPrice;
    await currentUser.save();

    const newHolding = new Holding({
      user: userId,
      stock: stock_id,
      quantity,
      buyPrice,
    });
    await newHolding.save();

    const newOrder = new Order({
      user: userId,
      stock: stock_id,
      quantity,
      price: buyPrice,
      type: 'buy',
      remainingBalance: currentUser.balance,
    });
    await newOrder.save();

    res.status(StatusCodes.CREATED).json({
      msg: 'Stock purchased successfully!',
      data: newHolding,
    });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const sellStock = async (req, res) => {
  const { holdingId, quantity } = req.body;
  if (!holdingId || !quantity) {
    throw new BadRequestError('Please provide all values');
  }

  try {
    const holding = await Holding.findById(holdingId);
    if (!holding) {
      throw new BadRequestError('Holding not found');
    }
    if (quantity > holding.quantity) {
      throw new BadRequestError('You cannot sell more than you own');
    }

    const stock = await Stock.findById(holding.stock._id);
    const sellPrice = quantity * stock.currentPrice;

    holding.quantity -= quantity;
    if (holding.quantity <= 0) {
      await Holding.findByIdAndDelete(holdingId);
    } else {
      await holding.save();
    }

    const currentUser = await User.findById(holding.user);
    if (!currentUser) {
      throw new BadRequestError('User not found');
    }

    currentUser.balance += sellPrice;
    await currentUser.save();

    const newOrder = new Order({
      user: holding.user,
      stock: holding.stock,
      quantity,
      price: stock.currentPrice,
      type: 'sell',
      remainingBalance: currentUser.balance,
    });

    await newOrder.save();

    res.status(StatusCodes.OK).json({
      msg: 'Stock sold successfully!',
      data: { orderId: newOrder._id, sellPrice },
    });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const getAllHoldings = async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(accessToken, process.env.SOCKET_TOKEN_SECRET);
  const userId = decoded.userId;

  try {
    const holdings = await Holding.find({ user: userId })
      .populate({
        path: 'stock',
        select: '-dayTimeSeries -tenMinTimeSeries',
      })
      .lean();

    const validHoldings = holdings.filter((h) => h.stock != null);

    res.status(StatusCodes.OK).json({
      msg: 'Holdings retrieved successfully!',
      data: validHoldings,
    });
  } catch (error) {
    throw new BadRequestError('Failed to retrieve holdings' + error.message);
  }
};
