import { createSlice } from '@reduxjs/toolkit';

const carritoSlice = createSlice({
  name: 'carrito',
  initialState: {
    carrito: [],
    usuario: null,
    carrosFinalizados: []
  },
  reducers: {
    setCarrito(state, action) {
        state.carrito = action.payload;
    },
    setUsuario(state, action) {
        state.usuario = action.payload;
    },
    setCarrosFinalizados(state, action) {
        state.carrosFinalizados = action.payload;
    }
  },
});

export const {
    setCarrito,
    setUsuario,
    setCarrosFinalizados
} = carritoSlice.actions;

export default carritoSlice.reducer;
