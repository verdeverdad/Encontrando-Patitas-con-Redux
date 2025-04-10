import { NavBar } from "@/components/Navbar";
import TabsFalsas from "@/components/tabs";
import { Titulos } from "@/components/titulos";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, Pressable, ScrollView, Image } from "react-native";

export default function Index() {
  return (<SafeAreaView style={styles.safeArea}>
    <ScrollView>
    <NavBar />
      <View style={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 0,         boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
}}>
        <Image
          source={require('@/assets/images/encontrandoPatitas.png')}
          style={styles.imagen}
        />
      </View>
      <Text style={styles.texto}> "Encontrando Patitas" es una plataforma dedicada a reunir a mascotas perdidas con sus familias y a conectar a animales sin hogar con personas que desean adoptar. Nuestra misión es crear una comunidad compasiva donde cada patita encuentre su camino a casa.</Text>
    <Titulos></Titulos>

    </ScrollView>
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
    padding: 25,
    backgroundColor: '#452790',
  },
});