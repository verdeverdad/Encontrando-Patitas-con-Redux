import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Todo = () => {
  const todos = useSelector((state: RootState) => state.todos.data);
  const { id } = useLocalSearchParams();
  const todo = todos.find((todoItem) => parseInt(Array.isArray(id) ? id[0] : id) === todoItem.id);

  return (
    <View style={styles.container}>
      {todo && <Text style={styles.text}>ID: {todo.id}</Text>}
      {todo && <Text style={styles.text}>Text: {todo.titulo}</Text>}
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});