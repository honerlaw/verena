import React from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

export const Footer: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path as any);
  };

  const handleScrollToSection = (href: string) => {
    if (Platform.OS === "web") {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExternalLink = (url: string) => {
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    }
  };

  const productLinks = [
    { label: "Features", action: () => handleScrollToSection("#features") },
    { label: "Security", action: () => handleScrollToSection("#security") },
    { label: "Pricing", action: () => handleScrollToSection("#pricing") },
    {
      label: "How it works",
      action: () => handleScrollToSection("#how-it-works"),
    },
  ];

  const companyLinks = [
    { label: "About", action: () => handleExternalLink("#") },
    { label: "Blog", action: () => handleExternalLink("#") },
    { label: "Careers", action: () => handleExternalLink("#") },
    { label: "Contact", action: () => handleExternalLink("#") },
  ];

  const legalLinks = [
    { label: "Privacy Policy", action: () => handleExternalLink("#") },
    { label: "Terms of Service", action: () => handleExternalLink("#") },
    { label: "Cookie Policy", action: () => handleExternalLink("#") },
  ];

  const supportLinks = [
    { label: "Help Center", action: () => handleExternalLink("#") },
    { label: "Support", action: () => handleExternalLink("#") },
    { label: "Status", action: () => handleExternalLink("#") },
  ];

  return (
    <YStack
      backgroundColor="$background"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      paddingHorizontal="$4"
      paddingVertical="$8"
      marginTop="$8"
    >
      {/* Main Footer Content */}
      <YStack maxWidth={1200} alignSelf="center" width="100%">
        {/* Top Section */}
        <XStack
          flexDirection={Platform.OS === "web" ? "row" : "column"}
          gap="$8"
          marginBottom="$8"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          {/* Brand Section */}
          <YStack flex={1} minWidth={250} gap="$4">
            {/* Logo */}
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

            <Text color="$color075" fontSize="$4" lineHeight="$2">
              Your AI-powered personal finance assistant. Secure, intelligent,
              and always by your side.
            </Text>

            {/* CTA Buttons */}
            <XStack gap="$3" marginTop="$2">
              <Button
                size="$3"
                backgroundColor="$primary"
                color="white"
                onPress={() => handleNavigation("/signup")}
                hoverStyle={{
                  backgroundColor: "$primary2",
                }}
              >
                Get started
              </Button>
              <Button
                variant="outlined"
                size="$3"
                borderColor="$borderColor"
                color="$color"
                backgroundColor="transparent"
                onPress={() => handleNavigation("/signin")}
                hoverStyle={{
                  backgroundColor: "$background075",
                }}
              >
                Sign in
              </Button>
            </XStack>
          </YStack>

          {/* Links Sections */}
          <XStack
            gap="$6"
            flexDirection={Platform.OS === "web" ? "row" : "column"}
            flex={2}
            justifyContent="space-around"
          >
            {/* Product */}
            <YStack gap="$3" minWidth={120}>
              <Text
                fontSize="$5"
                fontWeight="600"
                color="$color"
                marginBottom="$2"
              >
                Product
              </Text>
              {productLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="outlined"
                  size="$2"
                  backgroundColor="transparent"
                  borderWidth={0}
                  color="$color075"
                  fontSize="$3"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  paddingHorizontal={0}
                  onPress={link.action}
                >
                  {link.label}
                </Button>
              ))}
            </YStack>

            {/* Company */}
            <YStack gap="$3" minWidth={120}>
              <Text
                fontSize="$5"
                fontWeight="600"
                color="$color"
                marginBottom="$2"
              >
                Company
              </Text>
              {companyLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="outlined"
                  size="$2"
                  backgroundColor="transparent"
                  borderWidth={0}
                  color="$color075"
                  fontSize="$3"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  paddingHorizontal={0}
                  onPress={link.action}
                >
                  {link.label}
                </Button>
              ))}
            </YStack>

            {/* Support */}
            <YStack gap="$3" minWidth={120}>
              <Text
                fontSize="$5"
                fontWeight="600"
                color="$color"
                marginBottom="$2"
              >
                Support
              </Text>
              {supportLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="outlined"
                  size="$2"
                  backgroundColor="transparent"
                  borderWidth={0}
                  color="$color075"
                  fontSize="$3"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  paddingHorizontal={0}
                  onPress={link.action}
                >
                  {link.label}
                </Button>
              ))}
            </YStack>

            {/* Legal */}
            <YStack gap="$3" minWidth={120}>
              <Text
                fontSize="$5"
                fontWeight="600"
                color="$color"
                marginBottom="$2"
              >
                Legal
              </Text>
              {legalLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="outlined"
                  size="$2"
                  backgroundColor="transparent"
                  borderWidth={0}
                  color="$color075"
                  fontSize="$3"
                  fontWeight="normal"
                  justifyContent="flex-start"
                  paddingHorizontal={0}
                  onPress={link.action}
                >
                  {link.label}
                </Button>
              ))}
            </YStack>
          </XStack>
        </XStack>

        {/* Security Badge */}
        <XStack
          paddingVertical="$4"
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor="$borderColor"
          alignItems="center"
          justifyContent="center"
          gap="$2"
        >
          <YStack
            width={20}
            height={24}
            alignItems="center"
            justifyContent="center"
          >
            <YStack
              width={16}
              height={20}
              backgroundColor="$primary"
              borderRadius="$2"
              borderTopLeftRadius="$4"
              borderTopRightRadius="$4"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontSize="$1" fontWeight="bold">
                ✓
              </Text>
            </YStack>
          </YStack>
          <Text fontSize="$3" color="$color075" textAlign="center">
            Bank-level security • End-to-end encryption • SOC 2 compliant
          </Text>
        </XStack>

        {/* Bottom Section */}
        <XStack
          marginTop="$6"
          paddingTop="$4"
          flexDirection={Platform.OS === "web" ? "row" : "column"}
          alignItems="center"
          justifyContent="space-between"
          gap="$4"
        >
          <Text fontSize="$3" color="$color05" textAlign="center">
            © 2025 Verena. All rights reserved.
          </Text>

          <XStack gap="$4" alignItems="center">
            <Text fontSize="$3" color="$color05">
              Made with ❤️ for your financial wellbeing
            </Text>
          </XStack>
        </XStack>
      </YStack>
    </YStack>
  );
};
