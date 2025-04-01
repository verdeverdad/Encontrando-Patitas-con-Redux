import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const MascotasLista = () => {
    const [mascotas, setMascotas] = useState<{ id: string; titulo?: string; estado?: string; sexo?: string; edad?: number; localidad?: string; traslado?: string; image?: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarMascotas = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "perdidos"));
                const datos = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMascotas(datos);
            } catch (error) {
                console.error("Error al cargar mascotas:", error);
                setMascotas(sampleData); // Usar datos de muestra en caso de error
            } finally {
                setLoading(false);
            }
        };

        cargarMascotas();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Cargando mascotas...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.container}>

                <FlatList
                    data={mascotas}
                    keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Image source={{ uri: item.image }} style={styles.image} />

                            <View style={styles.details}>
                                <Text style={styles.titulo}>{item.titulo}</Text>
                                <Text style={styles.edad}>Edad: {item.edad}</Text>
                                <Text style={styles.sexo}>Sexo: {item.sexo}</Text>
                                <Text style={styles.localidad}>Localidad: {item.localidad}</Text>
                                <Text style={styles.localidad}>Traslado: {item.traslado}</Text>
                                <Text style={styles.estado}>Estado: {item.estado?.toLocaleUpperCase()}</Text>
                                <Text> mas info...</Text>
                                <TouchableOpacity style={[styles.selectButton, styles.celesteBg]} onPress={() => { console.log('/app/(tabs)/index.tsx') }}>
                                    <Text style={styles.blanco}>CONTACTAR</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    inputContainer: { flexDirection: "row", padding: 10 },
    input: { marginTop: 10, padding: 10, borderColor: "gray", borderWidth: 1 },
    details: { flex: 1, margin: 15 },
    titulo: { fontSize: 18, fontWeight: "bold" },
    edad: { fontSize: 14, color: "gray" },
    sexo: { fontSize: 14, color: "gray" },
    localidad: { fontSize: 14, color: "gray" },
    estado: { fontSize: 18, color: "gray", fontWeight: "bold" },
    image: { width: 180, height: 220, marginBottom: 10, backgroundColor: "gray" },
    picker: { height: 80, width: "100%", },
    input2: {
        height: 40,
        margin: 5,
        paddingHorizontal: 10,
    },
    modalContainer: {
        padding: 20,
        flexDirection: 'row'
    },

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        backgroundColor: "#f01250",
        color: '#ffffff',
        borderColor: 'black',
        padding: 10,
        borderRadius: 10,
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
        borderColor: 'black',
        borderRadius: 10,
        marginBottom: 5,
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
        bottom: 20, // Espaciado desde la parte inferior
        left: 35, // Espaciado desde la izquierda
        right: 35, // Espaciado desde la derecha
        padding: 15, // Espaciado interno
        borderRadius: 30, // Bordes redondeados
        alignItems: "center", // Centra el texto horizontalmente
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#452790',
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

export default MascotasLista;