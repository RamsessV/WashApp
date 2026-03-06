import { Text } from "react-native";
import { styled } from "styled-components/native";

const MainButton = styled.TouchableOpacity`
  background-color: #19a64a;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: 0.2s;
`;

const SecondaryButton = styled.TouchableOpacity`
    background: white;
    color: #19a64a;
    border: 2px solid #19a64a;
    padding: 10px 28px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;
`;

const ErrorButton = styled.TouchableOpacity`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: 0.2s;
`;

type Props = {
  type: "main" | "secondary" | "error";
  onPress: () => void;
  title: string;
};

export default function Button({ type, onPress, title }: Props) {
  let StyledButton;

  switch (type) {
    case "main":
      StyledButton = MainButton;
      break;
    case "secondary":
      StyledButton = SecondaryButton;
      break;
    case "error":
      StyledButton = ErrorButton;
      break;
  }

  return (
    <StyledButton onPress={onPress}>
      <Text>{title}</Text>
    </StyledButton>
  );
}
