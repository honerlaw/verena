import React from "react";
import { YStack, XStack, Text } from "tamagui";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title }) => {
  return (
    <XStack gap="$3" alignItems="center" justifyContent="center">
      <YStack
        width={24}
        height={24}
        alignItems="center"
        justifyContent="center"
        opacity={0.7}
      >
        {icon}
      </YStack>
      <Text fontSize="$4" color="$color075" textAlign="center" fontWeight="500">
        {title}
      </Text>
    </XStack>
  );
};
