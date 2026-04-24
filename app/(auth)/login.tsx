import { signIn } from "@/services/authService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { Container, Content, HeaderImage, Title } from "../../theme/layout";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    const errors: string[] = [];
    const trimmedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.push("Ingresa un email con formato válido.");
    }

    if (!password) {
      errors.push("La contraseña es obligatoria.");
    }

    return errors;
  };

  const handleLogin = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      Alert.alert("Revisa tu información", errors.join("\n"));
      return;
    }

    const { data, error } = await signIn(email, password);

    if (error) {
      let errorMessage = error.message;
      if (errorMessage.includes("Invalid login credentials")) {
        errorMessage = "Email o contraseña incorrectos";
      } else if (errorMessage.includes("Email not confirmed")) {
        errorMessage = "Por favor, verifica tu email antes de continuar";
      }
      Alert.alert("No se pudo iniciar sesión", errorMessage);
      return;
    }

    router.push("/");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={40}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Container>
          <HeaderImage
            resizeMode="cover"
            source={{
              uri: "https://lavayseca.com.mx/wp-content/uploads/2022/07/Copia-de-239446396_2971717819738680_931562711350655753_n.jpg",
            }}
          />

          <Content>
            <Title>WashApp</Title>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button title="Login" onPress={handleLogin} />
            <Link
              href="/signup"
              style={{
                marginTop: 12,
                alignSelf: "center",
                color: "#1E40AF",
                fontWeight: "600",
              }}
            >
              no tienes cuenta?
            </Link>
          </Content>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
