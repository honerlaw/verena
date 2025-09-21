import React from "react";
import { YStack, Text, Separator } from "tamagui";
import { useScreenSize } from "@/src/hooks/useScreenSize";
import { FooterContent } from "./FooterContent";

export const FooterSection: React.FC = () => {
  const { isDesktop } = useScreenSize();

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
