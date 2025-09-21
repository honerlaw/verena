import React from "react";
import { useRouter } from "expo-router";
import { Linking } from "react-native";
import { YStack, XStack, Text, H4, Separator } from "tamagui";
import { useScreenSize } from "@/src/hooks/useScreenSize";

export const FooterSection: React.FC = () => {
  const router = useRouter();
  const { isDesktop } = useScreenSize();

  const FooterContent = () => (
    <XStack
      justifyContent="space-between"
      alignItems={isDesktop ? "flex-start" : undefined}
      width="100%"
      flexDirection={!isDesktop ? "column" : "row"}
      gap={!isDesktop ? "$6" : "$8"}
    >
      {/* Brand Section */}
      <YStack
        alignItems={!isDesktop ? "center" : "flex-start"}
        gap="$2"
        flex={!isDesktop ? 0 : 1}
      >
        <H4 size="$6" fontWeight="700" color="$color12">
          Verena
        </H4>
        <Text
          fontSize="$3"
          color="$color10"
          textAlign={!isDesktop ? "center" : "left"}
          maxWidth={300}
          lineHeight="$4"
        >
          Your AI-powered personal finance assistant. Secure, intelligent, and
          always by your side. insights.
        </Text>
      </YStack>

      {/* Legal Section */}
      <YStack
        alignItems={!isDesktop ? "center" : "flex-start"}
        gap="$3"
        width={isDesktop ? "auto" : "100%"}
        paddingRight={isDesktop ? "$4" : "$0"}
      >
        <Text fontSize="$4" fontWeight="600" color="$color12">
          Legal
        </Text>
        <YStack gap="$2" alignItems={!isDesktop ? "center" : "flex-start"}>
          <Text
            fontSize="$3"
            color="$color10"
            onPress={() => router.push("/privacy")}
            pressStyle={{ color: "$color12" }}
            cursor="pointer"
          >
            Privacy
          </Text>
          <Text
            fontSize="$3"
            color="$color10"
            onPress={() => Linking.openURL("mailto:support@jurnara.com")}
            pressStyle={{ color: "$color12" }}
            cursor="pointer"
          >
            Support
          </Text>
        </YStack>
      </YStack>
    </XStack>
  );

  return (
    <YStack
      paddingHorizontal={isDesktop ? "$8" : "$4"}
      paddingVertical={isDesktop ? "$12" : "$8"}
      backgroundColor="$background"
      borderTopWidth={1}
      borderTopColor="$gray4"
      width="100%"
      alignItems="center"
    >
      <YStack
        maxWidth={1200}
        width="100%"
        gap="$6"
        alignItems={!isDesktop ? "center" : "stretch"}
      >
        <FooterContent />

        <Separator borderColor="$gray4" />

        {/* Copyright */}
        <Text fontSize="$2" color="$color9" textAlign="center" paddingTop="$2">
          © 2025 Verena. All rights reserved.
        </Text>
      </YStack>
    </YStack>
  );
};
