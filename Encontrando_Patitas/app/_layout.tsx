import { Link, Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import Navbar from "@/components/Navbar";
import { MaterialIcons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider style={{ backgroundColor: "#e1e1e1" }}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#452790",
        }}>
          <MaterialIcons name={"pets"}
            color="white"
            size={30} />
          <Text
            style={{
              fontSize: 16,
              padding: 10,
              fontWeight: "bold",
              letterSpacing: 2,
              backgroundColor: "#452790",
              color: "#e1e1e1",
            }}
          >ENCONTRANDO PATITAS
          </Text>
          <MaterialIcons name={"pets"}
            color="white"
            size={30} />
        </View>
        <Navbar />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="perdidosPantalla" options={{ headerShown: true, title: "PERDIDOS", headerStyle: { backgroundColor: "#018cae" }, headerTintColor: "#fff", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 15, } }} />
          <Stack.Screen name="encontrados" options={{ headerShown: true, title: "ENCONTRADOS", headerStyle: { backgroundColor: "#018cae" }, headerTintColor: "#fff", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 15, } }} />
          <Stack.Screen name="enAdopcion" options={{ headerShown: true, title: "EN ADOPCION", headerStyle: { backgroundColor: "#018cae" }, headerTintColor: "#fff", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 15, } }} />
          <Stack.Screen name="perfil" options={{ headerShown: true, title: "PERFIL", headerStyle: { backgroundColor: "#018cae" }, headerTintColor: "#fff", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 15, } }} />

          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        </Stack>
      </SafeAreaProvider>
    </Provider>
  );
}