import { useCallback, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/src/providers/TRPCProvider"
import { useReportError } from "@/src/hooks/useReportError"

type UseCreateConversationReturn = {
  conversationId: string | null,
  create: () => Promise<string | null>
  isLoading: boolean
  error: unknown | null
}

export const useCreateConversation = (
  refetchConversations: () => void
): UseCreateConversationReturn => {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [creationError, setCreationError] = useState<string | null>(null)
  const { report } = useReportError()
  const trpc = useTRPC()

  // Create conversation mutation
  const { mutateAsync: createConversation, isPending: isCreatingConversation } = useMutation(
    trpc.conversation.create.mutationOptions()
  )

  const create = useCallback(async (): Promise<string | null> => {
    try {
      setCreationError(null)
      
      // If we already have a current conversation ID, return it
      if (currentConversationId) {
        return currentConversationId
      }

      // Create a new conversation
      const result = await createConversation()
      const newConversationId = result.conversation.conversationId
      
      // Set it as the current conversation
      setCurrentConversationId(newConversationId)
      
      // Refetch conversations to include the new one
      refetchConversations()
      
      return newConversationId
    } catch (err) {
      report(err)
      setCreationError(err instanceof Error ? err.message : 'Unknown error occurred during conversation creation')
      return null
    }
  }, [currentConversationId, createConversation, refetchConversations, setCurrentConversationId])

  return {
    conversationId: currentConversationId,
    create,
    isLoading: isCreatingConversation,
    error: creationError
  }
}
