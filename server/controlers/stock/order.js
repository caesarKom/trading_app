import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../errors/index.js';
import Order from '../../models/Order.js';
import jwt from 'jsonwebtoken';

export const getOrder = async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(accessToken, process.env.SOCKET_TOKEN_SECRET);
  const userId = decoded.userId;

  try {
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'user',
        select: '-password -biometricKey -login_pin',
      })
      .populate({
        path: 'stock',
        select: 'symbol companyName iconUrl lastDayTradedPrice currentPrice',
      })
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      msg: 'Orders retrieved successfully!',
      data: orders,
    });

    res.status(StatusCodes.OK).json({
      msg: 'Holdings retrieved successfully!',
      data: holdings,
    });
  } catch (error) {
    throw new BadRequestError('Failed to retrieve orders.' + error.message);
  }
};
