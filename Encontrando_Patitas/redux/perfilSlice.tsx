import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define el tipo para el estado del perfil
interface PerfilState {
    data: {
        nombre: string;
        correo: string;
    } | null;
}

// Define el estado inicial del perfil
const initialState: PerfilState = {
    data: null,
};

// Crea el slice del perfil
const perfilSlice = createSlice({
    name: "perfil",
    initialState,
    reducers: {
        setPerfil: (state, action: PayloadAction<{ nombre: string; correo: string }>) => {
            state.data = action.payload;
        },
    },
});

// Exporta la acción y el reducer
export const { setPerfil } = perfilSlice.actions;
export default perfilSlice.reducer;