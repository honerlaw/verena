import React from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { TrendingUp, X } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useDismissed } from "@/src/hooks/useDismissed";

const BANNER_DISMISSED_KEY = "connect_account_banner_dismissed";
const DISMISS_DURATION_HOURS = 12;

export const ConnectAccountBanner: React.FC = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const { isReady, isDismissed, dismiss } = useDismissed({
    storageKey: BANNER_DISMISSED_KEY,
    id: "global",
    durationMs: DISMISS_DURATION_HOURS * 60 * 60 * 1000,
  });

  const { data: connectionsData, isLoading } = useQuery(
    trpc.connection.getAll.queryOptions(),
  );

  if (
    isLoading ||
    !isReady ||
    isDismissed ||
    (connectionsData?.connections && connectionsData.connections.length > 0)
  ) {
    return null;
  }

  const handleConnectAccount = () => {
    router.push("/connector");
  };

  const handleDismiss = () => {
    dismiss();
  };

  return (
    <YStack
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$4"
      padding="$4"
      marginVertical={"$1"}
      marginHorizontal={"$3"}
      gap="$3"
    >
      <XStack alignItems="center" gap="$2">
        <TrendingUp size={20} />
        <Text fontSize="$5" fontWeight="600" flex={1}>
          Get Better Financial Insights
        </Text>
        <Button
          size="$1"
          circular
          chromeless
          onPress={handleDismiss}
          hoverStyle={{ backgroundColor: "$gray5" }}
          pressStyle={{ backgroundColor: "$gray6" }}
          icon={<X size={16} />}
        />
      </XStack>

      <Text fontSize="$3" lineHeight={20}>
        Connect your accounts to receive personalized insights, track your
        spending, and get AI-powered financial advice tailored to your
        situation.
      </Text>

      <Button
        size="$2"
        borderRadius="$3"
        fontWeight="600"
        onPress={handleConnectAccount}
        alignSelf="flex-start"
        hoverStyle={{ opacity: 0.9 }}
        pressStyle={{ opacity: 0.8 }}
      >
        Connect your accounts
      </Button>
    </YStack>
  );
};
