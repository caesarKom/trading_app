import { BadRequestError } from '../errors/index.js';
import Stock from '../models/Stock.js';

export const roundToTwoDecimals = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const generateStockData = async (symbol) => {
  const stock = await Stock.findOne({ symbol });

  if (!stock) {
    throw new BadRequestError(`Stock with symbol ${symbol} not found.`);
  }

  const now = new Date();
  const minChange = -0.02;
  const maxChange = 0.02;
  const trendChange = 0.005;
  const currentPrice = stock.currentPrice;

  const trendType = Math.random();
  let trendModifier = 0;

  if (trendType < 0.33) {
    // Sideways trend: no additional change
    trendModifier = 0;
  } else if (trendType < 0.66) {
    // Up trend: positive bias
    trendModifier = trendChange;
  } else {
    // Down trend: negative bias
    trendModifier = -trendChange;
  }

  const changePercentage =
    Math.random() * (maxChange - minChange) + minChange + trendModifier;

  const close = roundToTwoDecimals(currentPrice * (1 + changePercentage));

  const patternType = Math.random();
  let high, low;

  if (patternType < 0.15) {
    // Marubozu pattern
    high = Math.max(currentPrice, close);
    low = Math.min(currentPrice, close);
  } else if (patternType < 0.3) {
    // Hammer Pattern
    high = Math.max(currentPrice, close);
    low = Math.min(currentPrice, close) - Math.random() * 2;
  } else if (patternType < 0.45) {
    // Inverted Hammer Pattern
    high = Math.max(currentPrice, close) + Math.random() * 2;
    low = Math.min(currentPrice, close);
  } else if (patternType < 0.6) {
    // Shoting Star Pattern
    high = Math.max(currentPrice, close) + Math.random() * 2;
    low = Math.min(currentPrice, close);
  } else {
    if (Math.random() < 0.5) {
      high = close + Math.random() * 4; // long bullish candle
      low = close - Math.random() * 2;
    } else {
      high = close + Math.random() * 2;
      low = close - Math.random() * 4; // long bearish candle
    }
  }

  high = roundToTwoDecimals(high);
  low = roundToTwoDecimals(low);

  const timestamp = now.toLocaleString()
  const time = now.getTime() / 1000;
  const lastItem = stock.dayTimeSeries[stock.dayTimeSeries.length - 1];

  if (!lastItem || now - new Date(lastItem.timestamp) > 1 * 60 * 1000) {
    // 1 minutes interval
    stock.dayTimeSeries.push({
      timestamp,
      time,
      _internal_originalTime: time,
      open: roundToTwoDecimals(currentPrice),
      high,
      low,
      close,
    });
  } else {
    const updateHigh = Math.max(lastItem.high, close + Math.random() * 1);
    const updateLow = Math.min(lastItem.low, close - Math.random() * 1);
    const updateCandle = {
      high: roundToTwoDecimals(updateHigh),
      low: roundToTwoDecimals(updateLow),
      close: roundToTwoDecimals(close),
      open: lastItem.open,
      timestamp: lastItem.timestamp,
      time: lastItem.time,
      _internal_originalTime: lastItem._internal_originalTime,
    };

    stock.dayTimeSeries[stock.dayTimeSeries.length - 1] = updateCandle;
  }

  stock.dayTimeSeries = stock.dayTimeSeries.slice(-790);

  stock.currentPrice = close;

  try {
    await stock.save();
  } catch (error) {
   
    console.log('Skipping Conflicts');
  }
};

export const storeTenMinutes = async (symbol) => {
  const stock = await Stock.findOne({ symbol });

  if (!stock) {
    throw new BadRequestError(`Stock with symbol ${symbol} not found.`);
  }

  const now = new Date();
  const currentPrice = stock.currentPrice;
  const latestItem = stock.dayTimeSeries[stock.dayTimeSeries.length - 1];

  const timestamp = now.toLocaleString()
  // 10 min candle
  const time = now.getTime() / 1000;

  stock.tenMinTimeSeries.push({
    timestamp,
    time,
    _internal_originalTime: time,
    open: roundToTwoDecimals(currentPrice),
    high: roundToTwoDecimals(latestItem.high),
    low: roundToTwoDecimals(latestItem.low),
    close: roundToTwoDecimals(latestItem.close),
  });

  try {
    await stock.save();
  } catch (error) {
    console.log('Skipping Conflicts');
  }
};
