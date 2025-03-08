import React from "react";
import { Section } from "../../components/Section";
import { AgeRangeSelector } from "../../components/AgeRangeSelector";

interface AgeSectionProps {
  value: { min: number; max: number };
  onValueChange: (value: { min: number; max: number }) => void;
}

export const AgeSection: React.FC<AgeSectionProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Section
      title="EDAD"
      description="Establece el rango de edad de las personas que quieres conocer"
    >
      <AgeRangeSelector value={value} onValueChange={onValueChange} />
    </Section>
  );
};
