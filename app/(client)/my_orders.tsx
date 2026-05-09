import Spinner from "@/components/Spinner";
import { getOrders } from "@/services/orderService";
import { Container, Content, Title } from "@/theme/layout";
import { Order } from "@/types/Order";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

const OrderCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.06);
`;

const OrderHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const OrderNumber = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #165f3f;
`;

const StatusBadge = styled.View<{ status: string }>`
  background-color: ${(props) => {
    switch (props.status) {
      case "pending":
        return "#fff3cd";
      case "in_progress":
        return "#d1ecf1";
      case "completed":
        return "#d4edda";
      case "cancelled":
        return "#f8d7da";
      default:
        return "#e2e3e5";
    }
  }};
  padding: 6px 12px;
  border-radius: 8px;
`;

const StatusText = styled.Text<{ status: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => {
    switch (props.status) {
      case "pending":
        return "#856404";
      case "in_progress":
        return "#0c5460";
      case "completed":
        return "#155724";
      case "cancelled":
        return "#721c24";
      default:
        return "#383d41";
    }
  }};
  text-transform: capitalize;
`;

const OrderDetail = styled.View`
  margin-bottom: 8px;
  flex-direction: row;
  justify-content: space-between;
`;

const DetailLabel = styled.Text`
  font-size: 12px;
  color: #7d7d7d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const DetailValue = styled.Text`
  font-size: 13px;
  color: #2b2b2b;
  font-weight: 500;
`;

const TotalAmount = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: #19a64a;
`;

const EmptyState = styled.View`
  padding: 32px 20px;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #6b6b6b;
  text-align: center;
`;

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  in_progress: "En proceso",
  completed: "Completada",
  cancelled: "Cancelada",
};

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const fetchedOrders = await getOrders();
      setOrders(
        fetchedOrders.sort((a, b) => {
          const statusRank = (status: string) => (status === "pending" ? 0 : 1);

          const rankDiff = statusRank(a.status) - statusRank(b.status);
          if (rankDiff !== 0) {
            return rankDiff;
          }

          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        }),
      );
      setError(null);
    } catch (err) {
      setError("No pudimos cargar tus órdenes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (mounted) {
        await loadOrders();
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
  };

  const currencyFormatter = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container>
        <Content>
          <Spinner text="Cargando tus órdenes..." />
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#165f3f"
          />
        }
        ListHeaderComponent={
          <Content>
            <Title>Mis órdenes</Title>
            {error && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: "#d32f2f", fontSize: 14 }}>{error}</Text>
              </View>
            )}
          </Content>
        }
        renderItem={({ item }) => (
          <Content>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/orders/order_status",
                  params: { orderId: item.id  },
                })
              }
            >
              <OrderCard>
              <OrderHeader>
                <OrderNumber>Orden #{item.id}</OrderNumber>
                <StatusBadge status={item.status}>
                  <StatusText status={item.status}>
                    {statusLabels[item.status] || item.status}
                  </StatusText>
                </StatusBadge>
              </OrderHeader>

              <OrderDetail>
                <DetailLabel>Fecha</DetailLabel>
                <DetailValue>{formatDate(item.created_at)}</DetailValue>
              </OrderDetail>

              <OrderDetail>
                <DetailLabel>Pago</DetailLabel>
                <DetailValue>{item.paid ? "Pagado" : "Pendiente"}</DetailValue>
              </OrderDetail>

              <OrderDetail>
                <DetailLabel>Total</DetailLabel>
                <TotalAmount>
                  {currencyFormatter.format(item.total)}
                </TotalAmount>
              </OrderDetail>
              </OrderCard>
            </TouchableOpacity>
          </Content>
        )}
        ListEmptyComponent={
          !error ? (
            <Content>
              <EmptyState>
                <EmptyText>
                  Aún no tienes órdenes.{"\n"}¡Crea una para comenzar!
                </EmptyText>
              </EmptyState>
            </Content>
          ) : null
        }
      />
    </Container>
  );
}
