import React from "react";
import { Section } from "../../components/Section";
import { GenderSelector } from "../../components/GenderSelector";
import { ChatSettings } from "../../../../services/chat/settings";

interface GenderSectionProps {
  value: ChatSettings["gender_filter"];
  onValueChange: (value: ChatSettings["gender_filter"]) => void;
}

export const GenderSection: React.FC<GenderSectionProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Section
      title="GÉNERO"
      description="Selecciona las preferencias de género para tus chats"
    >
      <GenderSelector value={value} onValueChange={onValueChange} />
    </Section>
  );
};
