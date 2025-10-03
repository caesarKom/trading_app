import { combineReducers } from 'redux';
import userReducer from './reducers/userSlice';
import stockReducer from './reducers/stockSlice';

const rootReducer = combineReducers({
  user: userReducer,
  stock: stockReducer,
});

export default rootReducer;
