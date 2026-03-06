import styled from "styled-components/native";
import { useState } from "react";
import { Alert } from "react-native";

import Input from "../components/Input";
import Button from "../components/Button";

const Container = styled.View`
  flex: 1;
  background-color: #f2f2f2;
`;

const HeaderImage = styled.Image`
  width: 100%;
  height: 220px;
`;

const Content = styled.View`
  padding: 30px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  margin-top: 20px;
  justify-content: space-between;
`;

const onPress = () => {
    Alert.alert("Login", "Funcionalidad de login no implementada");
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container>
      <HeaderImage
        source={{
          uri: "https://lavayseca.com.mx/wp-content/uploads/2022/07/Copia-de-239446396_2971717819738680_931562711350655753_n.jpg",
        }}
        resizeMode="cover"
      />

      <Content>
        <Title>WashApp</Title>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <ButtonRow>
          <Button type="main" title="Login"  onPress={onPress}/>
          <Button type="secondary" title="Crea una cuenta" onPress={onPress}/>
        </ButtonRow>
      </Content>
    </Container>
  );
}