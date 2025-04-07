import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PublicarMascota from "./publicarMascota";
import TabsFalsas from "./tabs";
import colores from "@/utils/colors";

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

interface MascotasListaProps {
    filtroValor?: string; // Valor opcional para filtrar la lista
}

const MascotasLista: React.FC<MascotasListaProps> = ({ filtroValor }) => {
    const [mascotas, setMascotas] = useState<{ id: string; titulo?: string; valor?: string; sexo?: string; edad?: number; localidad?: string; traslado?: string; image?: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarMascotas = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "perdidos"));
                const datos = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as {
                        titulo?: string;
                        valor?: string;
                        sexo?: string;
                        edad?: number;
                        localidad?: string;
                        traslado?: string;
                        image?: string;
                    }),
                }));
    
                // Aplicar filtro si se proporciona un valor
                const mascotasFiltradas = filtroValor
                    ? datos.filter((mascota) => mascota.valor=== filtroValor)
                    : datos;
    
                setMascotas(mascotasFiltradas);
            } catch (error) {
                console.error("Error al cargar mascotas:", error);
    
                // Aplicar filtro a datos de muestra si se proporciona un valor
                const mascotasFiltradasMuestra = filtroValor
                    ? sampleData.filter((mascota) => mascota.estado === filtroValor)
                    : sampleData;
    
                setMascotas(mascotasFiltradasMuestra);
            } finally {
                setLoading(false);
            }
        };
    
        cargarMascotas();
    }, [filtroValor]); // Dependencia en filtroValor para que se recargue al cambiar

    if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#018cae" />
            <Text style={{ color: "#018cae", fontSize: 24, fontWeight: 'bold', marginTop: 15  }}>Cargando mascotas...</Text>
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
                        <Text style={styles.estado}>Estado: {item.valor}</Text>
                        <Text style={styles.sexo}>Sexo: {item.sexo}</Text>
                        <Text style={styles.localidad}>Localidad: {item.localidad}</Text>
                        <Text style={styles.edad}>Edad: {item.edad}</Text>
                        <Text style={styles.localidad}>Traslado: {item.traslado}</Text>
                        <Text style={{ fontSize: 12, marginVertical: 4 }}> mas info...</Text>
                        <TouchableOpacity style={[styles.selectButton, styles.celesteBg]} onPress={() => { console.log('/app/(tabs)/index.tsx') }}>
                          <Text style={styles.blanco}>CONTACTAR</Text>
                        </TouchableOpacity>
                      </View>
        
                  
                    </View>
                  )}
                  />
                  <PublicarMascota></PublicarMascota>
              </View>
              <TabsFalsas></TabsFalsas>
            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, },
    details: { flex: 1, margin: 15, },
    titulo: { fontSize: 18, fontWeight: "bold" },
    edad: { fontSize: 14, color: "gray" },
    sexo: { fontSize: 14, color: "gray" },
    localidad: { fontSize: 14, color: "gray" },
    estado: { fontSize: 18, color: "gray", fontWeight: "bold" },
    image: {
      width: 160, height: 260, marginBottom: 10, backgroundColor: "gray", borderRadius: 10, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
    },
    picker: { height: 80, width: "100%", },
 
    selectButton: {
      borderWidth: 2,
      backgroundColor: "#f01250",
      color: '#ffffff',
      boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
      borderColor: 'white',
      borderRadius: 10,
      marginBottom: 5,
      width: 'auto',
      fontSize: 16,
      height: 40,
      alignItems: "center", // Centra el texto horizontalmente
      justifyContent: "center", // Centra el texto verticalmente
    },
    
    item: {
      flexDirection: "row",
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