import { ActivityIndicator, Text } from "react-native";
import styled from "styled-components/native";

const Wrapper = styled.View`
  width: 100%;
  padding: 32px 16px;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const LoadingText = styled(Text)`
  font-size: 14px;
  color: #6b6b6b;
  font-weight: 600;
`;

type SpinnerProps = {
  text?: string;
};

export default function Spinner({ text = "Cargando..." }: SpinnerProps) {
  return (
    <Wrapper>
      <ActivityIndicator size="large" color="#19a64a" />
      <LoadingText>{text}</LoadingText>
    </Wrapper>
  );
}
