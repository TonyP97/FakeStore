import { createSlice } from "@reduxjs/toolkit";

const usuariosSlice = createSlice({
    name: "usuarios",
    initialState: {
        usuarios: [],
        usuario: null,
        usuariosFiltrados: [],
        usuariosPorCategoria: [],
        usuariosPorCategoriaFiltrados: [],
    },
    reducers: {
        setUsuarios(state, action) {
            state.usuarios = action.payload;
        },
        setUsuario(state, action) {
            state.usuario = action.payload;
        },
        setUsuariosFiltrados(state, action) {
            state.usuariosFiltrados = action.payload;
        },
        setUsuariosPorCategoria(state, action) {
            state.usuariosPorCategoria = action.payload;
        },
        setUsuariosPorCategoriaFiltrados(state, action) {
            state.usuariosPorCategoriaFiltrados = action.payload;
        }
    }
});

export const {
    setUsuarios,
    setUsuario,
    setUsuariosFiltrados,
    setUsuariosPorCategoria,
    setUsuariosPorCategoriaFiltrados
} = usuariosSlice.actions;

export default usuariosSlice.reducer;