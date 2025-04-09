// perfilSlice.tsx
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PerfilState {
  data: {
    nombre: string;
    correo: string;
    telefono: string;
  } | null;
}

const initialState: PerfilState = {
  data: null,
};

const perfilSlice = createSlice({
  name: "perfil",
  initialState,
  reducers: {
    setPerfil: (state, action: PayloadAction<{ nombre: string; correo: string; telefono: string; image: string;  }>) => {
      state.data = action.payload;
    },
    clearPerfil: (state) => {
      state.data = null;
    },
  },
});

export const { setPerfil, clearPerfil } = perfilSlice.actions;
export default perfilSlice.reducer;