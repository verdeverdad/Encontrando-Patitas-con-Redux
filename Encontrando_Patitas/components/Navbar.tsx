import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
// import { Logo } from "@/components/logo";
// import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Navbar() {
    return (
        <SafeAreaView style={styles.navbar}>
          <Link href="./perdidosPantalla" asChild>
            <TouchableOpacity style={styles.texto}>
              <Text style={styles.texto}>PERDIDOS</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/encontrados" asChild>
            <TouchableOpacity style={styles.texto}>
              <Text style={styles.texto}>ENCONTRADOS</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/enAdopcion" asChild>
            <TouchableOpacity style={styles.texto}>
              <Text style={styles.texto}>EN ADOPCIÓN</Text>
            </TouchableOpacity>
          </Link>
        </SafeAreaView>
      );
    }

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: "#f01250",
        flexDirection: 'row', // Alinea los elementos horizontalmente
        alignItems: "center",
        justifyContent: 'space-around', // Distribuye el espacio entre los elementos
        padding: 20,
    },
    texto: {
        color: "white",
        fontSize: 16,
        marginRight: 5, // Margen horizontal para separar los textos
    }

});