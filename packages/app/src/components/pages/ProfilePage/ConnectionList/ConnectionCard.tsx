import React, { useState } from "react"
import { YStack, XStack, Text, Card, Separator } from "tamagui"
import type { AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs"

export type Connection = Awaited<ReturnType<AppRouter['connection']['getAll']>>['connections'][number]

export interface ConnectionCardProps {
  connection: Connection
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection }) => {
  const [isAccountsExpanded, setIsAccountsExpanded] = useState(false)

  return (
    <Card
      padding="$4"
      backgroundColor="$background"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
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
                  Accounts ({connection.accounts.length})
                </Text>
              </XStack>
              {isAccountsExpanded && (
                <YStack gap="$1" paddingLeft="$4">
                  {connection.accounts.map((account) => (
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
  )
}
