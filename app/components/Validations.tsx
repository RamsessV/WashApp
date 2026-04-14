import styled from "styled-components/native";

const Container = styled.View`
  margin-top: 8px;
  margin-left: 4px;
  gap: 4px;
`;

const RuleText = styled.Text<{ valid: boolean }>`
  color: ${(props) => (props.valid ? "#3aa55d" : "#ff4444")};
  font-size: 12px;
  font-weight: 500;
`;

type ValidationRule = {
  label: string;
  validate: (v: string) => boolean;
};

type ValidationRuleList = {
  value: string;
  rules: ValidationRule[];
};

export default function Validations({ value, rules }: ValidationRuleList) {
  return (
    <Container>
      {rules.map((rule, i) => {
        const valid = rule.validate(value);
        return (
          <RuleText key={i} valid={valid}>
            {valid ? "✓" : "✗"} {rule.label}
          </RuleText>
        );
      })}
    </Container>
  );
}
