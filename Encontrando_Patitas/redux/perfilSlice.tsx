import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";

// Define el tipo para los datos del perfil
interface PerfilData {
  nombre: string;
  correo: string;
  telefono: string;
}

// Define el tipo para el estado del perfil
interface PerfilState {
  data: PerfilData | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

// Estado inicial del perfil
const initialState: PerfilState = {
  data: null,
  loading: "idle",
  error: null,
};

// Acción asíncrona para guardar el perfil en Firebase
export const savePerfilToFirebase = createAsyncThunk(
  "perfil/savePerfilToFirebase",
  async (perfilData: PerfilData) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid), perfilData);
      return perfilData;
    } else {
      throw new Error("Usuario no autenticado");
    }
  }
);

// Acción asíncrona para eliminar el perfil de Firebase
export const deletePerfilFromFirebase = createAsyncThunk(
  "perfil/deletePerfilFromFirebase",
  async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await deleteDoc(doc(db, "users", user.uid));
      return null; // Devuelve null para indicar que no hay datos de perfil
    } else {
      throw new Error("Usuario no autenticado");
    }
  }
);

// Acción asíncrona para cargar el perfil desde Firebase
export const loadPerfilFromFirebase = createAsyncThunk(
  "perfil/loadPerfilFromFirebase",
  async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as PerfilData;
      } else {
        return null; // No hay datos de perfil
      }
    } else {
      throw new Error("Usuario no autenticado");
    }
  }
);

// Slice del perfil
const perfilSlice = createSlice({
  name: "perfil",
  initialState,
  reducers: {
    setPerfil: (state, action: PayloadAction<PerfilData>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Guardar perfil
      .addCase(savePerfilToFirebase.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(savePerfilToFirebase.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(savePerfilToFirebase.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Error al guardar el perfil";
      })

      // Eliminar perfil
      .addCase(deletePerfilFromFirebase.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(deletePerfilFromFirebase.fulfilled, (state) => {
        state.loading = "succeeded";
        state.data = null; // El perfil se elimina, por lo que el estado debe ser null
      })
      .addCase(deletePerfilFromFirebase.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Error al eliminar el perfil";
      })

      // Cargar perfil
      .addCase(loadPerfilFromFirebase.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(loadPerfilFromFirebase.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(loadPerfilFromFirebase.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Error al cargar el perfil";
      });
  },
});

// Exporta las acciones y el reducer
export const { setPerfil } = perfilSlice.actions;
export default perfilSlice.reducer;