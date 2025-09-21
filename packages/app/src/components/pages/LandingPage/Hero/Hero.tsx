import React from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title }) => {
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

// Icon components using simple SVG-like shapes with Tamagui
const ShieldIcon: React.FC = () => (
  <YStack width={20} height={24} alignItems="center" justifyContent="center">
    <YStack
      width={16}
      height={20}
      backgroundColor="$color075"
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
        backgroundColor="$background"
        borderRadius="$1"
      />
      <YStack
        position="absolute"
        top={10}
        left={4}
        width={6}
        height={2}
        backgroundColor="$background"
        borderRadius="$1"
      />
    </YStack>
  </YStack>
);

const EyeIcon: React.FC = () => (
  <YStack width={24} height={24} alignItems="center" justifyContent="center">
    <YStack
      width={20}
      height={14}
      backgroundColor="transparent"
      borderWidth={2}
      borderColor="$color075"
      borderRadius={10}
      alignItems="center"
      justifyContent="center"
    >
      <YStack
        width={8}
        height={8}
        backgroundColor="$color075"
        borderRadius={4}
      />
    </YStack>
  </YStack>
);

const LightningIcon: React.FC = () => (
  <YStack width={24} height={24} alignItems="center" justifyContent="center">
    <YStack position="relative" width={12} height={20}>
      <YStack
        position="absolute"
        top={0}
        left={0}
        width={0}
        height={0}
        borderLeftWidth={6}
        borderLeftColor="transparent"
        borderRightWidth={6}
        borderRightColor="$color075"
        borderBottomWidth={10}
        borderBottomColor="$color075"
      />
      <YStack
        position="absolute"
        top={8}
        right={0}
        width={0}
        height={0}
        borderLeftWidth={6}
        borderLeftColor="$color075"
        borderRightWidth={6}
        borderRightColor="transparent"
        borderTopWidth={10}
        borderTopColor="$color075"
      />
    </YStack>
  </YStack>
);

export const Hero: React.FC = () => {
  const router = useRouter();

  const handleConnectAccounts = () => {
    router.push("/signup");
  };

  const handleTryDemo = () => {
    // TODO: Implement demo functionality
    console.log("Try demo clicked");
  };

  const features = [
    {
      icon: <ShieldIcon />,
      title: "Bank-grade encryption",
    },
    {
      icon: <EyeIcon />,
      title: "Read-only access",
    },
    {
      icon: <LightningIcon />,
      title: "SOC 2-aligned practices",
    },
  ];

  return (
    <YStack
      flex={1}
      paddingVertical={Platform.OS === "web" ? "$16" : "$12"}
      paddingHorizontal="$4"
      alignItems="center"
      justifyContent="center"
      backgroundColor="$background"
      minHeight={Platform.OS === "web" ? 800 : 600}
    >
      <YStack width="100%" maxWidth={800} alignItems="center" gap="$8">
        {/* Main Headline */}
        <YStack alignItems="center" gap="$6" paddingHorizontal="$2">
          <Text
            fontSize={Platform.OS === "web" ? "$13" : "$11"}
            fontWeight="bold"
            color="$color"
            textAlign="center"
            lineHeight={Platform.OS === "web" ? "$1" : "$2"}
            letterSpacing={-0.5}
          >
            One place for your money—clear answers, confident decisions.
          </Text>

          {/* Subheading */}
          <Text
            fontSize={Platform.OS === "web" ? "$7" : "$6"}
            color="$color075"
            textAlign="center"
            lineHeight={Platform.OS === "web" ? "$3" : "$4"}
            maxWidth={600}
          >
            Verena securely connects your accounts and uses AI to explain your
            finances, surface insights, and guide your next move.
          </Text>
        </YStack>

        {/* Action Buttons */}
        <XStack
          gap="$4"
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
          flexDirection={Platform.OS === "web" ? "row" : "column"}
          width={Platform.OS === "web" ? "auto" : "100%"}
        >
          <Button
            size="$5"
            backgroundColor="$primary"
            color="white"
            onPress={handleConnectAccounts}
            paddingHorizontal="$6"
            fontWeight="600"
            width={Platform.OS === "web" ? "auto" : "100%"}
            maxWidth={Platform.OS === "web" ? "auto" : 300}
            hoverStyle={{
              backgroundColor: "$primary2",
            }}
            pressStyle={{
              backgroundColor: "$primary2",
            }}
          >
            Connect your accounts
          </Button>

          <Button
            size="$5"
            variant="outlined"
            onPress={handleTryDemo}
            borderColor="$borderColor"
            color="$color"
            backgroundColor="transparent"
            paddingHorizontal="$6"
            fontWeight="600"
            width={Platform.OS === "web" ? "auto" : "100%"}
            maxWidth={Platform.OS === "web" ? "auto" : 300}
            hoverStyle={{
              backgroundColor: "$background075",
              borderColor: "$primary",
            }}
            pressStyle={{
              backgroundColor: "$background075",
            }}
          >
            Try a live demo
          </Button>
        </XStack>

        {/* Feature Points */}
        <YStack
          gap="$6"
          alignItems="center"
          marginTop={Platform.OS === "web" ? "$12" : "$8"}
          paddingTop={Platform.OS === "web" ? "$8" : "$6"}
        >
          {/* Mobile Layout - Stack vertically */}
          <YStack
            gap="$5"
            alignItems="center"
            display={Platform.OS === "web" ? "none" : "flex"}
          >
            {features.map((feature, index) => (
              <FeatureItem
                key={index}
                icon={feature.icon}
                title={feature.title}
              />
            ))}
          </YStack>

          {/* Desktop Layout - Horizontal */}
          <XStack
            gap={Platform.OS === "web" ? "$12" : "$8"}
            alignItems="center"
            justifyContent="center"
            display={Platform.OS === "web" ? "flex" : "none"}
          >
            {features.map((feature, index) => (
              <FeatureItem
                key={index}
                icon={feature.icon}
                title={feature.title}
              />
            ))}
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
};
