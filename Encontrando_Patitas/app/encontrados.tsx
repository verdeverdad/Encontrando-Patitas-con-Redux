import ContenedorTabs from "@/components/contenedorTabs";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, Pressable, ScrollView, Image } from "react-native";

export default function Encontrados() {
  return (<SafeAreaView style={styles.safeArea}>
      <ScrollView>
      <View style={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 0, backgroundColor: '#e1e1e1' }}>
        <Image
          source={require('@/assets/images/encontrandoPatitas.png')}
          style={styles.imagen}
        />
      </View>
      <Text style={styles.texto}> "Encontrando Patitas" es una plataforma dedicada a reunir a mascotas perdidas con sus familias y a conectar a animales sin hogar con personas que desean adoptar. Nuestra misión es crear una comunidad compasiva donde cada patita encuentre su camino a casa.</Text>
</ScrollView>
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imagen : {
    width: 200,
    height: 200,
    marginVertical: 30,
    resizeMode: 'contain',
  },
  safeArea: {
    flex: 1,
  },

  texto: {

    color: "#e1e1e1",
    fontSize: 22,
    padding: 25,
    backgroundColor: '#a31288',
  },
});