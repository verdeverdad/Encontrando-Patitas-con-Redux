import { createSlice } from "@reduxjs/toolkit";

const perdidosSlice = createSlice({
  name: "todos",
  initialState: {
    data: [] as { id: number; text: string }[], // Store list of todos
  },
  reducers: {
    setPerdidos: (state, action) => {
      state.data = action.payload;
    },
    addPerdidos: (state, action) => {
      state.data.push({ id: Date.now(), text: action.payload });
    },
    updatePerdidos: (state, action) => {
      const { id, newText } = action.payload;
      const todo = state.data.find((todo) => todo.id === id);
      if (todo) {
        todo.text = newText;
      }
    },
    deletePerdidos: (state, action) => {
      state.data = state.data.filter((Perdidos) => Perdidos.id !== action.payload);
    },
  },
});

export const { setPerdidos, addPerdidos, updatePerdidos, deletePerdidos } = perdidosSlice.actions;
export default perdidosSlice.reducer;