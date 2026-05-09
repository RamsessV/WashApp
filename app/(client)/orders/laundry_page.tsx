import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { getLaundryById } from "@/services/LaundryService";
import { getServicesByLaundryId } from "@/services/serviceService";
import { Container, Content } from "@/theme/layout";
import { Laundry } from "@/types/Laundry";
import { Service } from "@/types/Service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import styled from "styled-components/native";

const Header = styled.View`
  padding: 24px 20px 18px 20px;
  background-color: #165f3f;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`;

const HeaderLabel = styled.Text`
  color: #d6f0e3;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const HeaderName = styled.Text`
  margin-top: 6px;
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
`;

const HeaderInfo = styled.Text`
  margin-top: 10px;
  color: #e5f4ec;
  font-size: 14px;
  line-height: 20px;
`;

const InfoCard = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.06);
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: #1f1f1f;
  margin-bottom: 12px;
`;

const DetailRow = styled.View`
  margin-bottom: 12px;
`;

const DetailLabel = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #7d7d7d;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const DetailValue = styled.Text`
  margin-top: 4px;
  font-size: 15px;
  color: #2b2b2b;
  line-height: 22px;
`;

const ServiceCard = styled.View`
  background-color: #ffffff;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.06);
`;

const ServiceName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #1f1f1f;
`;

const ServicePrice = styled.Text`
  margin-top: 8px;
  font-size: 15px;
  font-weight: 800;
  color: #19a64a;
`;

const QuantityRow = styled.View`
  margin-top: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const QuantityControls = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: #165f3f;
`;

const QuantityButtonText = styled.Text`
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
`;

const QuantityValue = styled.Text`
  min-width: 22px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #1f1f1f;
`;

const SubtotalText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #2b2b2b;
`;

const FooterCard = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 16px;
  margin-top: 10px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.06);
`;

const FooterTitle = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: #1f1f1f;
  margin-bottom: 8px;
`;

const FooterText = styled.Text`
  font-size: 14px;
  color: #4f4f4f;
  margin-bottom: 14px;
`;

const EmptyState = styled.View`
  padding: 18px;
  background-color: rgba(25, 166, 74, 0.08);
  border-radius: 18px;
`;

const EmptyText = styled.Text`
  color: #4f4f4f;
  font-size: 14px;
  line-height: 20px;
`;

export default function LaundryPage() {
  const { laundryId } = useLocalSearchParams();
  const router = useRouter();
  const [laundry, setLaundry] = useState<Laundry | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const idValue = Array.isArray(laundryId) ? laundryId[0] : laundryId;

      if (!idValue) {
        setError("No pudimos identificar la lavanderia.");
        setLoading(false);
        return;
      }

      const laundryIdNumber = Number.parseInt(idValue, 10);

      if (Number.isNaN(laundryIdNumber)) {
        setError("El identificador de la lavanderia no es valido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [laundryData, servicesData] = await Promise.all([
          getLaundryById(laundryIdNumber),
          getServicesByLaundryId(laundryIdNumber),
        ]);

        if (!laundryData) {
          setError("No encontramos la lavanderia solicitada.");
          setLaundry(null);
          setServices([]);
          return;
        }

        setLaundry(laundryData);
        setServices(servicesData);
        setQuantities({});
        setError(null);
      } catch {
        setError("No pudimos cargar la informacion de la lavanderia.");
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [laundryId]);

  if (loading) {
    return (
      <Container>
        <Content>
          <Spinner text="Cargando informacion de la lavanderia..." />
        </Content>
      </Container>
    );
  }

  if (error || !laundry) {
    return (
      <Container>
        <Header>
          <HeaderLabel>Lavanderia</HeaderLabel>
          <HeaderName>Detalle no disponible</HeaderName>
          <HeaderInfo>
            {error ?? "No pudimos cargar esta lavanderia."}
          </HeaderInfo>
        </Header>

        <Content>
          <EmptyState>
            <EmptyText>
              Vuelve atras y elige otra lavanderia disponible para ver su
              informacion y servicios.
            </EmptyText>
          </EmptyState>
        </Content>
      </Container>
    );
  }

  const currencyFormatter = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  });

  const updateQuantity = (serviceId: number, nextValue: number) => {
    setQuantities((previous) => ({
      ...previous,
      [serviceId]: Math.max(0, nextValue),
    }));
  };

  const selectedServices = services
    .filter((service) => (quantities[service.id] ?? 0) > 0)
    .map((service) => {
      const quantity = quantities[service.id] ?? 0;

      return {
        id: service.id,
        service: service.service,
        price: service.price,
        quantity,
        subtotal: service.price * quantity,
      };
    });

  const total = selectedServices.reduce(
    (accumulator, item) => accumulator + item.subtotal,
    0,
  );

  const handleNext = () => {
    if (selectedServices.length === 0) {
      Alert.alert(
        "Selecciona servicios",
        "Agrega al menos un servicio para crear la orden.",
      );
      return;
    }

    router.push({
      pathname: "/(client)/orders/confirm_order",
      params: {
        laundryId: Array.isArray(laundryId) ? laundryId[0] : laundryId,
        laundryName: laundry?.name,
        total,
        items: JSON.stringify(selectedServices),
      },
    });
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Header>
          <HeaderLabel>Lavanderia</HeaderLabel>
          <HeaderName>{laundry.name}</HeaderName>
          <HeaderInfo>
            Calificacion {laundry.rating.toFixed(1)} • Servicios disponibles
            para agendar
          </HeaderInfo>
        </Header>

        <Content>
          <InfoCard>
            <SectionTitle>Informacion general</SectionTitle>

            <DetailRow>
              <DetailLabel>Direccion</DetailLabel>
              <DetailValue>{laundry.address}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Telefono</DetailLabel>
              <DetailValue>{laundry.phone}</DetailValue>
            </DetailRow>
          </InfoCard>

          <SectionTitle>Inicia tu orden</SectionTitle>

          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service.id}>
                <ServiceName>{service.service}</ServiceName>
                <ServicePrice>
                  {currencyFormatter.format(service.price)}
                </ServicePrice>

                <QuantityRow>
                  <QuantityControls>
                    <QuantityButton
                      onPress={() =>
                        updateQuantity(
                          service.id,
                          (quantities[service.id] ?? 0) - 1,
                        )
                      }
                    >
                      <QuantityButtonText>-</QuantityButtonText>
                    </QuantityButton>

                    <QuantityValue>{quantities[service.id] ?? 0}</QuantityValue>

                    <QuantityButton
                      onPress={() =>
                        updateQuantity(
                          service.id,
                          (quantities[service.id] ?? 0) + 1,
                        )
                      }
                    >
                      <QuantityButtonText>+</QuantityButtonText>
                    </QuantityButton>
                  </QuantityControls>

                  <SubtotalText>
                    Subtotal:{" "}
                    {currencyFormatter.format(
                      (quantities[service.id] ?? 0) * service.price,
                    )}
                  </SubtotalText>
                </QuantityRow>
              </ServiceCard>
            ))
          ) : (
            <EmptyState>
              <EmptyText>
                Esta lavanderia aun no tiene servicios publicados.
              </EmptyText>
            </EmptyState>
          )}

          <FooterCard>
            <FooterTitle>Resumen de pedido</FooterTitle>
            <FooterText>
              Servicios elegidos: {selectedServices.length} | Total:{" "}
              {currencyFormatter.format(total)}
            </FooterText>

            <Button
              title="Siguiente"
              onPress={handleNext}
              disabled={selectedServices.length === 0}
            />
          </FooterCard>
        </Content>
      </ScrollView>
    </Container>
  );
}
