import React from "react"
import { YStack, XStack, Text, Card, Separator } from "tamagui"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/src/providers/TRPCProvider"
import { LoadingView } from "@/src/components/LoadingView"
import { ErrorView } from "@/src/components/ErrorView"
import { EmptyView } from "@/src/components/EmptyView"
import type { AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs"

type Connection = Awaited<ReturnType<AppRouter['connection']['getAll']>>['connections'][number]

const ConnectionCard: React.FC<{ connection: Connection }> = ({ connection }) => {
  return (
    <Card
      padding="$4"
      backgroundColor="$background"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      elevationAndroid={2}
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
    >
      <YStack gap="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <YStack gap="$1" flex={1}>
            <Text fontSize="$5" fontWeight="600" color="$color">
              {connection.institution.name}
            </Text>
            <Text fontSize="$3" color="$gray11" textTransform="capitalize">
              {connection.provider} • {connection.status}
            </Text>
          </YStack>
          <XStack
            width={48}
            height={48}
            backgroundColor="$gray3"
            borderRadius="$2"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            {/* Would need an Image component to display the logo */}
            <Text fontSize="$2" color="$gray8">
              🏦
            </Text>
          </XStack>
        </XStack>

        {connection.accounts.length > 0 && (
          <>
            <Separator />
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="500" color="$gray11">
                Accounts ({connection.accounts.length})
              </Text>
              {connection.accounts.map((account, index) => (
                <Text key={account.id} fontSize="$3" color="$color" paddingLeft="$2">
                  • {account.name}
                </Text>
              ))}
            </YStack>
          </>
        )}
      </YStack>
    </Card>
  )
}

export const ConnectionList: React.FC<ConnectionListProps> = () => {
  const trpc = useTRPC()
  const { data, isLoading, error } = useQuery(trpc.connection.getAll.queryOptions())

  if (isLoading) {
    return <LoadingView />
  }

  if (error) {
    return <ErrorView error={error} />
  }

  if (!data?.connections || data.connections.length === 0) {
    return <EmptyView />
  }

  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <Text fontSize="$6" fontWeight="600" color="$color">
          Connected Accounts
        </Text>
        <Text fontSize="$3" color="$gray11">
          {data.connections.length} connection{data.connections.length !== 1 ? 's' : ''} found
        </Text>
      </YStack>
      
      <YStack gap="$3">
        {data.connections.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}
      </YStack>
    </YStack>
  )
}
