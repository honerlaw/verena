import React from "react"
import { YStack, Text } from "tamagui"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/src/providers/TRPCProvider"
import { LoadingView } from "@/src/components/LoadingView"
import { ErrorView } from "@/src/components/ErrorView"
import { ConnectionCard } from "./ConnectionCard"

export interface ConnectionListProps {}

export const ConnectionList: React.FC<ConnectionListProps> = () => {
  const trpc = useTRPC()
  const { data, isLoading, error } = useQuery(trpc.connection.getAll.queryOptions())

  if (isLoading) {
    return <LoadingView />
  }

  if (error) {
    return <ErrorView small error={error} message="Failed to fetch connected accounts." />
  }

  // no connections, render
  if (!data?.connections || data.connections.length === 0) {
    return null
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
