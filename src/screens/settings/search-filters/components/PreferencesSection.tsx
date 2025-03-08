import React from "react";
import { Section } from "../../components/Section";
import { SwitchItem } from "../../components/SwitchItem";

interface PreferencesSectionProps {
  friendsOfFriendsOnly: boolean;
  minCommonInterests: number;
  onFriendsOfFriendsChange: (value: boolean) => void;
  onCommonInterestsChange: (value: number) => void;
}

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  friendsOfFriendsOnly,
  minCommonInterests,
  onFriendsOfFriendsChange,
  onCommonInterestsChange,
}) => {
  return (
    <Section
      title="PREFERENCIAS ADICIONALES"
      description="Otras opciones para personalizar tu búsqueda"
    >
      <SwitchItem
        title="Solo amigos de amigos"
        subtitle="Mostrar solo personas conectadas a través de amigos"
        value={friendsOfFriendsOnly}
        onValueChange={onFriendsOfFriendsChange}
        icon="people-circle-outline"
      />
      <SwitchItem
        title="Intereses en común"
        subtitle="Mostrar solo personas con al menos un interés en común"
        value={minCommonInterests > 0}
        onValueChange={(value) => onCommonInterestsChange(value ? 1 : 0)}
        icon="heart-outline"
      />
    </Section>
  );
};
