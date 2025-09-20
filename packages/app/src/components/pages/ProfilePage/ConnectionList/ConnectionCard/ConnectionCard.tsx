import React, { useState } from "react";
import { YStack, XStack, Text, Card, Separator } from "tamagui";
import type { AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs";
import { ConnectionDisconnectButton } from "../ConnectionDisconnectButton";

export type Item = Awaited<
  ReturnType<AppRouter["item"]["getAll"]>
>["items"][number];

export interface ConnectionCardProps {
  item: Item;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ item }) => {
  const [isAccountsExpanded, setIsAccountsExpanded] = useState(false);

  return (
    <Card
      padding="$4"
      backgroundColor="$background"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <YStack gap="$3">
        <XStack alignItems="center" justifyContent="space-between" gap="$4">
          <Text color="$gray8">🏦</Text>
          <YStack gap="$1" flex={1}>
            <Text fontSize="$5" fontWeight="600" color="$color">
              {item.institutionName ?? "An account"}
            </Text>
            <Text fontSize="$3" color="$gray11" textTransform="capitalize">
              {item.status.toLowerCase()}
            </Text>
          </YStack>
          <XStack alignItems="center" gap="$2">
            <ConnectionDisconnectButton item={item} />
          </XStack>
        </XStack>

        {item.accounts && item.accounts.length > 0 && (
          <>
            <Separator />
            <YStack gap="$2">
              <XStack
                alignItems="center"
                gap="$2"
                onPress={() => setIsAccountsExpanded(!isAccountsExpanded)}
                cursor="pointer"
                hoverStyle={{ opacity: 0.7 }}
                pressStyle={{ opacity: 0.5 }}
              >
                <Text fontSize="$2" color="$gray11">
                  {isAccountsExpanded ? "▼" : "▶"}
                </Text>
                <Text fontSize="$3" fontWeight="500" color="$gray11">
                  Accounts ({item.accounts?.length ?? 0})
                </Text>
              </XStack>
              {isAccountsExpanded && (
                <YStack gap="$1" paddingLeft="$4">
                  {item.accounts?.map((account) => (
                    <Text key={account.id} fontSize="$3" color="$color">
                      • {account.name}
                    </Text>
                  ))}
                </YStack>
              )}
            </YStack>
          </>
        )}
      </YStack>
    </Card>
  );
};
