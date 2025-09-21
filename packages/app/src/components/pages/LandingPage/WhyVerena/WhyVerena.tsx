import React from "react";
import { YStack, XStack, Text, Card } from "tamagui";
import { Platform } from "react-native";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
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
        ...(Platform.OS === "web" && {
          transform: "translateY(-2px)",
          shadowColor: "$shadowColor",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }),
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
          opacity={0.1}
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

// Icon components using simple SVG-like shapes with Tamagui
const ChartIcon: React.FC = () => (
  <YStack width={24} height={24} alignItems="center" justifyContent="center">
    <YStack gap="$1" alignItems="flex-end" flexDirection="row">
      <YStack
        width={4}
        height={8}
        backgroundColor="$primary"
        borderRadius="$1"
      />
      <YStack
        width={4}
        height={12}
        backgroundColor="$primary"
        borderRadius="$1"
      />
      <YStack
        width={4}
        height={16}
        backgroundColor="$primary"
        borderRadius="$1"
      />
      <YStack
        width={4}
        height={10}
        backgroundColor="$primary"
        borderRadius="$1"
      />
    </YStack>
  </YStack>
);

const LightbulbIcon: React.FC = () => (
  <YStack width={24} height={24} alignItems="center" justifyContent="center">
    <YStack
      width={16}
      height={16}
      backgroundColor="$primary"
      borderRadius={8}
      position="relative"
    >
      <YStack
        position="absolute"
        top={18}
        left={6}
        width={4}
        height={2}
        backgroundColor="$primary"
        borderRadius="$1"
      />
    </YStack>
  </YStack>
);

const ShieldIcon: React.FC = () => (
  <YStack width={24} height={24} alignItems="center" justifyContent="center">
    <YStack
      width={16}
      height={20}
      backgroundColor="$primary"
      borderRadius="$2"
      borderTopLeftRadius="$4"
      borderTopRightRadius="$4"
      position="relative"
    >
      <YStack
        position="absolute"
        top={6}
        left={4}
        width={8}
        height={2}
        backgroundColor="white"
        borderRadius="$1"
      />
      <YStack
        position="absolute"
        top={10}
        left={4}
        width={6}
        height={2}
        backgroundColor="white"
        borderRadius="$1"
      />
    </YStack>
  </YStack>
);

export const WhyVerena: React.FC = () => {
  const features = [
    {
      icon: <ChartIcon />,
      title: "Unified view",
      description: "All accounts, one timeline and dashboard.",
    },
    {
      icon: <LightbulbIcon />,
      title: "Actionable insights",
      description: "Plain-English answers and next steps.",
    },
    {
      icon: <ShieldIcon />,
      title: "Private & secure",
      description: "Encrypted data, read-only connections.",
    },
  ];

  return (
    <YStack
      paddingVertical="$10"
      paddingHorizontal="$4"
      alignItems="center"
      backgroundColor="$background"
    >
      {/* Section Title */}
      <Text
        fontSize="$10"
        fontWeight="bold"
        color="$color"
        textAlign="center"
        marginBottom="$8"
      >
        Why Verena
      </Text>

      {/* Feature Cards Container */}
      <YStack width="100%" maxWidth={1200} alignItems="stretch">
        {/* Mobile Layout - Stack vertically */}
        <YStack gap="$4" display={Platform.OS === "web" ? "none" : "flex"}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </YStack>

        {/* Desktop Layout - Horizontal */}
        <XStack gap="$6" alignItems="stretch" display="none">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
};
