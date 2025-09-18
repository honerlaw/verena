import React, { createContext, useContext, useEffect } from "react"
import { useCreateConversation } from "./hooks/useCreateConversation"
import { useListConversation } from "./hooks/useListConversation"
import { useListConversationItems } from "./hooks/useListConversationItems"
import { useMessage } from "./hooks/useMessage"

interface ConversationContextType {
  list: ReturnType<typeof useListConversation>
  create: ReturnType<typeof useCreateConversation>
  items: ReturnType<typeof useListConversationItems>
  message: ReturnType<typeof useMessage>
}

const ConversationContext = createContext<ConversationContextType | null>(null)

export const useConversation = () => {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error("useConversation must be used within a ConversationProvider")
  }
  return context
}

export const ConversationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Use the list conversation hook
  const list = useListConversation()

  // Use the create conversation hook
  const create = useCreateConversation(
    list.refetch
  )

  // Use the list conversation items hook
  const items = useListConversationItems(create.conversationId)

  // Use the message hook
  const message = useMessage(create.create)

  // Refetch items whenever currentConversationId changes
  useEffect(() => {
    if (create.conversationId) {
      items.refetch()
    }
  }, [create.conversationId, items.refetch])

  const value: ConversationContextType = {
    list,
    create,
    items,
    message
  }

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}
