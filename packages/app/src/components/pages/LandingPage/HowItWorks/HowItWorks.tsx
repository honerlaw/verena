import React from "react";
import { YStack, XStack, Text, Circle } from "tamagui";
import { Platform } from "react-native";

interface StepCardProps {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({
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

// Custom Icons using Tamagui components
const ConnectIcon: React.FC = () => (
  <YStack width={28} height={28} alignItems="center" justifyContent="center">
    {/* Chain link icon */}
    <YStack position="relative">
      {/* First link */}
      <YStack
        width={12}
        height={12}
        borderWidth={3}
        borderColor="white"
        borderRadius={6}
        position="absolute"
        top={0}
        left={2}
        rotation={-45}
      />
      {/* Second link */}
      <YStack
        width={12}
        height={12}
        borderWidth={3}
        borderColor="white"
        borderRadius={6}
        position="absolute"
        top={8}
        left={10}
        rotation={-45}
      />
    </YStack>
  </YStack>
);

const AskIcon: React.FC = () => (
  <YStack width={28} height={28} alignItems="center" justifyContent="center">
    {/* Chat bubble */}
    <YStack position="relative">
      {/* Main bubble */}
      <YStack
        width={22}
        height={16}
        backgroundColor="white"
        borderRadius={8}
        position="relative"
      />
      {/* Bubble tail */}
      <YStack
        width={6}
        height={6}
        backgroundColor="white"
        position="absolute"
        bottom={-2}
        left={6}
        borderRadius={3}
        transform={[{ rotate: "45deg" }]}
      />
      {/* Dots inside bubble */}
      <YStack position="absolute" top={4} left={5} flexDirection="row" gap="$1">
        <Circle size={3} backgroundColor="$primary" />
        <Circle size={3} backgroundColor="$primary" />
        <Circle size={3} backgroundColor="$primary" />
      </YStack>
    </YStack>
  </YStack>
);

const ActIcon: React.FC = () => (
  <YStack width={28} height={28} alignItems="center" justifyContent="center">
    {/* Target/bullseye icon */}
    <YStack position="relative" alignItems="center" justifyContent="center">
      {/* Outer ring */}
      <Circle
        size={24}
        borderWidth={3}
        borderColor="white"
        backgroundColor="transparent"
      />
      {/* Middle ring */}
      <Circle
        size={16}
        borderWidth={2}
        borderColor="white"
        backgroundColor="transparent"
        position="absolute"
      />
      {/* Center dot */}
      <Circle size={6} backgroundColor="white" position="absolute" />
    </YStack>
  </YStack>
);

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      stepNumber: 1,
      icon: <ConnectIcon />,
      title: "Connect",
      description: "Securely link your bank, card, and investment accounts.",
    },
    {
      stepNumber: 2,
      icon: <AskIcon />,
      title: "Ask",
      description:
        "Type a question or tap a suggestion—Verena analyzes your data.",
    },
    {
      stepNumber: 3,
      icon: <ActIcon />,
      title: "Act",
      description: "Follow personalized recommendations with clear rationale.",
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
        How It Works
      </Text>

      {/* Steps Container */}
      <YStack width="100%" maxWidth={1200} alignItems="stretch">
        {/* Mobile Layout - Stack vertically */}
        <YStack gap="$6" display={Platform.OS === "web" ? "none" : "flex"}>
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
                    opacity={0.3}
                  />
                </YStack>
              )}
            </React.Fragment>
          ))}
        </YStack>

        {/* Desktop Layout - Horizontal with connecting lines */}
        <YStack display="none">
          <XStack alignItems="center" justifyContent="center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <StepCard
                  stepNumber={step.stepNumber}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <YStack flex={0} paddingHorizontal="$4">
                    <YStack
                      height={2}
                      width={80}
                      backgroundColor="$borderColor"
                      opacity={0.3}
                    />
                  </YStack>
                )}
              </React.Fragment>
            ))}
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
};
