import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, Pressable, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setPerdidos, addPerdidos, updatePerdidos, deletePerdidos } from "@/redux/perdidosSlice";
import { RootState } from "@/redux/store";
import { router } from "expo-router";
import * as FileSystem from 'expo-file-system';

const JSON_FILE_URI = FileSystem.documentDirectory + 'perdidos.json';

type Todo = {
    id: number;
    titulo: string;
    estado?: string;
    sexo?: string;
    edad?: string;
    localidad?: string;
    traslado?: string;
    image?: string;
};

interface PerdidosListitemProps {
    todo: Todo;
    isEditing: boolean;
    onDelete: (id: number) => void;
    onSetEditMode: (id: number) => void;
    onSave: ({ id, titulo }: Todo) => void;
}

const PerdidosListItem = ({ todo, isEditing, onDelete, onSetEditMode, onSave }: PerdidosListitemProps) => {
    const [editTitulo, setEditTitulo] = useState(todo.titulo);
    const [editEdad, setEditEdad] = useState(todo.edad);

    const onDeleteHandler = () => {
        onDelete(todo.id);
    };

    const onEditPressHandler = () => {
        onSetEditMode(todo.id);
    };

    const onSaveHander = () => {
        if (editTitulo.trim() && editEdad !== null && editEdad !== undefined) {
            onSave({ id: todo.id, titulo: editTitulo, edad: todo.edad });
        }
    };

    return (
        <Pressable style={styles.todoItem} onPress={() => router.navigate({ pathname: "/perdidosPantalla", params: { id: todo.id } })}>
            <View style={styles.row}>
                {isEditing ? (
                    <View style={styles.row}>
                        <TextInput style={styles.input} value={editTitulo} onChangeText={(titulo) => setEditTitulo(titulo)} />
                        <TextInput style={styles.input} value={editEdad} onChangeText={(edad) => setEditEdad(edad)} keyboardType="numeric" />
                    </View>
                ) : (
                    <View>
                        <Image source={{ uri: todo.image }} style={styles.image} />
                        <Text style={styles.todoText}>{todo.titulo}</Text>
                        <Text style={styles.todoText}>Edad: {todo.edad}</Text>
                        <Text style={styles.todoText}>Sexo: {todo.sexo}</Text>
                        <Text style={styles.todoText}>Estado: {todo.estado}</Text>
                        <Text style={styles.todoText}>Localidad: {todo.localidad}</Text>
                        <Text style={styles.todoText}>Traslado: {todo.traslado}</Text>
                    </View>
                )}
            </View>
            <View style={styles.buttonContainer}>
                {isEditing ? <Button title="Salvar" onPress={onSaveHander} /> : <Button title="Editar" onPress={onEditPressHandler} />}
                <Button title="Borrar" color="red" onPress={onDeleteHandler} />
            </View>
        </Pressable>
    );
};

export default function PerdidosPantalla() {
    const dispatch = useDispatch();
    const todos = useSelector((state: RootState) => state.todos.data);
    const [input, setInput] = useState("");
    const [edad, setEdad] = useState("");
    const [sexo, setSexo] = useState("");
    const [localidad, setLocalidad] = useState("");
    const [traslado, setTraslado] = useState("");
    const [estado, setEstado] = useState("");
    const [image, setImage] = useState("");
    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fileInfo = await FileSystem.getInfoAsync(JSON_FILE_URI);
                if (fileInfo.exists) {
                    const jsonData = await FileSystem.readAsStringAsync(JSON_FILE_URI);
                    const parsedData = JSON.parse(jsonData);
                    dispatch(setPerdidos(parsedData));
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };
        loadData();
    }, [dispatch]);

    const saveData = async (data: Todo[]) => {
        try {
            await FileSystem.writeAsStringAsync(JSON_FILE_URI, JSON.stringify(data));
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const handleAddPerdidos = () => {
        if (input.trim() && edad.trim() && sexo.trim() && localidad.trim() && traslado.trim() && estado.trim() && image.trim()) {
            dispatch(addPerdidos(input));
            saveData([...todos, { id: Date.now(), titulo: input, edad: parseInt(edad), sexo, localidad, traslado, estado, image }] as Todo[]);

            setInput("");
            setEdad("");
            setSexo("");
            setLocalidad("");
            setTraslado("");
            setEstado("");
            setImage("");
        }
    };

    const handleUpdatePerdidos = ({ id, titulo, edad }: Todo) => {
        dispatch(updatePerdidos({ id, newText: titulo, edad: edad }));
        setEditId(null);
        saveData(todos.map(todo => todo.id === id ? { ...todo, titulo: titulo || todo.titulo, edad: edad || todo.edad } : todo) as Todo[]);
    };

    const handleDeletePerdidos = (id: number) => {
        dispatch(deletePerdidos(id));
        const updatedTodos = todos.filter(todo => todo.id !== id);
        saveData(updatedTodos);
    };
    

    const handleSetEditMode = (id: number) => {
        setEditId(id);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Ingrese un titulo a la publicacion" value={input} onChangeText={setInput} />
                <TextInput style={styles.input} placeholder="Ingrese edad de mascota" value={edad} onChangeText={setEdad} />
                <TextInput style={styles.input} placeholder="Ingrese sexo de la mascota" value={sexo} onChangeText={setSexo} />
                <TextInput style={styles.input} placeholder="Ingrese localidad" value={localidad} onChangeText={setLocalidad} />
                <TextInput style={styles.input} placeholder="Ingrese traslado" value={traslado} onChangeText={setTraslado} />
                <TextInput style={styles.input} placeholder="Ingrese estado de la mascota" value={estado} onChangeText={setEstado} />
                <TextInput style={styles.input} placeholder="Ingrese URL de la imagen" value={image} onChangeText={setImage} />
                <Button title="Agregar" onPress={handleAddPerdidos} />
            </View>

            <View style={styles.container}>
                <FlatList data={todos} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (
                    <PerdidosListItem todo={item} isEditing={editId === item.id} onDelete={handleDeletePerdidos} onSetEditMode={handleSetEditMode} onSave={handleUpdatePerdidos} />
                )} />
                <Button title="index" onPress={() => router.push("/")} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, padding: 20 },
    inputContainer: { flexDirection: "column", padding: 20 },
    input: { marginTop: 10, padding: 10, borderColor: "gray", borderWidth: 1 },
    todoItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", marginVertical: 5, borderRadius: 5, elevation: 3 },
    todoText: { fontSize: 16 },
    buttonContainer: { flexDirection: "row", justifyContent: "flex-end", gap: 5, width: "40%" },
    row: { paddingLeft: 10, width: "60%" },
    image: { width: 100, height: 100, margin: 10, }
});