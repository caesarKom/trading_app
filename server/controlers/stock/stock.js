import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../../errors/index.js';
import Stock from '../../models/Stock.js';

export const registerStock = async (req, res) => {
  const { symbol, companyName, currentPrice, lastDayTradedPrice, iconUrl } =
    req.body;
  if (
    !symbol ||
    !companyName ||
    !currentPrice ||
    !lastDayTradedPrice ||
    !iconUrl
  ) {
    throw new BadRequestError('Please provide all values');
  }

  try {
    const stockAlreadyExist = await Stock.findOne({ symbol });
    if (stockAlreadyExist) {
      throw new BadRequestError('Stock already exists');
    }

    const newStock = new Stock({
      symbol,
      companyName,
      currentPrice,
      lastDayTradedPrice,
      iconUrl,
    });

    await newStock.save();

    res.status(StatusCodes.CREATED).json({
      msg: 'Stock added successfully',
      data: newStock,
    });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().select(
      '-dayTimeSeries -tenMinTimeSeries'
    );

    res.status(StatusCodes.OK).json({
      msg: 'Stocks retrived successfully',
      data: stocks,
    });
  } catch (error) {
    throw new BadRequestError('failed to retrive stocks. ' + error.message);
  }
};

export const getStockBySymbol = async (req, res) => {
  const { stock: symbol } = req.query;
  if (!symbol) {
    throw new BadRequestError('Please provide stock symbol');
  }

  try {
    const stock = await Stock.findOne({ symbol }).select(
      '-dayTimeSeries -tenMinTimeSeries'
    );
    if (!stock) {
      throw new NotFoundError('Stock not found');
    }

    res.status(StatusCodes.OK).json({
      msg: 'Stock retrived successfully',
      data: stock,
    });
  } catch (error) {
    throw new BadRequestError(
      'failed to retrive stock symbol. ' + error.message
    );
  }
};
