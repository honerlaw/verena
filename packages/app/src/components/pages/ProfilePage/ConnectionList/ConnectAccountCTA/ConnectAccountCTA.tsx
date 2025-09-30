import React from "react";
import { YStack, Text, Button, Card } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { useLinkToPlaid } from "@/src/components/LinkToPlaid";

export const ConnectAccountCTA: React.FC = () => {
  const { openLink } = useLinkToPlaid();

  const handleConnect = () => {
    openLink();
  };

  return (
    <Card
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="transparent"
      borderStyle="dashed"
      padding="$6"
      borderRadius="$4"
    >
      <YStack gap="$4" alignItems="center">
        <YStack gap="$4" alignItems="center">
          <Text fontSize="$5" fontWeight="600" color="$color">
            Connect Your First Account
          </Text>
          <Text fontSize="$3" color="$gray11" textAlign="center" maxWidth={280}>
            Link your bank account to start tracking your finances and get
            personalized insights.
          </Text>
        </YStack>

        <Button
          size="$4"
          icon={<Plus size={20} color="white" />}
          backgroundColor="$primary"
          onPress={handleConnect}
          pressStyle={{ backgroundColor: "$primary", opacity: 0.8 }}
          hoverStyle={{ backgroundColor: "$primary", opacity: 0.8 }}
        >
          <Text color="white" fontWeight={"600"}>
            Connect Account
          </Text>
        </Button>
      </YStack>
    </Card>
  );
};
