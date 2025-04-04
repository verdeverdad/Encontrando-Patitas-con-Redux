import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setPerfil } from "@/redux/perfilSlice"; // Importa tu acción para actualizar el perfil
import TabsFalsas from "@/components/tabs";

const Perfil = () => {
    const dispatch = useDispatch();
    const perfil = useSelector((state: any) => state.perfil.data);
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [modoEdicion, setModoEdicion] = useState(false);
    const [esNuevoUsuario, setEsNuevoUsuario] = useState(true); // Asume que es un nuevo usuario al principio

    useEffect(() => {
        // Si hay un perfil existente, carga los datos y establece esNuevoUsuario en falso
        if (perfil) {
            setNombre(perfil.nombre);
            setCorreo(perfil.correo);
            setEsNuevoUsuario(false);
        }
    }, [perfil]);

    const handleGuardarPerfil = () => {
        // Actualiza el perfil en Redux o en tu backend
        const nuevoPerfil = { nombre, correo };
        dispatch(setPerfil(nuevoPerfil));
        setModoEdicion(false);
    };

    const handleRegistrarPerfil = () => {
        // Crea un nuevo perfil en Redux o en tu backend
        const nuevoPerfil = { nombre, correo };
        dispatch(setPerfil(nuevoPerfil));
        setEsNuevoUsuario(false);
    };

    if (esNuevoUsuario) {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Registro de Perfil</Text>
                <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                <TextInput style={styles.input} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
                <Button title="Registrar" onPress={handleRegistrarPerfil} />
                <TabsFalsas></TabsFalsas>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {modoEdicion ? (
                <>
                    <Text style={styles.titulo}>Editar Perfil</Text>
                    <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                    <TextInput style={styles.input} placeholder="Correo Electrónico" value={correo} onChangeText={setCorreo} />
                    <Button title="Guardar" onPress={handleGuardarPerfil} />
                    <Button title="Cancelar" onPress={() => setModoEdicion(false)} />
                </>
            ) : (
                <>
                    <Text style={styles.titulo}>Perfil</Text>
                    <Text>Nombre: {nombre}</Text>
                    <Text>Correo Electrónico: {correo}</Text>
                    <Button title="Editar" onPress={() => setModoEdicion(true)} />
                </>
            )}
            <TabsFalsas></TabsFalsas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default Perfil;