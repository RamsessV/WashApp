import Spinner from "@/components/Spinner";
import { getOrderById, getOrderItems } from "@/services/orderService";
import { Container, Content, Title } from "@/theme/layout";
import { Order, OrderItem } from "@/types/Order";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
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

const Section = styled.View`
  margin-top: 16px;
`;

const ItemRow = styled.View`
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.06);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ItemLabel = styled.Text`
  font-weight: 700;
`;

const Timeline = styled.View`
  margin-top: 12px;
`;

const Step = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

const Dot = styled.View<{ color?: string; filled?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  border-width: 2px;
  border-color: ${(p) => p.color || "#ccc"};
  background-color: ${(p) => (p.filled ? p.color || "#ccc" : "transparent")};
`;

const StepContent = styled.View``;

const StepTitle = styled.Text`
  font-weight: 700;
  font-size: 14px;
`;

const StepSubtitle = styled.Text`
  color: #666;
  font-size: 12px;
`;

export default function OrderStatus() {
  const params = useLocalSearchParams();
  const orderId = Number(params.orderId);

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);
  async function loadData(isRefresh = false) {
    try {
      if (!isRefresh) setLoading(true);
      const [o, its] = await Promise.all([
        getOrderById(orderId),
        getOrderItems(orderId),
      ]);
      if (!mountedRef.current) return;
      setOrder(o);
      setItems(its ?? []);
    } catch (err) {
      Alert.alert("Error", "No pudimos cargar el estado de la orden.");
    } finally {
      if (!isRefresh) {
        if (mountedRef.current) setLoading(false);
      }
    }
  }

  useEffect(() => {
    mountedRef.current = true;
    if (!Number.isNaN(orderId)) {
      void loadData();
    } else {
      setLoading(false);
    }
    return () => {
      mountedRef.current = false;
    };
  }, [orderId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(true);
    setRefreshing(false);
  };

  const currencyFormatter = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  });

  if (loading) {
    return (
      <Container>
        <Content>
          <Spinner text="Cargando estado de la orden..." />
        </Content>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <Content>
          <Title>Orden no encontrada</Title>
        </Content>
      </Container>
    );
  }

  const steps =
    order.status === "cancelled"
      ? [
          { key: "pending", title: "Pendiente", iconName: "time-outline" },
          {
            key: "cancelled",
            title: "Cancelada",
            iconName: "close-circle-outline",
          },
        ]
      : [
          { key: "pending", title: "Pendiente", iconName: "time-outline" },
          { key: "in_progress", title: "En proceso", iconName: "sync-outline" },
          {
            key: "completed",
            title: "Completada",
            iconName: "checkmark-circle-outline",
          },
        ];

  const statusIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#16a34a"
          />
        }
      >
        <Header>
          <HeaderLabel>Orden</HeaderLabel>
          <HeaderName>Orden #{order.id}</HeaderName>
        </Header>

        <Content>
          <Section>
            <Title>Items</Title>
            {items.map((it) => (
              <ItemRow key={it.id}>
                <ItemLabel>
                  {it.service} × {it.quantity}
                </ItemLabel>
                <ItemLabel>{currencyFormatter.format(it.subtotal)}</ItemLabel>
              </ItemRow>
            ))}
          </Section>

          <Section>
            <Title>Progreso</Title>

            {/* Icons row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              {steps.map((s, idx) => (
                <View key={s.key} style={{ flex: 1, alignItems: "center" }}>
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor:
                        idx <= statusIndex ? "#16a34a" : "#e5e7eb",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 6,
                    }}
                  >
                    <Ionicons
                      name={(s as any).iconName}
                      size={18}
                      color={idx <= statusIndex ? "#fff" : "#475569"}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: idx <= statusIndex ? "#165f3f" : "#6b6b6b",
                    }}
                  >
                    {s.title}
                  </Text>
                </View>
              ))}
            </View>

            {/* Progress bar */}
            <View
              style={{
                flexDirection: "row",
                height: 8,
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              {steps.map((s, idx) => (
                <View
                  key={s.key}
                  style={{
                    flex: 1,
                    backgroundColor: idx <= statusIndex ? "#16a34a" : "#e5e7eb",
                  }}
                />
              ))}
            </View>

            {/* Subtitles */}
            <View>
              {steps.map((s, idx) => (
                <View key={s.key} style={{ marginBottom: 6 }}>
                  <StepTitle
                    style={{ color: idx <= statusIndex ? "#065f46" : "#666" }}
                  >
                    {s.title}
                  </StepTitle>
                  <StepSubtitle>
                    {idx <= statusIndex ? "Completado" : "Pendiente"}
                  </StepSubtitle>
                </View>
              ))}
            </View>
          </Section>

          <Section>
            <Title>Detalles</Title>
            <ItemRow>
              <ItemLabel>Fecha</ItemLabel>
              <ItemLabel>
                {new Date(order.created_at).toLocaleString()}
              </ItemLabel>
            </ItemRow>

            <ItemRow>
              <ItemLabel>Total</ItemLabel>
              <ItemLabel>{currencyFormatter.format(order.total)}</ItemLabel>
            </ItemRow>
          </Section>
        </Content>
      </ScrollView>
    </Container>
  );
}
