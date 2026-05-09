import Button from "@/components/Button";
import Input from "@/components/Input";
import { getSession, signOut, updateUser } from "@/services/authService";
import { Container, Content, Title } from "@/theme/layout";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

export default function Profile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const session = await getSession();
      const user = session?.user;
      if (!mounted) return;
      setName((user?.user_metadata as any)?.name ?? "");
      setEmail(user?.email ?? "");
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Nombre requerido", "Ingresa un nombre válido.");
      return;
    }

    setLoading(true);
    try {
      await updateUser(name.trim(), password || (undefined as any));
      Alert.alert("Actualizado", "Tu perfil se actualizó correctamente.");
      setPassword("");
    } catch (err) {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Container>
        <Content>
          <Title>Mi perfil</Title>

          <Input label="Nombre" value={name} onChangeText={setName} />
          <View style={{ marginTop: 8, marginBottom: 8 }}>
            <Text
              style={{
                color: "#6b6b6b",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Email
            </Text>
            <Text style={{ fontSize: 16, marginTop: 6 }}>{email}</Text>
          </View>
          <Input
            label="Nueva contraseña (opcional)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button title="Guardar" onPress={handleSave} loading={loading} />

          <View style={{ marginTop: 12 }}>
            <Button
              title="Cerrar sesión"
              onPress={handleSignOut}
              secondary
              loading={signingOut}
            />
          </View>
        </Content>
      </Container>
    </ScrollView>
  );
}
