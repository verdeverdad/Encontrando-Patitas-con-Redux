import { Text, View, StyleSheet, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { increment, decrement, incrementByAmount } from "@/redux/contadorSlice";
import MascotasLista from "@/components/mascotasLista";

export default function Contador() {
  const count = useSelector((state: RootState) => state.counter.value);
  const todos = useSelector((state: RootState) => state.todos.data);
  const dispatch = useDispatch();

  // console.log(decrement());
  // console.log(increment());
  // console.log(incrementByAmount(5));

  return (<View style={styles.container}>
      <Text style={styles.text}>Contador: {count}</Text>
      <View style={styles.row}>
        <Button title="-" onPress={() => dispatch(decrement())} />
        <Button title="+" onPress={() => dispatch(increment())} />
      </View>
      <Button
        title="Incrementar en 5"
        onPress={() => dispatch(incrementByAmount(5))}
      />
      <Text>Cantidad de Todos {todos.length}</Text>
      <MascotasLista></MascotasLista>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
  },
});