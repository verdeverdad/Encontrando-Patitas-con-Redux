import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function TabsFalsas() {
    const [activeTab, setActiveTab] = useState("home"); // Estado para el botón activo

    return (
        <View style={[styles.container]}>
            <TouchableOpacity
                style={styles.tabButton}
                onPress={() => {
                    setActiveTab("home");
                    router.push("/");
                }}
            >
                <Ionicons
                    name={activeTab === "home" ? "home-sharp" : "home-outline"}
                    color="white"
                    size={30}
                />
                <Text style={styles.tabText}>INICIO</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tabButton}
                onPress={() => {
                    setActiveTab("profile");
                    router.push("/perfil");
                }}
            >
                <Ionicons
                    name={activeTab === "profile" ? "person-circle" : "person-circle-outline"}
                    color="white"
                    size={30}
                />
                <Text style={styles.tabText}>PERFIL</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#f01250",
        height: 56,
        position: "absolute", // Fija el contenedor
        bottom: 0, // Lo coloca en la parte inferior
        left: 0, // Lo coloca en la parte izquierda
        right: 0, // Lo coloca en la parte derecha
    },
    tabButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    tabText: {
        fontSize: 10,
        color: "white",
    },
});