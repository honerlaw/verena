import React from "react";
import { XStack, YStack, Text, Button } from "tamagui";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

export const Navigation: React.FC = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/signin");
  };

  const handleGetStarted = () => {
    router.push("/signup");
  };

  // For web only - navigation links
  const navigationItems = [
    { label: "Features", href: "#features" },
    { label: "Security", href: "#security" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const handleScrollToSection = (href: string) => {
    if (Platform.OS === "web") {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <XStack
      backgroundColor="$background"
      paddingHorizontal="$4"
      paddingVertical="$3"
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
    >
      {/* Logo/Brand */}
      <XStack alignItems="center" gap="$2">
        <YStack
          width={32}
          height={32}
          backgroundColor="$primary"
          borderRadius="$2"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="white" fontSize="$6" fontWeight="bold">
            V
          </Text>
        </YStack>
        <Text fontSize="$6" fontWeight="bold" color="$color">
          Verena
        </Text>
      </XStack>

      {/* Navigation Links - Web only */}
      {Platform.OS === "web" && (
        <XStack gap="$6" alignItems="center">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant="outlined"
              size="$3"
              backgroundColor="transparent"
              borderWidth={0}
              color="$color"
              onPress={() => handleScrollToSection(item.href)}
              hoverStyle={{
                backgroundColor: "$background075",
              }}
            >
              {item.label}
            </Button>
          ))}
        </XStack>
      )}

      {/* Action Buttons */}
      <XStack gap="$3" alignItems="center">
        <Button
          variant="outlined"
          size="$3"
          onPress={handleSignIn}
          borderColor="$borderColor"
          color="$color"
          backgroundColor="transparent"
          hoverStyle={{
            backgroundColor: "$background075",
          }}
        >
          Sign in
        </Button>
        <Button
          size="$3"
          backgroundColor="$primary"
          color="white"
          onPress={handleGetStarted}
          hoverStyle={{
            backgroundColor: "$primary2",
          }}
        >
          Get started
        </Button>
      </XStack>
    </XStack>
  );
};
