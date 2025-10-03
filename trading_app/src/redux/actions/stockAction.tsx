import { setHoldings, setStocks } from '../reducers/stockSlice';
import { socketAxios } from '../apiConfig';
import { navigate } from '../../utils/NavigationUtil';
import { formatPaisaWithCommas } from '../../utils/NumberUtils';
import { refetchUser } from './userAction';

export const getAllStocks = () => async (dispatch: any) => {
  try {
    const res = await socketAxios.get(`/stocks`);
    await dispatch(setStocks(res.data.data));
  } catch (error: any) {
    console.log('GET STOCK ERROR ---> ', error);
  }
};

export const getAllHoldings = () => async (dispatch: any) => {
  try {
    const res = await socketAxios.get(`/stocks/holding`);

    await dispatch(setHoldings(res.data.data));
  } catch (error) {
    console.log('GET HOLDINGS ERROR ---> ', error);
  }
};

interface buyStockPayload {
  stock_id: string;
  quantity: number;
  amount: number;
  companyName: string;
}

interface sellStockPayload {
  holdingId: string;
  quantity: number;
  amount: number;
  companyName: string;
}

export const buyStock =
  (payload: buyStockPayload) => async (dispatch: any) => {
    try {
      const res = await socketAxios.post('/stocks/buy', payload);
      navigate('TransactionSuccess', {
        msg: `Your investment of ${formatPaisaWithCommas(payload.amount)} completed ${
          payload.companyName
        }`,
      });

      await dispatch(refetchUser());
    } catch (error) {
      console.log('BUY STOCK ERROR ', error);
    }
  };

export const sellStock =
  (payload: sellStockPayload) => async (dispatch: any) => {
    try {
      const res = await socketAxios.post('/stocks/sell', payload);
      navigate('TransactionSuccess', {
        msg: `Your holding got sold ${formatPaisaWithCommas(payload.amount)} ${
          payload.companyName
        }`,
      });

      await dispatch(refetchUser());
    } catch (error) {
      console.log('SELL STOCK ERROR ', error);
    }
  };

// import axios from 'axios';
// import { setStocks } from '../reducers/stockSlice';
// import { BASE_URL } from '../API';
// import { token_storage } from '../storage';

// export const getAllStocks = () => async (dispatch: any) => {
//   try {
//     const socket_token = token_storage.getString('socket_access_token')
//     const res = await axios.get(`${BASE_URL}/stocks`, {
//         headers: {
//             "Authorization" : `Bearer ${socket_token}`
//         }
//     });
//   await dispatch(setStocks(res.data.data));

//   } catch (error: any) {
//     console.log('GET STOCK ERROR ---> ', error);
//   }
// };
