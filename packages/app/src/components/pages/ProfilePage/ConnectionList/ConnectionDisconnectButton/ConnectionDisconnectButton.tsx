import React from "react"
import { Button } from "tamagui"
import { Trash2 } from "@tamagui/lucide-icons"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs"
import { useTRPC } from "@/src/providers/TRPCProvider"
import { useReportError } from "@/src/hooks/useReportError"
import { AlertModal } from "@/src/components/AlertModal"

export type Connection = Awaited<ReturnType<AppRouter['connection']['getAll']>>['connections'][number]

export interface ConnectionDisconnectButtonProps {
  connection: Connection
}

export const ConnectionDisconnectButton: React.FC<ConnectionDisconnectButtonProps> = ({ connection }) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { report } = useReportError()

  const { mutateAsync: disconnectConnection, isPending: isDisconnecting } = useMutation(
    trpc.connection.disconnect.mutationOptions(),
  )

  return (
    <AlertModal
      title="Disconnect Account"
      message={`Are you sure you want to disconnect ${connection.institution.name}? This will remove access to all associated accounts and transactions.`}
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
                connectionId: connection.id,
              })
              // Invalidate and refetch connection queries to refresh the list
              await queryClient.invalidateQueries({
                queryKey: trpc.connection.getAll.queryKey(),
              })
            } catch (error) {
              report(error, "Failed to disconnect account. Please try again.")
            }
          },
        },
      ]}
    >
      <Button
        size="$2"
        disabled={isDisconnecting}
        transparent
      >
        {isDisconnecting ? "..." : <Trash2 color="$red10" size="$1" />}
      </Button>
    </AlertModal>
  )
}
