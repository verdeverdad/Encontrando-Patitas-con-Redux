import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView, } from "react-native";
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

 

export default function Perdidos() {
  return <SafeAreaView style={{ flex: 1 }}>
    <ScrollView>
    <View style={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 0, backgroundColor: '#e1e1e1' }}>
      <Image
        source={require('../assets/images/encontrandoPatitas.png')}
        style={{
          width: 200,
          height: 200,
          marginVertical: 30,
          resizeMode: 'contain',
        }}
      />
</View>
      <Text style={styles.texto}> "Encontrando Patitas" es una plataforma dedicada a reunir a mascotas perdidas con sus familias y a conectar a animales sin hogar con personas que desean adoptar. Nuestra misión es crear una comunidad compasiva donde cada patita encuentre su camino a casa.</Text>
      <Text> HOLA</Text>
      <Text> HOLA</Text>
      <Text style={styles.texto}> "Encontrando Patitas" es una plataforma dedicada a reunir a mascotas perdidas con sus familias y a conectar a animales sin hogar con personas que desean adoptar. Nuestra misión es crear una comunidad compasiva donde cada patita encuentre su camino a casa.</Text>

      <Text> vapai</Text>
      <Text> HOLA</Text>
      <Text> HOLA</Text>
      
    </ScrollView>
  </SafeAreaView>
  
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#f01250",
    flexDirection: 'row', // Alinea los elementos horizontalmente
    alignItems: "center",
    justifyContent: 'space-around', // Distribuye el espacio entre los elementos
    padding: 10,
  },
  texto: {

    color: "#e1e1e1",
    fontSize: 22,
    padding: 25, 
    backgroundColor: '#a31288',
  }

});