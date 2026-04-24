import { LaundryProvider } from "@/contexts/LaundryContext";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LaundryLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <LaundryProvider>
        <Tabs screenOptions={{ headerShown: false }} />
      </LaundryProvider>
    </SafeAreaView>
  );
}
