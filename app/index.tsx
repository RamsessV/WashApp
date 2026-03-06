import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const onPress = () => {
    router.push({ pathname: "/customers/pages/home" });
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text onPress={onPress}>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
