import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function OrdersLayout() {
  return (
    <SafeAreaProvider>
      <Slot screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
