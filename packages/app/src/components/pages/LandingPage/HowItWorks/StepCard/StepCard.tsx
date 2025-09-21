import React from "react";
import { YStack, Text, Circle } from "tamagui";

interface StepCardProps {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  icon,
  title,
  description,
}) => {
  return (
    <YStack flex={1} alignItems="center" gap="$4" padding="$6">
      {/* Step Number Badge */}
      <Circle
        size={64}
        backgroundColor="$primary"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {/* Icon */}
        <YStack position="absolute" alignItems="center" justifyContent="center">
          {icon}
        </YStack>

        {/* Step Number */}
        <Text
          position="absolute"
          top={-8}
          right={-8}
          fontSize="$2"
          fontWeight="bold"
          color="$color"
          backgroundColor="$background"
          borderRadius={12}
          paddingHorizontal="$2"
          paddingVertical="$1"
          minWidth={24}
          textAlign="center"
          borderWidth={2}
          borderColor="$primary"
        >
          {stepNumber}
        </Text>
      </Circle>

      {/* Title */}
      <Text fontSize="$7" fontWeight="bold" color="$color" textAlign="center">
        {title}
      </Text>

      {/* Description */}
      <Text
        fontSize="$4"
        color="$color075"
        textAlign="center"
        lineHeight="$2"
        maxWidth={280}
      >
        {description}
      </Text>
    </YStack>
  );
};
