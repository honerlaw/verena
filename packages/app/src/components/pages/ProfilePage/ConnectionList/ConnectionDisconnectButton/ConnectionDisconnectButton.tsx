import React from "react";
import { Button } from "tamagui";
import { Trash2 } from "@tamagui/lucide-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useReportError } from "@/src/hooks/useReportError";
import { AlertModal } from "@/src/components/AlertModal";

export type Item = Awaited<
  ReturnType<AppRouter["item"]["getAll"]>
>["items"][number];

export interface ConnectionDisconnectButtonProps {
  item: Item;
}

export const ConnectionDisconnectButton: React.FC<
  ConnectionDisconnectButtonProps
> = ({ item }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { report } = useReportError();

  const { mutateAsync: disconnectConnection, isPending: isDisconnecting } =
    useMutation(trpc.item.remove.mutationOptions());

  return (
    <AlertModal
      title="Disconnect Account"
      message={`Are you sure you want to disconnect ${item.institutionName ?? "An account"}? This will remove access to all associated accounts and transactions.`}
      buttons={[
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: async () => {
            try {
              await disconnectConnection({
                itemId: item.itemId,
              });
              // Invalidate and refetch connection queries to refresh the list
              await queryClient.invalidateQueries({
                queryKey: trpc.item.getAll.queryKey(),
              });
            } catch (error) {
              report(error, "Failed to disconnect account. Please try again.");
            }
          },
        },
      ]}
    >
      <Button size="$2" disabled={isDisconnecting} transparent>
        {isDisconnecting ? "..." : <Trash2 color="$red10" size="$1" />}
      </Button>
    </AlertModal>
  );
};
