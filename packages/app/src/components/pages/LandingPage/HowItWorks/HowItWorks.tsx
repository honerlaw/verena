import React from "react";
import { YStack, Text } from "tamagui";
import { useScreenSize } from "@/src/hooks/useScreenSize";
import { ArrowRight, Link2, MessageCircle } from "@tamagui/lucide-icons";
import { StepCard } from "./StepCard";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      stepNumber: 1,
      icon: <Link2 color="white" />,
      title: "Connect",
      description: "Securely link your bank, card, and investment accounts.",
    },
    {
      stepNumber: 2,
      icon: <MessageCircle color="white" />,
      title: "Ask",
      description:
        "Type a question or tap a suggestion—Verena analyzes your data.",
    },
    {
      stepNumber: 3,
      icon: <ArrowRight color="white" />,
      title: "Act",
      description: "Follow personalized recommendations with clear rationale.",
    },
  ];

  const { isDesktop } = useScreenSize();

  return (
    <YStack
      id="how-it-works"
      paddingVertical="$10"
      paddingHorizontal="$4"
      alignItems="center"
      justifyContent="center"
      minHeight={"100vh"}
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
        How It Works
      </Text>

      {/* Steps Container */}
      <YStack width="100%" maxWidth={1200} alignItems="stretch">
        {/* Mobile Layout - Stack vertically */}
        <YStack gap="$6" flexDirection={isDesktop ? "row" : "column"}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <StepCard
                stepNumber={step.stepNumber}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
              {/* Connection line for mobile */}
              {index < steps.length - 1 && (
                <YStack alignSelf="center">
                  <YStack
                    width={2}
                    height={40}
                    backgroundColor="$borderColor"
                  />
                </YStack>
              )}
            </React.Fragment>
          ))}
        </YStack>
      </YStack>
    </YStack>
  );
};
