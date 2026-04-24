import { getSession } from "@/services/authService";
import { getLaundrys } from "@/services/LaundryService";
import { Container, Content, Title } from "@/theme/layout";
import { Laundry } from "@/types/Laundry";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import LaundryCard from "../../components/LaundryCard";
import Spinner from "../../components/Spinner";

function EmptyState() {
  return (
    <View style={{ paddingVertical: 24 }}>
      <Text style={{ fontSize: 16, color: "#6b6b6b", textAlign: "center" }}>
        No hay laundrys disponibles por ahora.
      </Text>
    </View>
  );
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [laundrys, setLaundrys] = useState<Laundry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayName =
    session?.user.user_metadata?.name ??
    session?.user.email?.split("@")[0] ??
    "usuario";

  useEffect(() => {
    async function loadData() {
      try {
        const [sessionData, laundrysData] = await Promise.all([
          getSession(),
          getLaundrys(),
        ]);

        setSession(sessionData);
        setLaundrys(laundrysData);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <Content>
          <Spinner text="Cargando laundrys..." />
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={laundrys}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <Content>
            <Title>Hola {displayName}</Title>

            <Text style={{ fontSize: 16, color: "#6b6b6b", marginBottom: 16 }}>
              Laundrys disponibles
            </Text>
          </Content>
        }
        renderItem={({ item }) => (
          <Content>
            <LaundryCard
              name={item.name}
              location={item.address}
              phone={item.phone}
              rating={item.rating}
            />
          </Content>
        )}
        ListEmptyComponent={<EmptyState />}
      />
    </Container>
  );
}
