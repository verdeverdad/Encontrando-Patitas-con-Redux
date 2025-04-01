// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "1:705950686931:android:c8a80807c0501713f3be26",
  authDomain: "encontrando-patitas.firebaseapp.com",
  projectId: "encontrando-patitas",
  storageBucket: "encontrando-patitas.appspot.com",
  messagingSenderId: "705950686931",
  appId: "1:705950686931:web:c8a80807c0501713f3be26", 
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
export const db = getFirestore(app);

console.log("Firebase inicializado correctamente.");