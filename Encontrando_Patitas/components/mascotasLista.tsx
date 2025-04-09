import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, Alert, Linking } from "react-native";
import { collection, getDoc, getDocs, doc, orderBy, query } from "firebase/firestore";
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

    usuarioNombre: "Desconocido", // Add default usuarioNombre

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

    usuarioNombre: "Desconocido", // Add default usuarioNombre

  },

];

interface MascotaConUsuario {
  id: string;
  titulo?: string;
  valor?: string;
  sexo?: string;
  edad?: number;
  localidad?: string;
  traslado?: string;
  image?: string;
  usuarioNombre: string;
  usuarioTelefono?: string | null;
  fechaPublicacion: string,
}

interface MascotasListaProps {
  filtroValor?: string; // Valor opcional para filtrar la lista
}

const MascotasLista: React.FC<MascotasListaProps> = ({ filtroValor }) => {
  const [mascotas, setMascotas] = useState<{
    usuarioNombre: string; id: string; titulo?: string; valor?: string; sexo?: string; edad?: number; localidad?: string; traslado?: string; image?: string; usuarioTelefono?: string | null; fechaPublicacion: string; // <-- Agregado para el teléfono
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarMascotas = async () => {
      setLoading(true);
      try {
        const queryOrdenado = query(collection(db, "perdidos"), orderBy("fechaPublicacion", "desc"));
        const querySnapshot = await getDocs(queryOrdenado);
        const datosPromises = querySnapshot.docs.map(async (document): Promise<MascotaConUsuario | null> => {
          const mascotaData = document.data();
          const usuarioId = (mascotaData as { usuarioId?: string }).usuarioId;
          let usuarioNombre = "Desconocido";
          let usuarioTelefono: string | null = null;

          if (usuarioId) {
            const usuarioDocRef = doc(db, "usuarios", usuarioId);
            const usuarioDocSnap = await getDoc(usuarioDocRef);
            if (usuarioDocSnap.exists()) {
              const usuarioData = usuarioDocSnap.data();
              usuarioNombre = (usuarioData as { nombre?: string }).nombre || "Desconocido";
              usuarioTelefono = (usuarioData as { telefono?: string }).telefono || null;
            }
          } else {
            console.warn(`Mascota con ID ${document.id} no tiene usuarioId.`);
          }

          // Después de guardar en Firestore, conviértelo a un formato serializable al cargarlo
          const fechaPublicacion = mascotaData.fechaPublicacion?.toDate().toISOString() || "";

          return {
            id: document.id,
            ...(mascotaData as Omit<MascotaConUsuario, 'id' | 'usuarioNombre' | 'usuarioTelefono'>),
            valor: (mascotaData as Record<string, any>).valor || "",
            usuarioNombre,
            usuarioTelefono,
            fechaPublicacion,
          };
        });

        const datosCompletos = (await Promise.all(datosPromises)).filter(d => d !== null) as MascotaConUsuario[];

        const mascotasFiltradas = filtroValor
          ? datosCompletos.filter((mascota) => mascota.valor === filtroValor)
          : datosCompletos;

        setMascotas(mascotasFiltradas);
        console.log("Datos de mascotas:", mascotasFiltradas);

      } catch (error) {
        console.error("Error al cargar mascotas:", error);
        Alert.alert("Error", "No se pudieron cargar las mascotas.");
        setMascotas([]);
      } finally {
        setLoading(false);
      }
    };
    cargarMascotas();
  }, [filtroValor])// Dependencia en filtroValor para que se recargue al cambiar

  // --- Función para abrir WhatsApp ---
  const handleContactPress = async (telefono: string | null) => {
    if (!telefono) {
      Alert.alert("Sin contacto", "El usuario no ha proporcionado un número de teléfono.");
      return;
    }

    // Limpieza básica: quitar espacios, guiones. Podría necesitar ajustes.
    // IMPORTANTE: Asegúrate que el número incluya el código de país (ej: 598 para Uruguay)
    // Si no lo incluye, deberás añadirlo aquí. Asumamos que viene incluido por ahora.
    const numeroLimpio = telefono.replace(/[\s-()]/g, '');
    const url = `whatsapp://send?phone=${numeroLimpio}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `No se puede abrir WhatsApp. Asegúrate de que esté instalado.`);
      }
    } catch (error) {
      console.error("Error al intentar abrir WhatsApp:", error);
      Alert.alert("Error", "Ocurrió un problema al intentar contactar por WhatsApp.");
    }
  };


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#018cae" />
        <Text style={{ color: "#018cae", fontSize: 24, fontWeight: 'bold', marginTop: 15 }}>Cargando mascotas...</Text>
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
                <Text style={styles.localidad}>Usuario: {item.usuarioNombre}</Text>
                <Text style={styles.localidad}>fecha: {item.fechaPublicacion.slice(0, 10)}</Text>

                <Text style={{ fontSize: 12, marginVertical: 4 }}> mas info...</Text>
                {/* Botón Contactar */}
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    !item.usuarioTelefono && styles.disabledButton // Estilo opcional si no hay teléfono
                  ]}
                  onPress={() => handleContactPress(item.usuarioTelefono ?? null)}
                  disabled={!item.usuarioTelefono} // Deshabilita el botón si no hay teléfono
                >
                  <Text style={[styles.blanco, { fontSize: 15 }]}>CONTACTAR</Text>
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

  disabledButton: {
    backgroundColor: '#a0a0a0', // Color grisáceo para deshabilitado
    opacity: 0.7,
  },
  safeArea: { flex: 1 },
  container: { flex: 1, marginBottom: 40 },
  details: { flex: 1, margin: 10, },
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
    backgroundColor: "#28cf54",
    color: '#ffffff',
    borderColor: 'white',
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 10,
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
    width: 180,
    fontSize: 18,
    height: 50,
    alignItems: "center", // Centra el texto horizontalmente
    justifyContent: "center", // Centra el texto verticalmente
    fontWeight: "bold",
  },

  item: {
    flexDirection: "row",
    marginBottom: 60,
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