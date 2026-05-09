import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          const name = route.name as string;
          let iconName: any = "";
          if (name === "home") iconName = "home-outline";
          else if (name === "my_orders") iconName = "cube-outline";
          else if (name === "profile") iconName = "person-outline";

          return (
            <View
              style={{
                width: 34,
                height: 20,
                borderRadius: 6,
                backgroundColor: focused ? "#19a64a" : "#e5e7eb",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={iconName}
                size={14}
                color={focused ? "#fff" : "#475569"}
              />
            </View>
          );
        },
        tabBarActiveTintColor: "#19a64a",
        tabBarInactiveTintColor: "#64748b",
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Inicio" }} />
      <Tabs.Screen name="my_orders" options={{ title: "Rastrear" }} />
      <Tabs.Screen name="profile" options={{ title: "Yo" }} />
      <Tabs.Screen name="(orders)" options={{ href: null }} />
      <Tabs.Screen name="orders" options={{ href: null }} />
    </Tabs>
  );
}
