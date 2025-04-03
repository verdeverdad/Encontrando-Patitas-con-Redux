import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, Image, ActivityIndicator, ScrollView, Modal, TouchableOpacity, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setPerdidos } from "@/redux/perdidosSlice";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig"
import MascotasLista from "@/components/mascotas";
import TabsFalsas from "@/components/tabs";


const sampleData = [

    {

        id: "1",

        titulo: "Dos perritos cachorros",

        estado: "en adopcion",

        sexo: "machos",

        edad: 2,

        localidad: "en tal lado",

        traslado: "no",

        image: "https://via.placeholder.com/150",

    },

    {

        id: "2",

        titulo: "Perro grande marron",

        estado: "Perdido",

        sexo: "machos",

        edad: 2,

        localidad: "en tal lado",

        traslado: "no",

        image: "https://via.placeholder.com/150",

    },

];
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
};

export default function PerdidosPantalla() {
    const dispatch = useDispatch();
    const todos = useSelector((state: RootState) => state.todos.data);
    const [input, setInput] = useState("");
    const [edad, setEdad] = useState("");
    const [sexo, setSexo] = useState("");
    const [localidad, setLocalidad] = useState("");
    const [traslado, setTraslado] = useState("");
    const [estado, setEstado] = useState("");
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
            dispatch(setPerdidos(sampleData)); // Carga sampleData en caso de error
        } finally {
            setLoading(false);
        }
    };
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
        loadData();
    }, []);


    const handleAddPerdidos = async () => {
        if (
            input.trim() &&
            edad.trim() &&
            sexo.trim() &&
            localidad.trim() &&
            traslado.trim() &&
            estado.trim() &&
            image.trim() &&
            valor.trim()
        ) {
            const newTodo: Todo = {
                titulo: input,
                edad,
                sexo,
                localidad,
                traslado,
                estado,
                image,
                valor,
            };
            try {
                await addDoc(collection(db, "perdidos"), newTodo);
                console.log("Publicación agregada correctamente a Firebase.");
                loadData(); // Actualiza la lista después de agregar
            } catch (error) {
                console.error("Error al agregar publicación a Firebase:", error);
            }
            setInput("");
            setEdad("");
            setSexo("");
            setLocalidad("");
            setTraslado("");
            setValor("")
            setEstado("");
            setImage("");
            setMascotaImage(null);
            setModalVisible(false);
        } else {
            alert("Debes completar todos los datos");
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#018cae" />
                <Text style={{ color: "#018cae", fontSize: 24, fontWeight: 'bold' }}>Cargando mascotas...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>


            {/* Modal para agregar una mascota */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={[styles.modalContent, styles.modalContainer]}>
                    <ScrollView>
                        <Pressable onPress={() => setModalVisible(false)} >
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
                        <TextInput style={styles.input} placeholder="Ingrese si cuenta contraslado" value={traslado} onChangeText={setTraslado} />
                        <TextInput style={[styles.input, { display: "none" }]} placeholder="Ingrese URL de la imagen" value={image} onChangeText={setImage} />
                        <View style={{margin: 10}}>
                            <TouchableOpacity style={[styles.selectButton, styles.amarilloBg]} onPress={pickImage}>
                                <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.selectButton, styles.rojoBg]} onPress={handleAddPerdidos}>
                                <Text style={styles.blanco}>PUBLICAR MASCOTA</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.selectButton, styles.azuladoBg]} onPress={() => setModalVisible(false)}>
                                <Text style={[styles.blanco,]}>CERRAR</Text>
                            </TouchableOpacity>
                        </View>
                        {mascotaImage && <Image source={{ uri: mascotaImage }} style={styles.image} />}
                    </ScrollView>
                </View>
            </Modal>

            {/*LISTA DE MASCOTAS */}
            <View style={styles.container}>
                <FlatList
                    data={todos}
                    keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.details}>
                                <Text style={styles.titulo}>{item.titulo}</Text>
                                <Text style={styles.estado}>Estado: {item.valor}</Text>
                                <Text style={styles.sexo}>Sexo: {item.sexo}</Text>
                                <Text style={styles.localidad}>Localidad: {item.localidad}</Text>
                                <Text style={styles.edad}>Edad: {item.edad}</Text>
                                <Text style={styles.localidad}>Traslado: {item.traslado}</Text>
                                <Text style={{fontSize:12, marginVertical:4}}> mas info...</Text>
                                <TouchableOpacity style={[styles.selectButton, styles.celesteBg]} onPress={() => { console.log('/app/(tabs)/index.tsx') }}>
                                    <Text style={styles.blanco}>CONTACTAR</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                    )}
                />

            </View>


            {/* Botón para abrir el modal */}
            {
                !modalVisible && ( // Renderiza el botón solo si modalVisible es falso
                    <TouchableOpacity style={[styles.selectButtonModal, styles.fixedButton]} onPress={() => setModalVisible(true)}>
                        <Text style={styles.blanco}>PUBLICAR UNA MASCOTA</Text>
                    </TouchableOpacity>
                )
            }
            <TabsFalsas></TabsFalsas>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, },
    inputContainer: { flexDirection: "row", padding: 10 },
    input: { marginTop: 10, padding: 10, borderColor: "gray", borderWidth: 1 },
    details: { flex: 1, margin: 15 },
    titulo: { fontSize: 18, fontWeight: "bold" },
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