import { QuilttConnector } from '@quiltt/react-native'
import type { ConnectorSDKCallbackMetadata } from '@quiltt/core'
import React from 'react'
import { useRouter } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/src/providers/TRPCProvider'
import { useReportError } from '@/src/hooks/useReportError'

export const ConnectorPage: React.FC = () => {
  const router = useRouter()
  const trpc = useTRPC()
  const { report } = useReportError()

  const { mutateAsync: createConnection } = useMutation(
    trpc.connection.create.mutationOptions()
  )

  return (
    <QuilttConnector
      connectorId="11n4uw5f0q"
      oauthRedirectUrl="https://www.verena.app/connector"
      onExitSuccess={async (metadata: ConnectorSDKCallbackMetadata) => {
        try {
          if (metadata.connectionId) {
            await createConnection({
              connectionId: metadata.connectionId
            })
          }
          router.back()
        } catch (error) {
          report(error, 'Failed to save connection. Please try again.')
        }
      }}
      onExitAbort={() => {
        router.back()
      }}
    />
  )
}