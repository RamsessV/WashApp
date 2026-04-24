import { ActivityIndicator, ButtonProps, Text } from "react-native";
import { styled } from "styled-components/native";

const Btn = styled.TouchableOpacity`
  padding: 12px 30px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 8px;
`;

type Props = ButtonProps & {
  secondary?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  secondary,
  loading = false,
  disabled = false,
}: Props) {
  const isDisabled = disabled || loading;
  const backgroundColor = isDisabled
    ? "#ccc"
    : secondary
      ? "#b95a5a"
      : "#19a64a";

  const textColor = isDisabled ? "#666" : secondary ? "#333" : "#fff";

  return (
    <Btn
      onPress={!isDisabled ? onPress : undefined}
      style={{
        backgroundColor,
        opacity: isDisabled ? 0.6 : 1,
      }}
      disabled={isDisabled}
    >
      {loading && <ActivityIndicator color={textColor} size="small" />}
      <Text style={{ color: textColor, fontSize: 16, fontWeight: "600" }}>
        {title}
      </Text>
    </Btn>
  );
}
