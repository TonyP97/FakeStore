import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loginSlice from './features/login/loginSlice';
import carritoSlice from './features/carrito/carritoSlice';


const rootReducer = combineReducers({
    login: loginSlice,
    carrito: carritoSlice
  });

const store = configureStore({
  reducer: rootReducer
});

export default store;
