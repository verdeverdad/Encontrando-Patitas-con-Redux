import { createSlice } from "@reduxjs/toolkit";


const perdidosSlice = createSlice({
  name: "todos",
  initialState: {
    data: [] as {
      id: number;
      titulo: string;
      estado?: string;
      sexo?: string;
      edad?: string;
      localidad?: string;
      traslado?: string;
      image?: string;
      fechaPublicacion?: string,
      descripcion?: string,

      
}[], // Store list of todos
  },
  reducers: {
    setPerdidos: (state, action) => {
      state.data = action.payload;
    },
    addPerdidos: (state, action) => {
      state.data.push({
        id: Date.now(),
         estado: "",
        titulo: "",
        edad: undefined
      });
    },
    updatePerdidos: (state, action) => {
      const { id, newText } = action.payload;
      const todo = state.data.find((todo) => todo.id === id);
      if (todo) {
        todo.titulo = newText;
      }
    },
    deletePerdidos: (state, action) => {
      state.data = state.data.filter((Perdidos) => Perdidos.id !== action.payload);
    },
  },
});

export const { setPerdidos, addPerdidos, updatePerdidos, deletePerdidos } = perdidosSlice.actions;
export default perdidosSlice.reducer;