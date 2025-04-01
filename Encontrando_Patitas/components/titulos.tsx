import React from 'react';
import { Text, View, StyleSheet } from "react-native";

export const Titulos = () => {
  return <View style={styles.container}>
      <Text style={styles.texto} ></Text>
      <Text style={[styles.texto, styles.blanco]}>NOVEDADES</Text>
      <Text style={styles.texto} ></Text>

    </View>
 
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#018cae",
      flexDirection: 'row', // Alinea los elementos horizontalmente
      alignItems: "center",
      justifyContent: 'space-around', // Distribuye el espacio entre los elementos
      marginTop: 20,
      padding: 10,
    },
    texto: {
      fontSize: 20,
      marginHorizontal: 5, // Margen horizontal para separar los textos
    },

    rojo: {
        color: "#f01250"
    },

    violeta: {
        color: "#a31288"
    },
    azul: {
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
  
  });