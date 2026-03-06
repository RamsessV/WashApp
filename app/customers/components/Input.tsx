import React, { useEffect, useRef, useState } from "react";
import { Animated, TextInput } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  width: 300px;
  margin: 12px 0;
`;

const StyledInput = styled(TextInput)`
  border-radius: 14px;
  background-color: #eee;
  padding: 16px 14px;
  font-size: 16px;
`;

const Label = styled(Animated.Text)`
  position: absolute;
  left: 14px;
  color: #000;
`;

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

export default function Input({
  label,
  value,
  onChangeText,
  secureTextEntry,
}: Props) {
  const [focused, setFocused] = useState(false);
  const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: focused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  const labelStyle = {
    top: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
  };

  return (
    <Container>
      <Label style={labelStyle}>{label}</Label>

      <StyledInput
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Container>
  );
}
