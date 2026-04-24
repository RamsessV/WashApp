import Button from "@/components/Button";
import Input from "@/components/Input";
import Spinner from "@/components/Spinner";
import { useLaundryContext } from "@/contexts/LaundryContext";
import { signOut } from "@/services/authService";
import { updateLaundry } from "@/services/LaundryService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Header, Heading, Screen, Subheading } from "./dashboard";

const Form = styled.View`
  padding: 20px;
`;

export default function Options() {
  const { laundry, loading, refreshLaundry, setLaundry } = useLaundryContext();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const saveChanges = async () => {
    if (!laundry) return;

    setSaving(true);
    try {
      const updatedLaundry = await updateLaundry(name, address, phone);

      if (updatedLaundry) {
        setLaundry(updatedLaundry);
      } else {
        await refreshLaundry();
      }
    } catch (error) {
      console.error("Error saving laundry data:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setName(laundry?.name ?? "");
    setAddress(laundry?.address ?? "");
    setPhone(laundry?.phone ?? "");
  }, [laundry]);

  if (loading && !laundry) {
    return <Spinner text="Cargando datos..." />;
  }

  return (
    <Screen>
      <Header>
        <Heading>{laundry?.name || "Opciones"}</Heading>
        <Subheading>Actualizar información</Subheading>
      </Header>

      <Form>
        <Input label="Nombre" value={name} onChangeText={setName} />

        <Input label="Dirección" value={address} onChangeText={setAddress} />

        <Input
          label="Teléfono"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Button
          title="Guardar cambios"
          onPress={saveChanges}
          loading={saving}
          disabled={saving}
        />
      </Form>

      <Form style={{ marginTop: "auto" }}>
        <Button title="Cerrar sesión" onPress={handleSignOut} secondary />
      </Form>
    </Screen>
  );
}
