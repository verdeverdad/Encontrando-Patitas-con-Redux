import { Link, Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";
import Navbar from "@/components/Navbar";
 
export default function RootLayout() {
    return (
        <Provider store={store}>
            <SafeAreaProvider style={{ backgroundColor: "#e1e1e1" }}>
                <Text
                    style={{
                        fontSize: 16,
                        padding: 10,
                        textAlign: "center",
                        letterSpacing: 2,
                        backgroundColor: "#452790",
                        color: "#e1e1e1",
                    }}
                >
                    ENCONTRANDO PATITAS
                </Text>
                <Navbar />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="contador" options={{ headerShown: true, title: "CONTADOR", headerStyle: { backgroundColor: "#452790" }, headerTintColor: "#fff", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 15,}}} />
                    <Stack.Screen name="perdidosPantalla"  options={{ headerShown: true, title: "PERDIDOS", headerStyle: { backgroundColor: "#452790" }, headerTintColor: "#fff", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 15,}}} />
                    <Stack.Screen name="encontrados" options={{ headerShown: true, title: "ENCONTRADOS", headerStyle: { backgroundColor: "#452790" }, headerTintColor: "#fff", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 15,}}} />
                    <Stack.Screen name="enAdopcion"options={{ headerShown: true, title: "EN ADOPCION", headerStyle: { backgroundColor: "#452790" }, headerTintColor: "#fff", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 15,}}} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </SafeAreaProvider>
        </Provider>
    );
}