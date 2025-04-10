import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavBarOption = "perdidos" | "encontrados" | "enAdopcion";

// export const NavBar = ({ active }: { active?: NavBarOption }) => {
//   return (
//     <View style={{ flexDirection: "row", gap: 20, padding: 20 }}>
//       <Link href="/perdidos" style={active === "perdidos" && styles.active}>
//         Perdidos
//       </Link>
//       <Link
//         href="/encontrados"
//         style={active === "encontrados" && styles.active}
//       >
//         Encontrados
//       </Link>
//       <Link href="/enadopcion" style={active === "enadopcion" && styles.active}>
//         En Adopción
//       </Link>
//     </View>
//   );
// };

export const NavBar = ({ active }: { active?: NavBarOption }) => {
    return (
        <SafeAreaView style={styles.navbar}>
          <Link href="./perdidosPantalla" style={active === "perdidos" && styles.active}>
              <Text style={styles.texto}>PERDIDOS</Text>
          </Link>
          <Link href="/encontrados" style={active === "encontrados" && styles.active}>
              <Text style={styles.texto}>ENCONTRADOS</Text>
          </Link>
          <Link href="/enAdopcion" style={active === "enAdopcion" && styles.active}>
              <Text style={styles.texto}>EN ADOPCIÓN</Text>
          </Link>
        </SafeAreaView>
      );
    }

const styles = StyleSheet.create({
  active: { fontWeight: "bold", fontSize: 20, textShadowColor: "#000", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10, color: "#f01250" },

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