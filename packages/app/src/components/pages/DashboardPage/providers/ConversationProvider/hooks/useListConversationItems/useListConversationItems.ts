import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/src/providers/TRPCProvider"
import { type AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs"
import { useReportError } from "@/src/hooks/useReportError"

export type ConversationItem = AppRouter["conversation"]["items"]["_def"]["$types"]["output"]["items"][number]

type UseListConversationItemsReturn = {
  items: ConversationItem[]
  isLoading: boolean
  error: unknown | null
  refetch: () => void
}

export const useListConversationItems = (conversationId: string | null): UseListConversationItemsReturn => {
  const trpc = useTRPC()
  const { report } = useReportError()

  // Fetch conversation items only if conversationId is provided
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    ...trpc.conversation.items.queryOptions({ conversationId: conversationId! }),
    enabled: !!conversationId, // Only fetch if conversationId exists
  })

  const items: ConversationItem[] = data?.items || []

  useEffect(() => {
    if (error) {
      report(error)
    }
  }, [error, report])

  return {
    items,
    isLoading,
    error,
    refetch
  }
}
