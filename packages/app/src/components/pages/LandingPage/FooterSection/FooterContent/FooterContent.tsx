import React from "react";
import { useRouter } from "expo-router";
import { Linking } from "react-native";
import { YStack, XStack, Text, H4 } from "tamagui";
import { useScreenSize } from "@/src/hooks/useScreenSize";

export const FooterContent: React.FC = () => {
  const router = useRouter();
  const { isDesktop } = useScreenSize();

  return (
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
            onPress={() => router.push("/terms")}
            pressStyle={{ color: "$color12" }}
            cursor="pointer"
          >
            Terms
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
};
