import Button from "@/components/Button";
import { createOrder } from "@/services/orderService";
import { Container, Content } from "@/theme/layout";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, ScrollView, TouchableOpacity, View } from "react-native";
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

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: #1f1f1f;
  margin-bottom: 12px;
  margin-top: 12px;
`;

const ItemCard = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.06);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ItemName = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #1f1f1f;
  flex: 1;
`;

const ItemPrice = styled.Text`
  font-size: 14px;
  font-weight: 800;
  color: #19a64a;
`;

const TotalCard = styled.View`
  background-color: #f2f2f2;
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const TotalLabel = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #6b6b6b;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const TotalValue = styled.Text`
  margin-top: 6px;
  font-size: 28px;
  font-weight: 800;
  color: #165f3f;
`;

const PaymentOptionContainer = styled.View`
  margin-bottom: 12px;
`;

const PaymentOption = styled(TouchableOpacity)<{ selected?: boolean }>`
  background-color: ${(props) => (props.selected ? "#e5f4ec" : "#ffffff")};
  border-radius: 12px;
  padding: 14px;
  border-width: 2px;
  border-color: ${(props) =>
    props.selected ? "#165f3f" : "rgba(0, 0, 0, 0.06)"};
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const RadioButton = styled.View<{ selected?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: #165f3f;
  background-color: ${(props) => (props.selected ? "#165f3f" : "transparent")};
`;

const PaymentText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
`;

const DisabledText = styled.Text`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

const SuccessOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SuccessCard = styled.View`
  background-color: #ffffff;
  border-radius: 24px;
  padding: 32px 24px;
  align-items: center;
  max-width: 90%;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
`;

const CheckIcon = styled.Text`
  font-size: 64px;
  margin-bottom: 16px;
`;

const SuccessTitle = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: #165f3f;
  margin-bottom: 8px;
  text-align: center;
`;

const SuccessMessage = styled.Text`
  font-size: 14px;
  color: #6b6b6b;
  text-align: center;
  line-height: 20px;
  margin-bottom: 24px;
`;

const OrderNumber = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #165f3f;
  margin-top: 8px;
`;

const SuccessButton = styled.TouchableOpacity`
  background-color: #165f3f;
  padding: 14px 32px;
  border-radius: 20px;
  width: 100%;
  align-items: center;
`;

const SuccessButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`;

interface SuccessModalProps {
  visible: boolean;
  orderId?: number;
  onClose: () => void;
}

function SuccessModal({ visible, orderId, onClose }: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SuccessOverlay>
        <SuccessCard>
          <CheckIcon>✓</CheckIcon>
          <SuccessTitle>¡Orden confirmada!</SuccessTitle>
          <SuccessMessage>
            Tu orden fue creada exitosamente.{"\n"}Pago en efectivo.
          </SuccessMessage>
          <SuccessMessage>
            Número de orden
            <OrderNumber>#{orderId ?? "-"}</OrderNumber>
          </SuccessMessage>
          <SuccessButton onPress={onClose}>
            <SuccessButtonText>Ir al inicio</SuccessButtonText>
          </SuccessButton>
        </SuccessCard>
      </SuccessOverlay>
    </Modal>
  );
}

export default function ConfirmOrder() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<number | undefined>();

  const laundryId = Number(params.laundryId);
  const total = Number(params.total);
  const laundryName = params.laundryName as string;
  const items = JSON.parse(params.items as string);

  const currencyFormatter = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  });

  const handleConfirm = async () => {
    if (paymentMethod === "card") {
      Alert.alert(
        "No disponible",
        "El pago con tarjeta no está disponible aún. Por favor usa efectivo.",
      );
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map(
        (item: { service: string; quantity: number; subtotal: number }) => ({
          service: item.service,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }),
      );

      const createdOrder = await createOrder(
        {
          laundryId,
          total,
          status: "pending",
          paid: false,
        },
        orderItems,
      );

      setSuccessOrderId(createdOrder?.id);
      setShowSuccess(true);
    } catch {
      Alert.alert("Error", "No pudimos crear la orden por ahora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <Header>
            <HeaderLabel>Confirmación</HeaderLabel>
            <HeaderName>{laundryName}</HeaderName>
          </Header>

          <Content>
            <SectionTitle>Resumen de tu orden</SectionTitle>

            {items.map(
              (
                item: { service: string; quantity: number; subtotal: number },
                idx: number,
              ) => (
                <ItemCard key={idx}>
                  <ItemName>
                    {item.service} × {item.quantity}
                  </ItemName>
                  <ItemPrice>
                    {currencyFormatter.format(item.subtotal)}
                  </ItemPrice>
                </ItemCard>
              ),
            )}

            <TotalCard>
              <TotalLabel>Total a pagar</TotalLabel>
              <TotalValue>{currencyFormatter.format(total)}</TotalValue>
            </TotalCard>

            <SectionTitle>Método de pago</SectionTitle>

            <PaymentOptionContainer>
              <PaymentOption
                selected={paymentMethod === "cash"}
                onPress={() => setPaymentMethod("cash")}
              >
                <RadioButton selected={paymentMethod === "cash"} />
                <PaymentText>Efectivo</PaymentText>
              </PaymentOption>
            </PaymentOptionContainer>

            <PaymentOptionContainer>
              <PaymentOption
                selected={paymentMethod === "card"}
                onPress={() => {
                  Alert.alert(
                    "No disponible",
                    "El pago con tarjeta no está habilitado aún.",
                  );
                }}
                disabled
              >
                <RadioButton selected={false} />
                <View style={{ flex: 1 }}>
                  <PaymentText style={{ color: "#ccc" }}>Tarjeta</PaymentText>
                  <DisabledText>Próximamente disponible</DisabledText>
                </View>
              </PaymentOption>
            </PaymentOptionContainer>

            <Button
              title="Confirmar orden"
              onPress={handleConfirm}
              loading={loading}
            />

            <View style={{ marginTop: 12 }}>
              <Button
                title="Volver"
                onPress={() => router.back()}
                secondary
                disabled={loading}
              />
            </View>
          </Content>
        </ScrollView>
      </Container>
      <SuccessModal
        visible={showSuccess}
        orderId={successOrderId}
        onClose={() => router.replace("/my_orders")}
      />
    </>
  );
}
