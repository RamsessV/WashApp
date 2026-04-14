import { Text } from "react-native";
import styled from "styled-components/native";

interface LaundryCardProps {
  name: string;
  location: string;
  phone: string;
  rating: number;
}

const Card = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 14px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.06);
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.08;
  shadow-radius: 18px;
  elevation: 4;
`;

const AccentBar = styled.View`
  width: 44px;
  height: 4px;
  border-radius: 999px;
  background-color: #19a64a;
  margin-bottom: 12px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const TitleBlock = styled.View`
  flex: 1;
`;

const Name = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #1f1f1f;
`;

const Subtitle = styled.Text`
  margin-top: 4px;
  font-size: 13px;
  color: #6b6b6b;
`;

const RatingPill = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  background-color: rgba(25, 166, 74, 0.12);
`;

const RatingText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #19a64a;
`;

const Details = styled.View`
  gap: 10px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
`;

const DetailLabel = styled.Text`
  min-width: 74px;
  font-size: 12px;
  font-weight: 700;
  color: #8a8a8a;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const DetailValue = styled.Text`
  flex: 1;
  font-size: 14px;
  color: #2f2f2f;
  line-height: 20px;
`;

export default function LaundryCard({
  name,
  location,
  phone,
  rating,
}: LaundryCardProps) {
  return (
    <Card>
      <AccentBar />

      <Header>
        <TitleBlock>
          <Name numberOfLines={1}>{name}</Name>
          <Subtitle numberOfLines={1}>Laundry service</Subtitle>
        </TitleBlock>

        <RatingPill>
          <Text style={{ color: "#19a64a", fontSize: 12 }}>★</Text>
          <RatingText>{rating.toFixed(1)}</RatingText>
        </RatingPill>
      </Header>

      <Details>
        <DetailRow>
          <DetailLabel>Address</DetailLabel>
          <DetailValue>{location}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Phone</DetailLabel>
          <DetailValue>{phone}</DetailValue>
        </DetailRow>
      </Details>
    </Card>
  );
}
