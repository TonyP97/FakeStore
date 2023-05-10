import { createSlice } from '@reduxjs/toolkit';

const carritoSlice = createSlice({
  name: 'carrito',
  initialState: {
    carrito: [],
    usuario: null,
    carroActualizado: []
  },
  reducers: {
    setCarrito(state, action) {
        state.carrito = action.payload;
    },
    setUsuario(state, action) {
        state.usuario = action.payload;
    },
    setCarroActualizado(state, action) {
        state.carroActualizado = action.payload;
    }
  },
});

export const {
    setCarrito,
    setUsuario,
    setCarroActualizado
} = carritoSlice.actions;

export default carritoSlice.reducer;
