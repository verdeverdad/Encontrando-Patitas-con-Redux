import { configureStore } from "@reduxjs/toolkit";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

import counterReducer from "@/redux/contadorSlice";
// import todoReducer from "@/redux/nuevaPublicacion";
import perdidosReducer from "@/redux/perdidosSlice";
import perfilReducer from "@/redux/perfilSlice";

export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    // todos: todoReducer,
    todos: perdidosReducer,
    perfil: perfilReducer,

  },
  devTools: false,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
});

