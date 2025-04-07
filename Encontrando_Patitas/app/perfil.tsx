import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setPerfil, clearPerfil } from "@/redux/perfilSlice";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import TabsFalsas from "@/components/tabs";

const Perfil = () => {
  const dispatch = useDispatch();
  const perfil = useSelector((state: any) => state.perfil.data);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [esNuevoUsuario, setEsNuevoUsuario] = useState(true);
  const [perfilImage, setPerfilImage] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [usuarioLogeado, setUsuarioLogeado] = useState(!!auth.currentUser); // Verifica si hay usuario logeado al inicio
  const [mostrarInicioSesion, setMostrarInicioSesion] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [modo, setModo] = useState<"inicioSesion" | "registro" | null>(null); // Estado para el modo



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setPerfilImage(result.assets[0].uri);
      setImage(result.assets[0].uri); // Actualiza la URL de la imagen
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        setUsuarioLogeado(!!user);
    });
    return unsubscribe;
}, []);

  useEffect(() => {
    if (perfil) {
      setNombre(perfil.nombre);
      setCorreo(perfil.correo);
      setPerfilImage(perfil.image);
      setEsNuevoUsuario(false);
    }
  }, [perfil]);

  const handleRegistrar = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
      const user = userCredential.user;

      // Datos del perfil
      const nuevoPerfil = { nombre, correo: user.email || "", telefono: "", image: image };

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
        if (perfilData && perfilData.nombre && perfilData.correo && perfilData.telefono && perfilData.image) {
          dispatch(setPerfil(perfilData as { nombre: string; correo: string; telefono: string; image: string }));
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
      setPerfilImage("")
      console.log("Sesión cerrada correctamente.");
      alert("Sesión cerrada correctamente.");
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleGuardarPerfil = () => {
    const nuevoPerfil = { nombre, correo, telefono: perfil?.telefono || "", image: perfilImage || "" };
    dispatch(setPerfil(nuevoPerfil));
    setModoEdicion(false);
  };

  if (!usuarioLogeado) {
    if (modo === "inicioSesion") {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Iniciar Sesión</Text>
                <TextInput style={styles.input} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
                <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
                <Button title="Iniciar Sesión" onPress={handleIniciarSesion} />
                <Button title="Cancelar" onPress={() => setModo(null)} />
                <TabsFalsas />
            </View>
        );
    } else if (modo === "registro") {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Registrarse</Text>
                <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                <TextInput style={styles.input} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
                <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
                <TextInput style={[styles.input, { display: "none" }]} placeholder="Ingrese URL de la imagen" value={image} onChangeText={setImage} />
                <TouchableOpacity style={[styles.selectButton, styles.amarilloBg]} onPress={pickImage}>
                    <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
                </TouchableOpacity>
                <Button title="Registrarse" onPress={handleRegistrar} />
                <Button title="Cancelar" onPress={() => setModo(null)} />
                {perfilImage && <Image source={{ uri: perfilImage }} style={styles.image} />}
                <TabsFalsas />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Button title="Iniciar Sesión" onPress={() => setModo("inicioSesion")} />
                <Button title="Registrarse" onPress={() => setModo("registro")} />
                <TabsFalsas />
            </View>
        );
    }
}

  if (esNuevoUsuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Registro o Inicio de Sesión</Text>
        <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={[styles.input, { display: "none" }]} placeholder="Ingrese URL de la imagen" value={image} onChangeText={setImage} />
        <TouchableOpacity style={[styles.selectButton, styles.amarilloBg]} onPress={pickImage}>
          <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
        </TouchableOpacity>
        <Button title="Registrar" onPress={handleRegistrar} />
        <Button title="Iniciar Sesión" onPress={handleIniciarSesion} />
        {perfilImage && <Image source={{ uri: perfilImage }} style={styles.image} />}
        <TabsFalsas></TabsFalsas>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {modoEdicion ? (
        <>
          <Text style={styles.titulo}>Editar Perfil</Text>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={[styles.selectButton, styles.amarilloBg]} onPress={pickImage}>
            <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
          <Button title="Guardar" onPress={handleGuardarPerfil} />
          <Button title="Cancelar" onPress={() => setModoEdicion(false)} />
          <TabsFalsas></TabsFalsas>
        </>
      ) : (
        <>
          <Image source={{ uri: image }} style={styles.image} />

          <Text style={styles.titulo}>Perfil</Text>
          <Text>Nombre: {nombre}</Text>
          <Text>Correo Electrónico: {correo}</Text>
          <Button title="Editar" onPress={() => setModoEdicion(true)} />
          <Button title="Cerrar Sesión" onPress={handleCerrarSesion} />
        </>
      )}
      <TabsFalsas></TabsFalsas>
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

  safeArea: { flex: 1 },
  inputContainer: { flexDirection: "row", padding: 10 },
  input3: { marginTop: 10, padding: 10, borderColor: "gray", borderWidth: 1 },
  details: { flex: 1, margin: 15 },
  titulo2: { fontSize: 18, fontWeight: "bold" },
  edad: { fontSize: 14, color: "gray" },
  sexo: { fontSize: 14, color: "gray" },
  localidad: { fontSize: 14, color: "gray" },
  estado: { fontSize: 16, color: "black", fontWeight: "bold" },
  image: {
    width: 160, height: 260, marginBottom: 10, backgroundColor: "gray", borderRadius: 10, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.29)', // Sombra para el botón
  },
  picker: { height: 60, width: "100%", marginTop: 0 },
  input2: {
    height: 40,
    margin: 5,
    paddingHorizontal: 10,
  },
  modalContainer: {
    padding: 20,
    flexDirection: 'row',

  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#452790',
  },
  selectButtonModal: {
    borderWidth: 2,
    backgroundColor: "#452790",
    color: '#ffffff',
    borderColor: 'white',
    padding: 10,
    borderRadius: 10,
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón

    marginBottom: 30,
    width: 'auto',
    fontSize: 16,
    height: 60,
    alignItems: "center", // Centra el texto horizontalmente
    justifyContent: "center", // Centra el texto verticalmente
  },
  selectButton: {
    borderWidth: 2,
    backgroundColor: "#f01250",
    color: '#ffffff',
    borderColor: 'white',
    borderRadius: 20,
    marginBottom: 10,
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón

    width: 'auto',
    fontSize: 16,
    height: 40,
    alignItems: "center", // Centra el texto horizontalmente
    justifyContent: "center", // Centra el texto verticalmente
  },
  selectButtonHome: {
    borderWidth: 1,
    backgroundColor: "#f01250",
    color: '#ffffff',
    borderColor: 'gray',
    padding: 10,
    borderRadius: 0,
    marginBottom: 0,
    width: 'auto',
    fontSize: 16,
    height: 40,
    alignItems: "center", // Centra el texto horizontalmente
    justifyContent: "center", // Centra el texto verticalmente
  },
  fixedButton: {
    position: "absolute", // Fija el botón
    bottom: 30, // Espaciado desde la parte inferior
    left: 35, // Espaciado desde la izquierda
    right: 35, // Espaciado desde la derecha
    padding: 15, // Espaciado interno
    borderRadius: 30, // Bordes redondeados
    alignItems: "center", // Centra el texto horizontalmente
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#452790',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.29)', // Sombra para el botón

  },
  authButton: {
    backgroundColor: "#452790",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
},
authButtonText: {
  backgroundColor: "#452790",

    color: "white",
    fontSize: 16,
    fontWeight: "bold",
},
authForm: {
    marginTop: 20,
},


  rojo: {
    color: "#f01250"
  },

  violeta: {
    color: "#a31288"
  },
  celeste: {
    color: "#018cae"
  },
  verde: {
    color: "#28cf54"
  },
  amarillo: {
    color: "#f7a423"
  },
  azulado: {
    color: "#452790"
  },
  blanco: {
    color: "#ffffff"
  },
  rojoBg: {
    backgroundColor: "#f01250"
  },

  violetaBg: {
    backgroundColor: "#a31288"
  },
  celesteBg: {
    backgroundColor: "#018cae"
  },
  verdeBg: {
    backgroundColor: "#28cf54"
  },
  amarilloBg: {
    backgroundColor: "#f7a423"
  },
  azuladoBg: {
    backgroundColor: "#452790"
  },
  blancoBg: {
    backgroundColor: "#ffffff"
  },
});

export default Perfil;