import express from 'express';

import {
  getAllStocks,
  getStockBySymbol,
  registerStock,
} from '../controlers/stock/stock.js';
import {
  buyStock,
  getAllHoldings,
  sellStock,
} from '../controlers/stock/holding.js';
import { getOrder } from '../controlers/stock/order.js';

const router = express.Router();

router.get('', getAllStocks);
router.get('/stock', getStockBySymbol);
router.get('/order', getOrder);
router.get('/holding', getAllHoldings);
router.post('/register', registerStock);
router.post('/buy', buyStock);
router.post('/sell', sellStock);

export default router;
