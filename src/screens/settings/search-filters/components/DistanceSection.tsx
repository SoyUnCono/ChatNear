import React from "react";
import { Section } from "../../components/Section";
import { DistanceSlider } from "../../components/DistanceSlider";
import { ChatSettings } from "../../../../services/chat/settings";

interface DistanceSectionProps {
  value: number;
  onValueChange: (value: number) => void;
}

export const DistanceSection: React.FC<DistanceSectionProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Section
      title="DISTANCIA"
      description="Define el rango máximo de distancia para encontrar nuevos chats"
    >
      <DistanceSlider value={value} onValueChange={onValueChange} />
    </Section>
  );
};
