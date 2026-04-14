import { getSession } from "@/services/authService";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Index() {
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const session = await getSession();
    setTimeout(() => {
      router.push(session ? "/pages/home" : "/pages/signup");
    }, 2000);
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 250,
    height: 250,
  },
});
