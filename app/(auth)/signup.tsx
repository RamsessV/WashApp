import { signUp } from "@/services/authService";
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

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateForm = () => {
    const errors: string[] = [];
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.push("El nombre es obligatorio.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.push("Ingresa un email con formato válido.");
    }

    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres.");
    }

    if (!/\d/.test(password)) {
      errors.push("La contraseña debe incluir al menos un número.");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("La contraseña debe incluir al menos una mayúscula.");
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("La contraseña debe incluir al menos un carácter especial.");
    }

    if (password !== confirmPassword) {
      errors.push("Las contraseñas no coinciden.");
    }

    return errors;
  };

  const handleSignUp = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      Alert.alert("Revisa tu información", errors.join("\n"));
      return;
    }

    const { data, error } = await signUp(name, email, password);

    if (error) {
      Alert.alert("No se pudo registrar", error.message);
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

            <Input label="Nombre" value={name} onChangeText={setName} />

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

            <Input
              label="Confirmar Contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <Button title="Registrate" onPress={handleSignUp} />
            <Link
              href="/login"
              style={{
                marginTop: 12,
                alignSelf: "center",
                color: "#1E40AF",
                fontWeight: "600",
              }}
            >
              ya tienes cuenta?
            </Link>
          </Content>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
