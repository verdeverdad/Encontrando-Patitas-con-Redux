import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setPerfil, clearPerfil } from "@/redux/perfilSlice";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { router } from "expo-router";

const Perfil = () => {
  const dispatch = useDispatch();
  const perfil = useSelector((state: any) => state.perfil.data);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [esNuevoUsuario, setEsNuevoUsuario] = useState(true);

  useEffect(() => {
    if (perfil) {
      setNombre(perfil.nombre);
      setCorreo(perfil.correo);
      setEsNuevoUsuario(false);
    }
  }, [perfil]);

  const handleRegistrar = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
      const user = userCredential.user;
  
      // Datos del perfil
      const nuevoPerfil = { nombre, correo: user.email || "", telefono: "" };
  
      // Guarda los datos en Firestore
      await setDoc(doc(db, "usuarios", user.uid), nuevoPerfil);
  
      // Actualiza el estado en Redux
      dispatch(setPerfil(nuevoPerfil));
      console.log("Usuario registrado y datos guardados en Firestore:", nuevoPerfil);
      setEsNuevoUsuario(false);
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };
  const handleIniciarSesion = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, correo, password);
      const user = userCredential.user;
  
      // Obtén los datos del usuario desde Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const perfilData = docSnap.data();
        if (perfilData && perfilData.nombre && perfilData.correo && perfilData.telefono) {
          dispatch(setPerfil(perfilData as { nombre: string; correo: string; telefono: string }));
        } else {
          console.error("Los datos del perfil no tienen el formato esperado:", perfilData);
        }
        console.log("Usuario autenticado y datos cargados desde Firestore:", perfilData);
      } else {
        console.warn("No se encontraron datos para este usuario en Firestore.");
      }
  
      setEsNuevoUsuario(false);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleCerrarSesion = async () => {
    try {
      await signOut(auth);
      dispatch(clearPerfil());
      setEsNuevoUsuario(true);
      setNombre("");
      setCorreo("");
      setPassword("");
      console.log("Sesión cerrada correctamente.");
      alert("Sesión cerrada correctamente.");
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleGuardarPerfil = () => {
    const nuevoPerfil = { nombre, correo, telefono: perfil?.telefono || "" };
    dispatch(setPerfil(nuevoPerfil));
    setModoEdicion(false);
  };

  if (esNuevoUsuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Registro o Inicio de Sesión</Text>
        <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <Button title="Registrar" onPress={handleRegistrar} />
        <Button title="Iniciar Sesión" onPress={handleIniciarSesion} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {modoEdicion ? (
        <>
          <Text style={styles.titulo}>Editar Perfil</Text>
          <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
          <Button title="Guardar" onPress={handleGuardarPerfil} />
          <Button title="Cancelar" onPress={() => setModoEdicion(false)} />
        </>
      ) : (
        <>
          <Text style={styles.titulo}>Perfil</Text>
          <Text>Nombre: {nombre}</Text>
          <Text>Correo Electrónico: {correo}</Text>
          <Button title="Editar" onPress={() => setModoEdicion(true)} />
          <Button title="Cerrar Sesión" onPress={handleCerrarSesion} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Perfil;