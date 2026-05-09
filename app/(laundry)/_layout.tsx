import { LaundryProvider } from "@/contexts/LaundryContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LaundryLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <LaundryProvider>
        <Tabs
          screenOptions={({ route }: any) => ({
            headerShown: false,
            tabBarIcon: ({ focused }: { focused: boolean }) => {
              const name = route.name as string;
              let iconName: any = "";
              if (name === "dashboard") iconName = "analytics-outline";
              else if (name === "services") iconName = "layers-outline";
              else if (name === "options") iconName = "settings-outline";

              return (
                <View
                  style={{
                    width: 34,
                    height: 20,
                    borderRadius: 6,
                    backgroundColor: focused ? "#2563eb" : "#e5e7eb",
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
            tabBarActiveTintColor: "#2563eb",
            tabBarInactiveTintColor: "#64748b",
          })}
        />
      </LaundryProvider>
    </SafeAreaView>
  );
}
