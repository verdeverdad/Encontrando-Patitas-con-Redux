import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, Alert, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setPerfil, clearPerfil } from "@/redux/perfilSlice";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import TabsFalsas from "@/components/tabs";
import { SafeAreaView, } from "react-native-safe-area-context";
import { NavBar } from "@/components/Navbar";
import PublicarMascota from "@/components/publicarMascota";
import AsyncStorage from "@react-native-async-storage/async-storage";


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
  const [descripcion, setDescripcion] = useState("");
  const [telefono, setTelefono] = useState("")
  const [usuarioLogeado, setUsuarioLogeado] = useState(!!auth.currentUser); // Verifica si hay usuario logeado al inicio
  const [modo, setModo] = useState<"inicioSesion" | "registro" | null>(null); // Estado para el modo
  const [publicaciones, setPublicaciones] = useState<any[]>([]); // Estado para las publicaciones del usuario
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null); // Nuevo estado para controlar qué item está expandido
  const [isGuardandoPerfil, setIsGuardandoPerfil] = useState(false); // Nuevo estado de carga


  const SESSION_ACTIVE_KEY = 'sessionActive';

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionActive = await AsyncStorage.getItem(SESSION_ACTIVE_KEY);
        if (!sessionActive && auth.currentUser) {
          console.log("Posible cierre inesperado o recarga. Limpiando sesión local.");
          dispatch(clearPerfil());
          // No se recomienda cerrar sesión en Firebase Auth aquí, ya que podría ser un cierre por el sistema o una recarga.
          // La mejor práctica es que el usuario cierre sesión explícitamente.
          router.replace('/'); // O redirigir a la pantalla de inicio
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      }
    };

    checkSession();
  }, []);
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

  useEffect(() => {
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
      setDescripcion(perfil.descripcion)
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
      const nuevoPerfil = { nombre, correo: user.email || "", telefono: telefono, image: image };

      // Guarda los datos en Firestore
      await setDoc(doc(db, "usuarios", user.uid), nuevoPerfil);

      // Actualiza el estado en Redux
      dispatch(setPerfil(nuevoPerfil));
      console.log("Usuario registrado y datos guardados en Firestore:", nuevoPerfil);
      setEsNuevoUsuario(false);
    } catch (error) {
      console.error("Error al registrar:", error);
    }
    await AsyncStorage.setItem(SESSION_ACTIVE_KEY, 'true');

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
    await AsyncStorage.setItem(SESSION_ACTIVE_KEY, 'true');

  };
  const handleCerrarSesion = async () => {
    try {
      await signOut(auth);
      dispatch(clearPerfil());
      await AsyncStorage.removeItem(SESSION_ACTIVE_KEY);
      setUsuarioLogeado(false);
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
    setIsGuardandoPerfil(true); // Inicia la carga

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
        cargarPublicacionesUsuario();
      } catch (error) {
        console.error("Error al guardar el perfil en Firestore:", error);
        alert("Error al guardar el perfil.");
      } finally {
        setIsGuardandoPerfil(false); // Finaliza la carga
      }
    } else {
      console.warn("No hay usuario logeado para guardar el perfil.");
      alert("No se puede guardar el perfil: usuario no logeado.");
      setIsGuardandoPerfil(false);
    }
  };

  const handleBorrarPublicacion = async (publicacionId: string) => {
    Alert.alert(
      "Borrar Publicación",
      "¿Estás seguro de que quieres borrar esta publicación?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            if (auth.currentUser) {
              try {
                // Borrar el documento de la colección "perdidos"
                await deleteDoc(doc(db, "perdidos", publicacionId));
                console.log(`Publicación con ID ${publicacionId} borrada.`);

                // Actualizar el array 'publicaciones' en el documento del usuario
                const userDocRef = doc(db, "usuarios", auth.currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                  const userData = userDocSnap.data();
                  const publicacionesActualizadas = (userData.publicaciones || []).filter(
                    (id: string) => id !== publicacionId
                  );
                  await updateDoc(userDocRef, { publicaciones: publicacionesActualizadas });
                  console.log("Referencia de publicación borrada del perfil del usuario.");
                  // Recargar las publicaciones del usuario
                  cargarPublicacionesUsuario();
                  Alert.alert("Éxito", "La publicación ha sido borrada correctamente.");

                } else {
                  console.warn("No se encontró el perfil del usuario al intentar actualizar las publicaciones.");
                }
              } catch (error) {
                console.error("Error al borrar la publicación:", error);
                Alert.alert("Error", "No se pudo borrar la publicación.");
              }
            } else {
              Alert.alert("Error", "Usuario no autenticado.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleCancelar = () => {
    setNombre("");
    setCorreo("");
    setTelefono("");
    setPerfilImage("");
    setDescripcion("");
    setImage("");
    setModo(null)
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };


  if (!usuarioLogeado) {
    if (modo === "registro") {
      return (<View style={{ flex: 1 }}><NavBar />
        <View style={styles.container}>
          <View style={styles.containerInicioSesion}>
            <Text style={styles.titulo}>Registrarse</Text>
            <TextInput style={styles.inputInicio} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.inputInicio} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
            <TextInput style={styles.inputInicio} placeholder="Telefono" value={telefono} onChangeText={setTelefono} />
            <TextInput style={styles.inputInicio} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={[styles.inputInicio, { display: "none" }]} placeholder="Ingrese URL de la imagen" value={image} onChangeText={setImage} />
            {!perfilImage && <TouchableOpacity style={[styles.buttonsInicio, styles.amarilloBg, { marginTop: 15 }]} onPress={pickImage}>
              <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
            </TouchableOpacity>}
            {perfilImage && <Image source={{ uri: perfilImage }} style={styles.image} />}
            <TouchableOpacity
              style={[styles.buttonsInicio, styles.celesteBg]}
              onPress={handleRegistrar}
            >
              <Text style={styles.blanco}>REGISTRARME</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonsInicio, styles.rojoBg]} onPress={handleCancelar}>
              <Text style={styles.blanco}>CANCELAR</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
      )
    } else {
      return (<View style={{ flex: 1 }}><NavBar />
        <View style={styles.container}>

          <View style={styles.containerInicioSesion}>
            <Text style={styles.titulo}>Iniciar Sesión</Text>
            <TextInput style={styles.inputInicio} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
            <TextInput style={styles.inputInicio} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <Text></Text>
            <TouchableOpacity style={[styles.buttonsInicio, styles.celesteBg]} onPress={handleIniciarSesion}>
              <Text style={styles.blanco}>INICIAR SESIÓN</Text>
            </TouchableOpacity>
            <Text style={styles.edad}>¿Aun no tienes cuenta?</Text>
            <TouchableOpacity style={[styles.buttonsInicio, styles.amarilloBg]} onPress={() => setModo("registro")}>
              <Text style={styles.blanco}>REGISTRARME</Text>
            </TouchableOpacity>


          </View>
        </View>
      </View>
      )
    }
  }

  // --- Componente para la cabecera de la FlatList ---
  const renderListHeader = () => (
    <>
      <View style={styles.datosContainer}>
        <Image
          source={{ uri: perfilImage || "https://via.placeholder.com/150" }}
          style={styles.image}
        />
        <Text style={styles.titulo}>{nombre || <ActivityIndicator></ActivityIndicator>}</Text>
        <Text style={styles.correo}>{correo || <ActivityIndicator></ActivityIndicator>}</Text>
        <Text style={styles.correo}>{telefono || <ActivityIndicator></ActivityIndicator>}</Text>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity style={styles.buttons} onPress={() => setModoEdicion(true)}><Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>EDITAR</Text></TouchableOpacity>
          <TouchableOpacity style={styles.buttons2} onPress={handleCerrarSesion}><Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>CERRAR SESIÓN</Text></TouchableOpacity>
        </View>
      </View>
      <Text style={styles.tituloPublicaciones}>Mis Publicaciones</Text>
    </>
  );

  // --- Componente para el pie de la FlatList ---
  // const renderListFooter = () => (
  //   <>
  //     <View style={styles.buttonContainer}>
  //       <Button title="Editar" onPress={() => setModoEdicion(true)} />
  //       <Button title="Cerrar Sesión" onPress={handleCerrarSesion} />
  //     </View>
  //   </>
  // );

  // --- Componente para cuando la lista está vacía ---
  const renderEmptyList = () => (
    <Text style={{ textAlign: "center", marginTop: 20 }}>No has creado publicaciones aún.</Text>
  );



  return (
    <View style={{ flex: 1 }}><NavBar />
      <View style={styles.container}>
        {modoEdicion ? (
          <SafeAreaView style={styles.container}>
            <ScrollView>
              <Text style={styles.titulo}>Editar Perfil</Text>
              <Image
                source={{ uri: perfilImage || "https://via.placeholder.com/150" }}
                style={styles.image}
              /><TouchableOpacity style={[styles.selectButton, styles.amarilloBg]} onPress={pickImage}>
                <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
              </TouchableOpacity>
              <Text style={styles.label}>Nombre:</Text>
              <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
              <Text style={styles.label}>Correo:</Text>
              <TextInput style={styles.input} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
              <Text style={styles.label}>Telefono:</Text>
              <TextInput style={styles.input} placeholder="Telefono" value={telefono} onChangeText={setTelefono} />

              <View style={{ alignItems: "center" }}>
                {isGuardandoPerfil ? (
                  <ActivityIndicator size="large" color={styles.celesteBg.backgroundColor} />
                ) : (
                  <TouchableOpacity style={styles.buttons} onPress={handleGuardarPerfil}>
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>GUARDAR</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.buttons3} onPress={() => setModoEdicion(false)}>
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>CANCELAR</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        ) : ( // --- Vista cuando NO está en modo edición ---
          <SafeAreaView style={styles.container}>
            <FlatList
              data={publicaciones}
              keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Image source={{ uri: item.image }} style={styles.imageFlat} />
                  <View style={styles.details}>
                    <Text style={styles.titulo2}>{item.titulo}</Text>
                    <Text style={styles.estado}>{item.valor}</Text>
                    <Text style={styles.sexo}>Sexo: {item.sexo}</Text>
                    <Text style={styles.localidad}>Localidad: {item.localidad}</Text>
                    <Text style={styles.localidad}>Usuario: {item.usuarioNombre}</Text>
                    {expandedItemId === item.id && (
                      <View >
                        {/* Aquí puedes mostrar más información del item */}
                        <Text style={styles.edad}>Edad: {item.edad}</Text>
                        <Text style={styles.localidad}>Traslado: {item.traslado}</Text>
                        <Text style={styles.localidad}>Descripcioón: {item.descripcion}</Text>

                        {/* Agrega aquí cualquier otra información que quieras mostrar */}
                      </View>
                    )}
                    <TouchableOpacity onPress={() => toggleExpanded(item.id)}>
                      <Text style={{ fontSize: 12, marginVertical: 4, color: 'blue' }}>
                        {expandedItemId === item.id ? 'menos info...' : 'mas info...'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.buttonsList, styles.rojoBg]}
                      onPress={() => handleBorrarPublicacion(item.id)}
                    ><Text style={styles.blanco}>BORRAR</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListHeaderComponent={renderListHeader}
              // ListFooterComponent={renderListFooter}
              ListEmptyComponent={renderEmptyList}
              contentContainerStyle={styles.listContentContainer}
            /> 
          </SafeAreaView>
        )

        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContentContainer: { // Estilo opcional para añadir padding al contenido de la lista
    paddingHorizontal: 0, // Ejemplo: añade padding horizontal
    paddingBottom: 0, // Ejemplo: añade espacio al final
  },
  datosContainer: { // Estilo opcional para los botones en el footer
    margin: 10, // Ejemplo: añade espacio sobre los botones
    padding: 15, // Ejemplo: alinea con el padding general si es necesario
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#e1e1e1",
  },
  container: {
    flex: 1,
    padding: 5,

  },
  containerInicioSesion: {
    marginHorizontal: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputInicio: {
    height: 40,
    width: 280,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 15,
    paddingHorizontal: 10,
  },
  buttonsInicio: {
    borderWidth: 2,
    color: '#ffffff',
    borderColor: 'white',
    borderRadius: 40,
    marginBottom: 20,
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
    width: 240,
    fontSize: 15,
    height: 50,
    alignItems: "center", // Centra el texto horizontalmente
    justifyContent: "center", // Centra el texto verticalmente
  },
  buttonsList: {
    borderWidth: 2,
    color: '#ffffff',
    borderColor: 'white',
    borderRadius: 40,
    marginBottom: 20,
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
    width: 140,
    fontSize: 15,
    height: 50,
    alignItems: "center", // Centra el texto horizontalmente
    justifyContent: "center", // Centra el texto verticalmente
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#452790",
  },
  titulo2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#452790",
  },
  tituloPublicaciones: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
    color: "#452790",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
  },


  safeArea: { flex: 1 },
  details: { flex: 1, margin: 15 },
  edad: { fontSize: 14, color: "gray", paddingBottom: 5 },
  correo: { fontSize: 18, color: "#452790", paddingBottom: 5 },
  sexo: { fontSize: 14, color: "gray" },
  localidad: { fontSize: 14, color: "gray" },
  estado: { fontSize: 16, color: "#f01250", fontWeight: "bold", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 5, },
  image: {
    width: 160, height: 160, marginVertical: 10, backgroundColor: "gray", borderRadius: 80, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.29)', alignSelf: "center" // Sombra para el botón
  },
  imageFlat: {
    width: 160, height: 260, marginBottom: 10, backgroundColor: "gray", borderRadius: 10, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
  },
  picker: { height: 60, width: "100%", marginTop: 0 },
  label: {
    paddingVertical: 5,
    marginHorizontal: 10,
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

  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#452790',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.29)', // Sombra para el botón

  },

  buttons: {
    borderWidth: 2,
    backgroundColor: "#018cae",
    color: '#ffffff',
    borderColor: 'white',
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 10,
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
    width: 240,
    fontSize: 15,
    height: 50,
    alignItems: "center", // Centra el texto horizontalmente
    justifyContent: "center", // Centra el texto verticalmente
  },

  buttons2: {
    borderWidth: 2,
    backgroundColor: "#f7a423",
    color: '#ffffff',
    borderColor: 'white',
    borderRadius: 40,
    marginBottom: 10,
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
    width: 240,
    fontSize: 15,
    height: 50,
    alignItems: "center", // Centra el texto horizontalmente
    justifyContent: "center", // Centra el texto verticalmente
  },
  buttons3: {
    borderWidth: 2,
    backgroundColor: "#f01250",
    color: '#ffffff',
    borderColor: 'white',
    borderRadius: 40,
    marginBottom: 10,
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
    width: 240,
    fontSize: 15,
    height: 50,
    alignItems: "center", // Centra el texto horizontalmente
    justifyContent: "center", // Centra el texto verticalmente
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


function rgb(arg0: number, arg1: number, arg2: number): any {
  throw new Error("Function not implemented.");
}

