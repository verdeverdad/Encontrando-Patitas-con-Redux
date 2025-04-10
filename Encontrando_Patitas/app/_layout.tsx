import { Link, Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { BackButton } from "@/components/BackButtons";
import { Tabs } from "expo-router/tabs";
import React from "react";
import { NavBar } from "@/components/Navbar";

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
              textShadowColor: "#000", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10,
            }}
          >ENCONTRANDO PATITAS
          </Text>
          <MaterialIcons name={"pets"}
            color="white"
            size={30} />
        </View>
        <Tabs
          initialRouteName="index"
          backBehavior="history"
          screenOptions={{ headerLeft: () => <BackButton />, 
            headerShown: false,
             tabBarActiveTintColor: '#fff',
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarStyle: {
            backgroundColor: '#f01250',
            },
          }}
        >
          <Tabs.Screen name="index" options={{
          title: "INICIO",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={30}
            />
          ),
        }}/>
          <Tabs.Screen name="perfil" options={{
          title: "PERFIL",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "person-circle" : "person-circle-outline"
              }
              color={color}
              size={33}
            />
          ),
        }}/>
          <Tabs.Screen
            name="perdidosPantalla"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="encontrados"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="enAdopcion"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </SafeAreaProvider>
    </Provider>
  );
}