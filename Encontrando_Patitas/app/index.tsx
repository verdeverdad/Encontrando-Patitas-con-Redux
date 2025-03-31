import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, Pressable, ScrollView,Image} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setTodos, addTodo, updateTodo, deleteTodo} from "@/redux/nuevaPublicacion";
import { increment, decrement, incrementByAmount } from "@/redux/contadorSlice";
import { setPerdidos, addPerdidos, updatePerdidos, deletePerdidos } from "@/redux/perdidosSlice";

// Define the Todo type explicitly
type Todo = {
  id: number;
  text: string;
};
import { RootState } from "@/redux/store";
import { router } from "expo-router";

const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=5";

interface TodoListitemProps {
  todo: Todo;
  isEditing: boolean;
  onDelete: (id: number) => void;
  onSetEditMode: (id: number) => void;
  onSave: ({ id, text }: Todo) => void;
}

interface TodoData {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}

const TodoListItem = ({
  todo,
  isEditing,
  onDelete,
  onSetEditMode,
  onSave,
}: TodoListitemProps) => {
  const [editText, setEditText] = useState(todo.text);

  const onDeleteHandler = () => {
    onDelete(todo.id);
  };

  const onEditPressHandler = () => {
    onSetEditMode(todo.id);
  };

  const onSaveHander = () => {
    if (editText.trim()) {
      onSave({
        id: todo.id,
        text: editText,
      });
    }
  };

  return (
    <Pressable
      style={styles.todoItem}
      onPress={() =>
        router.navigate({ pathname: "/todo", params: { id: todo.id } })
      }
    >
      <View style={styles.row}>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editText}
            onChangeText={(text) => {
              setEditText(text);
            }}
          />
        ) : (
          <Text style={styles.todoText}>{todo.text}</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <Button title="Salvar" onPress={onSaveHander} />
        ) : (
          <Button title="Editar" onPress={onEditPressHandler} />
        )}
        <Button title="Borrar" color="red" onPress={onDeleteHandler} />
      </View>
    </Pressable>
  );
};

export default function Index() {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.data);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(API_URL);
      const data: TodoData[] = await response.json();
      const formattedTodos = data.map((item) => ({
        id: item.id,
        text: item.title,
      }));
      dispatch(setTodos(formattedTodos));
    };

    fetchTodos();
  }, []);

  const handleAddTodo = () => {
    if (input.trim()) {
      dispatch(addTodo(input));
      setInput("");
    }
  };

  const handleUpdateTodo = ({ id, text }: Todo) => {
    dispatch(updateTodo({ id, newText: text }));
    setEditId(null);
  };

  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTodo(id));
  };

  const handleSetEditMode = (id: number) => {
    setEditId(id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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

        <Text style={styles.texto}> "Encontrando Patitas" es una plataforma dedicada a reunir a mascotas perdidas con sus familias y a conectar a animales sin hogar con personas que desean adoptar. Nuestra misión es crear una comunidad compasiva donde cada patita encuentre su camino a casa.</Text>




        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ingrese un nuevo Todo"
              value={input}
              onChangeText={setInput}
            />
            <Button title="Agregar" onPress={handleAddTodo} />
          </View>

          <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TodoListItem
                todo={item}
                isEditing={editId === item.id}
                onDelete={handleDeleteTodo}
                onSetEditMode={handleSetEditMode}
                onSave={handleUpdateTodo}
              />
            )}
          />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 8,
    marginRight: 10,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 5,
    elevation: 3,
  },
  todoText: {
    fontSize: 14,
  },
  texto: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 5,
    width: "40%",
  },
  row: {
    paddingLeft: 10,
    width: "60%",
  },
});