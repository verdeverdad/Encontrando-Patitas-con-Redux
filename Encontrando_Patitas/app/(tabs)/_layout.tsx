// import { Tabs } from "expo-router";
// import Ionicons from "@expo/vector-icons/Ionicons";

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: '#f01250',
//         headerShown: false,
//         headerStyle: {
//           backgroundColor: '#25292e',
//         },
//         headerShadowVisible: true,
//         headerTintColor: '#ffd33d',
//         tabBarStyle: {
//           backgroundColor: '#25292e',
//         },
        
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           headerShown: false,
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? "home-sharp" : "home-outline"}
//               color={color}
//               size={30}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="perfil"
//         options={{
//           title: "Perfil",
//           headerShown: false,
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? "person-circle" : "person-circle-outline"}
//               color={color}
//               size={30}
//             />
//           ),
//           tabBarShowLabel: false, // Oculta la etiqueta de la pestaña
//           // tabBarStyle: { display: 'none' }, // Oculta la barra de pestañas
//         }}
//       />
//     </Tabs>
//   );
// }