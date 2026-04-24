import Button from "@/components/Button";
import Input from "@/components/Input";
import Spinner from "@/components/Spinner";
import { useLaundryContext } from "@/contexts/LaundryContext";
import {
  createService,
  deleteService,
  getServicesByLaundryId,
} from "@/services/serviceService";
import { Service } from "@/types/Service";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Header, Heading, Screen, Subheading } from "./dashboard";

const Form = styled.View`
  padding: 20px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const FormRow = styled.View`
  flex-direction: row;
  gap: 10px;
  align-items: flex-end;
`;

const InputFlex = styled.View`
  flex: 1;
`;

const ServiceItem = styled.View`
  padding: 16px 20px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ServiceName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ServicePrice = styled.Text`
  font-size: 14px;
  color: #165f3f;
  font-weight: 700;
`;

const ServiceActions = styled.View`
  align-items: flex-end;
  gap: 8px;
`;

const DeleteText = styled.Text`
  font-size: 13px;
  color: #b42318;
  font-weight: 600;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 40px 20px;
`;

export default function Services() {
  const { laundry, loading } = useLaundryContext();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadServices = async () => {
    if (!laundry) return;
    try {
      const servicesData = await getServicesByLaundryId(laundry.id);
      setServices(servicesData);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  useEffect(() => {
    if (!laundry) {
      setServices([]);
      return;
    }

    void loadServices();
  }, [laundry]);

  const handleCreateService = async () => {
    if (!serviceName || !servicePrice || !laundry) return;

    setCreating(true);
    try {
      await createService(serviceName, parseFloat(servicePrice), laundry.id);
      setServiceName("");
      setServicePrice("");
      await loadServices();
    } catch (error) {
      console.error("Error creating service:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    setDeletingId(serviceId);
    try {
      await deleteService(serviceId);
      await loadServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Spinner text="Cargando servicios..." />;
  }

  return (
    <Screen>
      <Header>
        <Heading>{laundry?.name || "Servicios"}</Heading>
        <Subheading>Gestiona tus servicios</Subheading>
      </Header>

      <Form>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 12,
            color: "#333",
          }}
        >
          Agregar nuevo servicio
        </Text>
        <FormRow>
          <InputFlex>
            <Input
              label="Servicio"
              value={serviceName}
              onChangeText={setServiceName}
              placeholder="Ej: Lavado de ropa"
            />
          </InputFlex>
          <InputFlex>
            <Input
              label="Precio"
              value={servicePrice}
              onChangeText={setServicePrice}
              keyboardType="decimal-pad"
              placeholder="Ej: 5.00"
            />
          </InputFlex>
        </FormRow>
        <Button
          title="Agregar"
          onPress={handleCreateService}
          loading={creating}
          disabled={creating || !serviceName || !servicePrice}
        />
      </Form>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ServiceItem>
            <ServiceName>{item.service}</ServiceName>
            <ServiceActions>
              <ServicePrice>${item.price.toFixed(2)}</ServicePrice>
              <TouchableOpacity
                onPress={() => handleDeleteService(item.id)}
                disabled={deletingId === item.id}
              >
                <DeleteText>
                  {deletingId === item.id ? "Eliminando..." : "Eliminar"}
                </DeleteText>
              </TouchableOpacity>
            </ServiceActions>
          </ServiceItem>
        )}
        ListEmptyComponent={
          <EmptyText>
            No hay servicios registrados. Agrega uno para comenzar.
          </EmptyText>
        }
      />
    </Screen>
  );
}
