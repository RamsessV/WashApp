import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #f2f2f2;
`;

export const HeaderImage = styled.Image`
  width: 100%;
  height: 170px;
`;

export const Content = styled.View`
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 18px;
`;
