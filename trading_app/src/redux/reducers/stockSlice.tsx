import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface stockState {
  stocks: object[];
  holdings: object[];
}

const initialState: stockState = {
  stocks: [],
  holdings: []
};

export const stocksSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStocks: (state, action: PayloadAction<object[]>) => {
      state.stocks = action.payload;
    },
    setHoldings: (state, action: PayloadAction<object[]>) => {
      state.holdings = action.payload;
    },
  },
});

export const { setStocks, setHoldings } = stocksSlice.actions;
export const selectStocks = (state: RootState) => state.stock.stocks
export const selectHoldings = (state: RootState) => state.stock.holdings

export default stocksSlice.reducer;
