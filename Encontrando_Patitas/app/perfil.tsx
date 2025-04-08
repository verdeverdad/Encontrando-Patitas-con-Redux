import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setPerfil, clearPerfil } from "@/redux/perfilSlice";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import TabsFalsas from "@/components/tabs";
import storage from '@react-native-firebase/storage'; // Importa Firebase Storage
import { SafeAreaView } from "react-native-safe-area-context";


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
  const [telefono, setTelefono] = useState("")
  const [usuarioLogeado, setUsuarioLogeado] = useState(!!auth.currentUser); // Verifica si hay usuario logeado al inicio
  const [modo, setModo] = useState<"inicioSesion" | "registro" | null>(null); // Estado para el modo
  const [publicaciones, setPublicaciones] = useState<any[]>([]); // Estado para las publicaciones del usuario

  useEffect(() => {
    const cargarPublicacionesUsuario = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "usuarios", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const publicacionesIds = userData.publicaciones || [];

          // Cargar las publicaciones desde Firestore
          const publicacionesPromises = publicacionesIds.map(async (id: string) => {
            const docRef = doc(db, "perdidos", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              return { id, ...docSnap.data() };
            } else {
              console.warn(`La publicación con ID ${id} no existe.`);
              return null; // O algún otro valor para indicar que no se encontró
            }
          });

          const publicaciones = (await Promise.all(publicacionesPromises)).filter(p => p !== null);
          console.log("Publicaciones del usuario:", publicaciones);
          setPublicaciones(publicaciones); // Actualiza el estado local con las publicaciones
        } else {
          console.warn("No se encontró el perfil del usuario en Firestore.");
        }
      }
    };

    cargarPublicacionesUsuario();
  }, [auth.currentUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUsuarioLogeado(!!user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (perfil) {
      console.log("Actualizando estado local con datos del perfil:", perfil); // Depuración
      setNombre(perfil.nombre);
      setCorreo(perfil.correo);
      setPerfilImage(perfil.image);
      setTelefono(perfil.telefono)
      setEsNuevoUsuario(false);
      setPublicaciones(perfil.publicaciones || []); // Asegúrate de cargar las publicaciones si existen
      setTelefono(perfil.telefono || ""); // Asegúrate de cargar el teléfono si existe
    }
  }, [perfil]);
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

  const handleRegistrar = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password,);
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
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const perfilData = docSnap.data();
        console.log("Datos del perfil cargados desde Firestore:", perfilData); // Depuración
        if (perfilData && perfilData.nombre && perfilData.image) {
          dispatch(setPerfil(perfilData as { nombre: string; correo: string; telefono: string; image: string }));
          setTelefono(perfilData.telefono || ""); // Carga el teléfono al iniciar sesión
        } else {
          console.error("Los datos del perfil no tienen el formato esperado:", perfilData);
        }
      } else {
        console.warn("No se encontraron datos para este usuario en Firestore.");
      }
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

  const handleGuardarPerfil = async () => {
    if (auth.currentUser) {
      try {
        const nuevoPerfil = {
          nombre,
          correo,
          telefono, // Usa el estado local 'telefono'
          image: perfilImage || image,
        };

        // Actualiza el documento en Firestore
        await updateDoc(doc(db, "usuarios", auth.currentUser.uid), nuevoPerfil);

        // Actualiza el estado en Redux
        dispatch(setPerfil(nuevoPerfil));

        setModoEdicion(false);
        console.log("Perfil guardado en Firestore:", nuevoPerfil);
        alert("Perfil guardado correctamente.");
      } catch (error) {
        console.error("Error al guardar el perfil en Firestore:", error);
        alert("Error al guardar el perfil.");
      }
    } else {
      console.warn("No hay usuario logeado para guardar el perfil.");
      alert("No se puede guardar el perfil: usuario no logeado.");
    }
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
          <TextInput style={styles.input} placeholder="Telefono" value={telefono} onChangeText={setTelefono} />
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
          <TextInput style={styles.input} placeholder="Telefono" value={telefono} onChangeText={setTelefono} />
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

  // --- Componente para la cabecera de la FlatList ---
  const renderListHeader = () => (
    <> {/* Usamos un Fragment para agrupar elementos sin añadir un View extra */}
      <Image
        source={{ uri: perfilImage || "https://via.placeholder.com/150" }}
        style={styles.image} // Asegúrate que este estilo funcione bien aquí
      />
      <Text style={styles.titulo}>{nombre || "No disponible"}</Text>
      <Text style={styles.edad}>Correo Electrónico: {correo || "No disponible"}</Text>
      <Text style={styles.edad}>Telefono: {telefono || "No disponible"}</Text>
      {/* Mueve los botones aquí si los quieres *antes* de la lista */}
      {/* <Button title="Editar" onPress={() => setModoEdicion(true)} /> */}
      {/* <Button title="Cerrar Sesión" onPress={handleCerrarSesion} /> */}
      <Text style={styles.titulo}>Mis Publicaciones</Text>
    </>
  );

  // --- Componente para el pie de la FlatList ---
  const renderListFooter = () => (
    <>
      {/* Mueve los botones aquí si los quieres *después* de la lista */}
      <View style={styles.buttonContainer}> {/* Contenedor opcional para estilos */}
        <Button title="Editar" onPress={() => setModoEdicion(true)} />
        <Button title="Cerrar Sesión" onPress={handleCerrarSesion} />
      </View>
    </>
  );

  // --- Componente para cuando la lista está vacía ---
  const renderEmptyList = () => (
    <Text style={{ textAlign: "center", marginTop: 20 }}>No has creado publicaciones aún.</Text>
  );

  return (
    <View style={styles.container}>
      {modoEdicion ? (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <Text style={styles.titulo}>Editar Perfil</Text>
            <Image
              source={{ uri: perfilImage || "https://via.placeholder.com/150" }}
              style={styles.image}
            />          <TouchableOpacity style={[styles.selectButton, styles.amarilloBg]} onPress={pickImage}>
              <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
            <TextInput style={styles.input} placeholder="Telefono" value={telefono} onChangeText={setTelefono} />
            <Button title="Guardar" onPress={handleGuardarPerfil} />
            <Button title="Cancelar" onPress={() => setModoEdicion(false)} />
          </ScrollView>
        </SafeAreaView>
      ) : (

        // --- Vista cuando NO está en modo edición ---
        <SafeAreaView style={styles.container}> {/* Usa SafeAreaView como contenedor principal */}
          <FlatList
            data={publicaciones}
            keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
            renderItem={({ item }) => (
              // Tu JSX para cada item de la lista (el View con styles.item)
              <View style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.imageFlat} /> {/* Asegúrate que styles.imageFlat exista */}
                <View style={styles.details}>
                  <Text style={styles.titulo}>{item.titulo}</Text>
                  <Text style={styles.estado}>Estado: {item.valor}</Text>
                  <Text style={styles.sexo}>Sexo: {item.sexo}</Text>
                  <Text style={styles.localidad}>Localidad: {item.localidad}</Text>
                  <Text style={styles.edad}>Edad: {item.edad}</Text>
                  <Text style={styles.localidad}>Traslado: {item.traslado}</Text>
                  <Text style={styles.localidad}>Usuario: {nombre}</Text>
                  <Text style={{ fontSize: 12, marginVertical: 4 }}> mas info...</Text>
                </View>
              </View>
            )}
            ListHeaderComponent={renderListHeader} // Añade la cabecera
            ListFooterComponent={renderListFooter} // Añade el pie con los botones
            ListEmptyComponent={renderEmptyList}  // Muestra esto si 'publicaciones' está vacío
            contentContainerStyle={styles.listContentContainer} // Estilo opcional para el contenido interno
          />
        </SafeAreaView>
      )

      }
      <TabsFalsas></TabsFalsas>
    </View>
  );
};

const styles = StyleSheet.create({
  listContentContainer: { // Estilo opcional para añadir padding al contenido de la lista
    paddingHorizontal: 20, // Ejemplo: añade padding horizontal
    paddingBottom: 20, // Ejemplo: añade espacio al final
  },
  buttonContainer: { // Estilo opcional para los botones en el footer
    marginTop: 20, // Ejemplo: añade espacio sobre los botones
    paddingHorizontal: 20, // Ejemplo: alinea con el padding general si es necesario
  },
  container: {
    flex: 1,
    padding: 5,
    paddingBottom: 30
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
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
    width: 200, height: 200, marginBottom: 10, backgroundColor: "gray", borderRadius: 100, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.29)', alignSelf: "center" // Sombra para el botón
  },
  imageFlat: {
    width: 160, height: 260, marginBottom: 10, backgroundColor: "gray", borderRadius: 10, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
  },
  picker: { height: 60, width: "100%", marginTop: 0 },

  
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

  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#452790',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.29)', // Sombra para el botón

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