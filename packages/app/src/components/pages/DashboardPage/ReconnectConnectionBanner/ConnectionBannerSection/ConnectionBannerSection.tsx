import React from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { AlertTriangle, X } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import type { AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs";
import { useDismissed } from "@/src/hooks/useDismissed";

type Connection =
  AppRouter["connection"]["getAll"]["_def"]["$types"]["output"]["connections"][number];

const DISMISSED_CONNECTIONS_KEY = "reconnect_banner_dismissed_connections";

type ConnectionBannerSectionProps = {
  connection: Connection;
};

export const ConnectionBannerSection: React.FC<
  ConnectionBannerSectionProps
> = ({ connection }) => {
  const router = useRouter();
  const { isDismissed, dismiss } = useDismissed({
    storageKey: DISMISSED_CONNECTIONS_KEY,
    id: connection.id,
  });

  const handleReconnect = () => {
    router.push("/connector");
  };

  if (isDismissed) {
    return null;
  }

  return (
    <YStack
      backgroundColor="$red1"
      borderWidth={1}
      borderColor="$red5"
      borderRadius="$3"
      padding="$3"
      marginHorizontal={"$3"}
      marginVertical={"$1"}
      gap="$2"
      onPress={handleReconnect}
      hoverStyle={{ backgroundColor: "$red2" }}
      pressStyle={{ backgroundColor: "$red3" }}
      cursor="pointer"
    >
      <XStack alignItems="center" gap="$4">
        <AlertTriangle size={16} color="$red9" />
        <YStack flex={1} gap="$1">
          <Text fontSize="$3" fontWeight="600" color="$red11">
            {connection.institution.name} needs reconnection
          </Text>
          <Text fontSize="$2" color="$red10">
            Your connection has expired and needs to be reauthorized.
          </Text>
        </YStack>
        <Button
          size="$1"
          circular
          chromeless
          onPress={(e) => {
            // Prevent parent press handler from firing when dismissing
            // Works on web and native where supported

            (e as any)?.stopPropagation?.();
            dismiss();
          }}
          hoverStyle={{ backgroundColor: "$red3" }}
          pressStyle={{ backgroundColor: "$red4" }}
          icon={<X size={14} />}
        />
      </XStack>
    </YStack>
  );
};
