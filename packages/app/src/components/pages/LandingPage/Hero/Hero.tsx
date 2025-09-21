import React from "react";
import { YStack, XStack, Text, Button, H1 } from "tamagui";
import { useRouter } from "expo-router";
import { Eye, Shield } from "@tamagui/lucide-icons";
import { FeatureItem } from "./FeatureItem";
import { useScreenSize } from "@/src/hooks/useScreenSize";
import Icon from "@/assets/icon.svg";

const FEATURES = [
  {
    icon: <Shield />,
    title: "Bank-grade encryption",
  },
  {
    icon: <Eye />,
    title: "Read-only access",
  },
];

export const Hero: React.FC = () => {
  const router = useRouter();
  const { isDesktop } = useScreenSize();

  const handleConnectAccounts = () => {
    router.push("/signup");
  };

  return (
    <YStack
      flex={1}
      paddingHorizontal="$4"
      alignItems="center"
      justifyContent="center"
      backgroundColor="$background"
      minHeight={"100vh"}
    >
      <YStack width="100%" maxWidth={800} alignItems="center" gap="$8">
        <YStack alignItems="center" gap="$8" paddingHorizontal="$2">
          <XStack alignItems="center" gap="$2" marginTop={"$8"}>
            <Icon width={64} height={64} />
            <H1 fontSize={"$10"} fontWeight="bold" color="$color">
              Verena
            </H1>
          </XStack>

          <Text
            fontSize={"$10"}
            fontWeight="bold"
            color="$color"
            textAlign="center"
            letterSpacing={-0.5}
          >
            One place for your money - clear answers, confident decisions.
          </Text>

          <Text
            fontSize={"$6"}
            color="$color075"
            textAlign="center"
            lineHeight={"$4"}
            maxWidth={600}
          >
            Verena securely connects your accounts and uses AI to explain your
            finances, surface insights, and guide your next move.
          </Text>
        </YStack>

        <XStack
          gap="$4"
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
          flexDirection={isDesktop ? "row" : "column"}
        >
          <Button
            size="$5"
            backgroundColor="$primary"
            color="$color"
            onPress={handleConnectAccounts}
            paddingHorizontal="$6"
            fontWeight="600"
            hoverStyle={{
              backgroundColor: "$primary2",
            }}
            pressStyle={{
              backgroundColor: "$primary2",
            }}
          >
            <Text color="white">Create your account</Text>
          </Button>
        </XStack>

        <YStack
          gap="$6"
          alignItems="center"
          marginTop={"$12"}
          paddingTop={"$8"}
        >
          <YStack
            gap="$5"
            alignItems="center"
            flexDirection={isDesktop ? "row" : "column"}
          >
            {FEATURES.map((feature, index) => (
              <FeatureItem
                key={index}
                icon={feature.icon}
                title={feature.title}
              />
            ))}
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  );
};
