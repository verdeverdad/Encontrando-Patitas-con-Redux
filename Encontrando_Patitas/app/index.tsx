import { NavBar } from "@/components/Navbar";
import PublicarMascota from "@/components/publicarMascota";
import TabsFalsas from "@/components/tabs";
import { Titulos } from "@/components/titulos";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, Pressable, ScrollView, Image } from "react-native";

export default function Index() {
  return (<SafeAreaView style={styles.safeArea}>
    <NavBar />
    <ScrollView>
      <View style={{
        flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 0, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
      }}>
        <Image
          source={require('@/assets/images/encontrandoPatitas.png')}
          style={styles.imagen}
        />
      </View>
      <Text style={styles.texto}> "Encontrando Patitas" es una plataforma dedicada a reunir a mascotas perdidas con sus familias y a conectar a animales sin hogar con personas que desean adoptar. Nuestra misión es crear una comunidad compasiva donde cada patita encuentre su camino a casa.</Text>
      <Titulos></Titulos>
      <View style={styles.card}>
        <Text style={styles.title}>Jornadas de castración</Text>
        <Image
        source={require('@/assets/images/encontrandoPatitas (5).png')} // Reemplaza con la URL de tu imagen
        style={styles.image}
        resizeMode="contain" // O 'cover' según cómo quieras que se ajuste la imagen
      />
        <View style={styles.content}>
          <Text style={{ color: '#f01250', textAlign: 'center', fontSize: 18, }}>MONTEVIDEO</Text>
          <Text style={styles.bold}>Miércoles 19 </Text><Text style={styles.bodyText}>  Barrio Santa María. Salón Comunal, Cno. Tte. Galeano 3683.</Text>
          <Text style={styles.importantText}>Inscripciones: 098 336 542</Text>
        </View>
      </View>

    <View style={styles.card}>
      <Text style={styles.title}>¡Dona tu Saldo a Refugios!</Text>
      <View style={styles.content}>
        <Text style={styles.importantText}>ANTEL, CLARO y MOVISTAR</Text>
        <Text style={styles.bodyText}>
          Antes de que venza tu saldo, recordá que podés donar lo que no usaste a los refugios nacionales.
        </Text>
        <Text style={styles.callToAction}>
          Envía la palabra <Text style={styles.bold}>REFUGIO</Text> al <Text style={styles.bold}>*111</Text> desde cualquier compañía y haz llegar tu donación. ¡Esas patitas lo necesitan!
        </Text>
      </View>
    </View>


    </ScrollView>
    <View style={{ marginBottom: 40, }}>
      <PublicarMascota /></View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imagen: {
    width: 300,
    height: 300,
    marginVertical: 30,
    resizeMode: 'contain',
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#452790",
  },

  texto: {
    color: "#e1e1e1",
    fontSize: 22,
    padding: 40,
    backgroundColor: '#452790',
  },
  card: {
    flex: 1,
    marginHorizontal: 20, // Más espacio a los lados
    marginVertical: 20,   // Más espacio arriba y abajo
    backgroundColor: '#ffffff',
    borderRadius: 12,      // Bordes un poco más redondeados
    padding: 25,           // Más espacio interno
    shadowColor: '#1e272e', // Un gris más oscuro para la sombra
    shadowOffset: { width: 0, height: 4 }, // Sombra más pronunciada hacia abajo
    shadowOpacity: 0.25,    // Sombra un poco más suave
    shadowRadius: 8,       // Radio de la sombra más grande
    elevation: 8,           // Elevación para Android
    alignItems: 'center',   // Centrar el contenido
  },
  title: {
    fontSize: 22,           // Título un poco más grande
    color: '#34495e',       // Un azul grisáceo moderno
    marginBottom: 15,        // Más espacio debajo del título
    fontWeight: 'bold',
    textAlign: 'center',     // Centrar el título
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  importantText: {
    color: '#e74c3c',       // Un rojo más llamativo
    textAlign: 'center',
    fontSize: 20,           // Texto importante más grande
    marginBottom: 10,        // Espacio debajo del texto importante
    fontWeight: 'bold',
  },
  image: {
    width: 100,  // Ancho de la imagen (mediana)
    height: 100, // Alto de la imagen (mediana)
    borderRadius: 8, // Opcional: para redondear las esquinas de la imagen
    marginBottom: 20, // Espacio debajo de la imagen
  },
  bodyText: {
    color: '#576574',       // Un gris más suave para el cuerpo del texto
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,         // Mejor legibilidad del texto
    marginBottom: 15,
  },
  callToAction: {
    color: '#2c3e50',       // Un azul oscuro para la llamada a la acción
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: '#34495e',       // Resaltar palabras clave
  },
});