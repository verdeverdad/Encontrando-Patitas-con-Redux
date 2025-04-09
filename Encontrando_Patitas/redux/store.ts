import { configureStore } from "@reduxjs/toolkit";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";


import perdidosReducer from "@/redux/perdidosSlice";
import perfilReducer from "@/redux/perfilSlice";

export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: {
   
    todos: perdidosReducer,
    perfil: perfilReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false, // Deshabilita el chequeo de serialización
    }),
  devTools: false,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
});

