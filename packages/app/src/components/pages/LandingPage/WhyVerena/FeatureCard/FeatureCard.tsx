import React from "react";
import { YStack, Text, Card } from "tamagui";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Card
      flex={1}
      padding="$6"
      backgroundColor="$background"
      borderColor="$borderColor"
      borderWidth={1}
      borderRadius="$4"
      alignItems="center"
      minHeight={280}
      hoverStyle={{
        borderColor: "$primary",
        backgroundColor: "$background075",
        ...{
          transform: "translateY(-2px)",
          shadowColor: "$shadowColor",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      }}
      animation="quick"
    >
      <YStack gap="$4" alignItems="center" flex={1} justifyContent="center">
        {/* Icon Container */}
        <YStack
          width={64}
          height={64}
          backgroundColor="$primary"
          borderRadius="$4"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <YStack
            position="absolute"
            width={64}
            height={64}
            alignItems="center"
            justifyContent="center"
          >
            {icon}
          </YStack>
        </YStack>

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
        >
          {description}
        </Text>
      </YStack>
    </Card>
  );
};
