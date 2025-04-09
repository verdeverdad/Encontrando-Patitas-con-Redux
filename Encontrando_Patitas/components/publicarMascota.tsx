import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, Image, ActivityIndicator, ScrollView, Modal, TouchableOpacity, Pressable, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setPerdidos } from "@/redux/perdidosSlice";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, getDocs, addDoc, doc, getDoc, setDoc, serverTimestamp, FieldValue } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig"
import { usePathname, useRouter } from "expo-router";


interface RootState {
    todos: {
        data: Todo[];
    };
}
type Todo = {
    id?: string; // El ID es opcional ya que Firebase lo genera
    titulo: string;
    estado?: string;
    sexo?: string;
    edad?: string;
    localidad?: string;
    traslado?: string;
    image?: string;
    valor?: string;
    usuarioId?: string; // Agrega el ID del usuario autenticado
    fechaPublicacion: string | FieldValue;
    descripcion: string;
};


export default function PublicarMascota() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const [edad, setEdad] = useState("");
    const [sexo, setSexo] = useState("");
    const [localidad, setLocalidad] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [traslado, setTraslado] = useState("");
    const [mascotaImage, setMascotaImage] = useState<string | null>(null);
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true); // Indicador de carga
    const [valor, setValor] = useState(""); // Estado inicial del Picker
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal


    const loadData = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "perdidos"));
            const remoteData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            dispatch(setPerdidos(remoteData));
        } catch (error) {
            console.error("Error al cargar datos desde Firebase:", error);
            alert("Error al cargar datos desde Firebase:");
        } finally {
            setLoading(false);
        }
    };

    //seleccionar la imagen
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setMascotaImage(result.assets[0].uri);
            setImage(result.assets[0].uri); // Actualiza la URL de la imagen
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("Estado de autenticación cambiado:", user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    // Verificar si el usuario está autenticado
    const verificarAutenticacion = () => {
        const user = auth.currentUser;
        console.log("Usuario autenticado:", user); // Verifica si el usuario está autenticado
        if (!user) {
            Alert.alert(
                "Inicia sesión o registrate",
                "Debes iniciar sesión para publicar una mascota.",
                [
                    { text: "Cancelar", style: "cancel", },
                    { text: "Iniciar sesión", onPress: () => router.push("/perfil") }, // Navega a la pantalla de inicio de sesión
                ]
            );
            return false;
        }
        return true;
    };

    const [isPublishing, setIsPublishing] = useState(false);

    const handleAddPerdidos = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("Debes iniciar sesión para publicar una mascota.");
            return;
        }

        if (
            input.trim() &&
            edad.trim() &&
            sexo.trim() &&
            localidad.trim() &&
            traslado.trim() &&
            image.trim() &&
            valor.trim()

        ) {
            setIsPublishing(true); // Inicia el loading

            const newTodo: Todo = {
                titulo: input,
                edad,
                sexo,
                localidad,
                traslado,
                image,
                valor,
                usuarioId: user.uid,
                fechaPublicacion: serverTimestamp(),
                descripcion,
            };

            try {
                // Agregar la publicación a Firestore
                const docRef = await addDoc(collection(db, "perdidos"), newTodo);
                console.log("Publicación agregada correctamente a Firebase con ID:", docRef.id);

                // Actualizar el perfil del usuario con el ID de la publicación
                const userDocRef = doc(db, "usuarios", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const publicaciones = userData.publicaciones || [];
                    publicaciones.push(docRef.id);
                    await setDoc(userDocRef, { ...userData, publicaciones }, { merge: true });
                    console.log("Perfil del usuario actualizado con la nueva publicación.");
                } else {
                    console.warn("No se encontró el perfil del usuario en Firestore.");
                }

                // Actualizar la lista de publicaciones en la aplicación
                loadData();

                // Limpiar los campos del formulario
                setInput("");
                setEdad("");
                setSexo("");
                setLocalidad("");
                setTraslado("");
                setValor("");
                setDescripcion("")
                setImage("");
                setMascotaImage(null);
                setModalVisible(false);

                const currentRoute = pathname; // Obtener la ruta actual
                // Redireccionar o recargar según el estado de la mascota y la ubicación actual
                if (valor === "PERDIDO") {
                    if (currentRoute === "/perdidosPantalla") {
                        router.replace("/perdidosPantalla"); // Recargar la página actual
                    } else {
                        router.push("/perdidosPantalla");
                    }
                } else if (valor === "ENCONTRADO/A") {
                    if (currentRoute === "/encontrados") {
                        router.replace("/encontrados"); // Recargar la página actual
                    } else {
                        router.push("/encontrados");
                    }
                } else if (valor === "EN ADOPCIÓN") {
                    if (currentRoute === "/enAdopcion") {
                        router.replace("/enAdopcion"); // Recargar la página actual
                    } else {
                        router.push("/enAdopcion");
                    }
                } else {
                    // Redirección por defecto si el estado no coincide con ninguno
                    router.push("/"); // O a la página principal
                }

                setIsPublishing(false); // Finaliza el loading en caso de éxito

            } catch (error) {
                console.error("Error al agregar publicación a Firebase:", error);
                setIsPublishing(false); // Finaliza el loading en caso de error
            }
        } else {
            alert("Debes completar todos los datos");
        }
    };


    return (
        <SafeAreaView style={styles.safeArea}>


            {/* Modal para agregar una mascota */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={[styles.modalContent, styles.modalContainer]}>
                    <ScrollView>
                        <Pressable onPress={() => setModalVisible(false)} style={{marginBottom: 10}}>
                            <MaterialIcons name="close" color="red" size={22} />
                        </Pressable>
                        <Text style={styles.titulo}>PUBLICAR UNA MASCOTA</Text>
                        <TextInput style={styles.input} placeholder="Ingrese un titulo a la publicacion" value={input} onChangeText={setInput} />
                        <Text style={styles.input2}>Selecciona un estado:</Text>
                        <Picker
                            selectedValue={valor}
                            onValueChange={(itemValue) => setValor(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="PERDIDO/A" value="PERDIDO" />
                            <Picker.Item label="ENCONTRADO/A" value="ENCONTRADO/A" />
                            <Picker.Item label="EN ADOPCIÓN" value="EN ADOPCIÓN" />
                        </Picker>
                        <TextInput style={styles.input} placeholder="Ingrese localidad" value={localidad} onChangeText={setLocalidad} />
                        <TextInput style={styles.input} placeholder="Ingrese sexo de la mascota" value={sexo} onChangeText={setSexo} />
                        <TextInput style={styles.input} placeholder="Ingrese edad de mascota" value={edad} onChangeText={setEdad} />
                        <TextInput style={styles.input} placeholder="Ingrese si cuenta con traslado" value={traslado} onChangeText={setTraslado} />
                        <TextInput style={styles.input} placeholder="Descripcion o datos adicionales" value={descripcion} onChangeText={setDescripcion} />
                        <TextInput style={[styles.input, { display: "none" }]} placeholder="Ingrese URL de la imagen" value={image} onChangeText={setImage} />
                        <View style={{ margin: 10, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity style={[styles.selectButton, styles.amarilloBg]} onPress={pickImage}>
                                <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.selectButton, styles.rojoBg]}
                                onPress={handleAddPerdidos}
                                disabled={isPublishing} // Deshabilita el botón mientras se publica
                            >
                                {isPublishing ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.blanco}>PUBLICAR MASCOTA</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.selectButton, styles.azuladoBg]} onPress={() => setModalVisible(false)}>
                                <Text style={[styles.blanco,]}>CERRAR</Text>
                            </TouchableOpacity>
                        </View>
                        {mascotaImage && <Image source={{ uri: mascotaImage }} style={styles.image} />}
                    </ScrollView>
                </View>
            </Modal>

            {/* Botón para abrir el modal (con verificación de autenticación) */}
            {!modalVisible && (
                <TouchableOpacity
                    style={[styles.selectButtonModal, styles.fixedButton]}
                    onPress={() => {
                        if (verificarAutenticacion()) {
                            setModalVisible(true);
                        }
                    }}
                >
                    <Text style={styles.blanco}>PUBLICAR UNA MASCOTA</Text>
                </TouchableOpacity>
            )}


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1},
    container: { flex: 1, },
    input: {   height: 40,
        width: 280,
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 15,
        paddingHorizontal: 10, alignSelf: 'center' },
    details: { flex: 1, margin: 15 },
    titulo: { fontSize: 18, fontWeight: "bold", alignSelf: 'center' },
    edad: { fontSize: 14, color: "gray" },
    sexo: { fontSize: 14, color: "gray" },
    localidad: { fontSize: 14, color: "gray" },
    estado: { fontSize: 16, color: "black", fontWeight: "bold" },
    image: {
        width: 160, height: 260, marginBottom: 10, backgroundColor: "gray", borderRadius: 10, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.29)', // Sombra para el botón
    },
    picker: { height: 52, width: 200, marginTop: 0,marginLeft: 22, },
    input2: {
        height: 40,
        marginTop: 8,
        marginLeft: 26,
        paddingHorizontal: 10,
        
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
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
        bottom: 0, // Espaciado desde la parte inferior
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
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.29)',

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