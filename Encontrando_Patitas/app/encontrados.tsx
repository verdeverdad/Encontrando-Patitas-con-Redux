import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import TabsFalsas from "@/components/tabs";
import PublicarMascota from "@/components/publicarMascota";
import MascotasLista from "@/components/mascotasLista";

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
export default function Encontrados() {
  return <>
    <MascotasLista filtroValor="ENCONTRADO/A" />
  </>
};

