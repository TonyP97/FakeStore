import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loginSlice from './features/login/loginSlice';
import carritoSlice from './features/carrito/carritoSlice';
import productosSlice from './features/productos/productosSlice';
import usuariosSlice from './features/usuarios/usuariosSlice';


const rootReducer = combineReducers({
    login: loginSlice,
    carrito: carritoSlice,
    productos: productosSlice,
    usuarios: usuariosSlice
  });

const store = configureStore({
  reducer: rootReducer
});

export default store;
