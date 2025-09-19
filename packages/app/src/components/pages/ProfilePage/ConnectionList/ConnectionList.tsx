import React from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { useQuery } from "@tanstack/react-query";
import { useLinkToPlaid } from "@/src/components/LinkToPlaid";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { LoadingView } from "@/src/components/LoadingView";
import { ErrorView } from "@/src/components/ErrorView";
import { ConnectionCard } from "./ConnectionCard";

export const ConnectionList: React.FC = () => {
  const { openLink } = useLinkToPlaid();
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(trpc.item.getAll.queryOptions());

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return (
      <ErrorView
        small
        error={error}
        message="Failed to fetch connected accounts."
      />
    );
  }

  const handleAddConnection = () => {
    openLink();
  };

  const connectionCount = data?.items?.length || 0;
  const hasConnections = connectionCount > 0;

  return (
    <YStack gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="600" color="$color">
            Connected Accounts
          </Text>
          <Text fontSize="$3" color="$gray11">
            {hasConnections
              ? `You have ${connectionCount} connection${connectionCount !== 1 ? "s" : ""}.`
              : "You have no connected accounts."}
          </Text>
        </YStack>
        <Button
          size="$3"
          icon={<Plus size={16} />}
          onPress={handleAddConnection}
          circular
        />
      </XStack>

      {hasConnections && data?.items && (
        <YStack gap="$3">
          {data.items.map((item) => (
            <ConnectionCard key={item.itemId} item={item} />
          ))}
        </YStack>
      )}
    </YStack>
  );
};
