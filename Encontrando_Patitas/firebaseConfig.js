// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZU-txbm-BDpiputiZKiteLVQwn4yIRPY",
  authDomain: "encontrando-patitas.firebaseapp.com",
  projectId: "encontrando-patitas",
  storageBucket: "encontrando-patitas.appspot.com",
  messagingSenderId: "705950686931",
  appId: "1:705950686931:web:c8a80807c0501713f3be26", 
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);


export { auth, db };

console.log("Firebase inicializado correctamente.");