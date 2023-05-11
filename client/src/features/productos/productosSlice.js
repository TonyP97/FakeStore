import { createSlice } from "@reduxjs/toolkit";

const productosSlice = createSlice({
    name: "productos",
    initialState: {
        productos: [],
        producto: null,
        productosFiltrados: [],
        categorias: [],
        categoriasFiltradas: [],
        productosPorCategoria: [],
        productosPorCategoriaFiltrados: [],
    },
    reducers: {
        setProductos(state, action) {
            state.productos = action.payload;
        },
        setProducto(state, action) {
            state.producto = action.payload;
        },
        setProductosFiltrados(state, action) {
            state.productosFiltrados = action.payload;
        },
        setCategorias(state, action) {
            state.categorias = action.payload;
        },
        setCategoriasFiltradas(state, action) {
            state.categoriasFiltradas = action.payload;
        }
    }
});

export const {
    setProductos,
    setProducto,
    setProductosFiltrados,
    setCategorias,
    setCategoriasFiltradas
} = productosSlice.actions;

