import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="pages/login" />
      <Stack.Screen name="pages/home" />
      <Stack.Screen name="pages/signup" />
    </Stack>
  );
}
