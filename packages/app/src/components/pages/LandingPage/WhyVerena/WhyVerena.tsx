import React from "react";
import { YStack, Text } from "tamagui";
import { useScreenSize } from "../../../../hooks/useScreenSize";
import { AreaChart, Lightbulb, Shield } from "@tamagui/lucide-icons";
import { FeatureCard } from "./FeatureCard";

const FEATURES = [
  {
    icon: <AreaChart color="white" />,
    title: "One assistant",
    description: "All accounts, one financial assistant.",
  },
  {
    icon: <Lightbulb color="white" />,
    title: "Actionable insights",
    description: "Plain-English answers and next steps.",
  },
  {
    icon: <Shield color="white" />,
    title: "Private & secure",
    description: "Encrypted data, read-only connections.",
  },
];

export const WhyVerena: React.FC = () => {
  const { isDesktop } = useScreenSize();

  return (
    <YStack
      id="why-verena"
      paddingVertical="$10"
      paddingHorizontal="$4"
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
      minHeight={"100vh"}
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

      <YStack width="100%" maxWidth={1200} alignItems="stretch">
        <YStack gap="$4" flexDirection={isDesktop ? "row" : "column"}>
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </YStack>
      </YStack>
    </YStack>
  );
};
