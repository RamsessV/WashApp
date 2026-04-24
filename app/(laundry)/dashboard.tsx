import Spinner from "@/components/Spinner";
import { useLaundryContext } from "@/contexts/LaundryContext";
import styled from "styled-components/native";

export const Screen = styled.View`
  flex: 1;
  background-color: #f3f6f5;
`;

export const Header = styled.View`
  background-color: #165f3f;
  padding: 48px 20px 24px 20px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`;

export const Heading = styled.Text`
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
`;

export const Subheading = styled.Text`
  margin-top: 8px;
  color: #d6f0e3;
  font-size: 14px;
`;

const Center = styled.View`
  padding: 28px;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: #575757;
  font-size: 15px;
`;

export default function Dashboard() {
  const { laundry, loading, error } = useLaundryContext();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Screen>
        <Header>
          <Heading>Dashboard</Heading>
          <Subheading>{error}</Subheading>
        </Header>
      </Screen>
    );
  }

  if (!laundry) {
    return (
      <Screen>
        <Header>
          <Heading>Dashboard</Heading>
          <Subheading>Aun no tienes una lavanderia registrada.</Subheading>
        </Header>
        <Center>
          <EmptyText>
            Registra tu lavanderia para comenzar a administrar tu negocio.
          </EmptyText>
        </Center>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header>
        <Heading>{laundry.name}</Heading>
        <Subheading>Bienvenido</Subheading>
      </Header>
    </Screen>
  );
}
