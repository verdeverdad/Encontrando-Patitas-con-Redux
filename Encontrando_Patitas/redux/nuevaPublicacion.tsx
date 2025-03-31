import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    data: [] as { id: number; text: string }[], // Store list of todos
  },
  reducers: {
    setTodos: (state, action) => {
      state.data = action.payload;
    },
    addTodo: (state, action) => {
      state.data.push({ id: Date.now(), text: action.payload });
    },
    updateTodo: (state, action) => {
      const { id, newText } = action.payload;
      const todo = state.data.find((todo) => todo.id === id);
      if (todo) {
        todo.text = newText;
      }
    },
    deleteTodo: (state, action) => {
      state.data = state.data.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { setTodos, addTodo, updateTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;