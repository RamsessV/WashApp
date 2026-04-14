import React, { useEffect, useRef, useState } from "react";
import { Animated, TextInput, TextInputProps } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  width: 100%;
  margin: 12px 0;
  position: relative;
  gap: 4px;
`;

const StyledInput = styled(TextInput)<{ hasError?: boolean }>`
  border-radius: 14px;
  background-color: #eee;
  padding: 22px 14px 10px 14px;
  font-size: 16px;
  border-width: ${(props) => (props.hasError ? "2px" : "0px")};
  border-color: ${(props) => (props.hasError ? "#ff4444" : "transparent")};
`;

const Label = styled(Animated.Text)<{ hasError?: boolean }>`
  position: absolute;
  left: 14px;
  top: 8px;
  color: ${(props) => (props.hasError ? "#ff4444" : "#666")};
  font-size: 12px;
  z-index: 1;
`;

const ErrorText = styled.Text`
  color: #ff4444;
  font-size: 11px;
  margin-top: 2px;
  margin-left: 4px;
`;

type Props = TextInputProps & {
  label: string;
  error?: boolean;
  errorMessage?: string;
};

export default function Input({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  error = false,
  errorMessage = "",
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
      <Label style={labelStyle} hasError={error}>
        {label}
      </Label>

      <StyledInput
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType={keyboardType}
        hasError={error}
      />
      {error && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
}
