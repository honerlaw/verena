import React, { useEffect, useRef } from "react"
import { ScrollView } from "react-native"
import { YStack } from "tamagui"
import { MessageBubble } from "../MessageBubble"
import { useConversation } from "../providers/ConversationProvider"

export const MessageList: React.FC = () => {
  const { message: { messages, isSending } } = useConversation()

  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack gap="$3">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isSending && (
          <MessageBubble
            message={{
              role: "assistant",
              content: "Thinking…"
            }}
            isLoading
          />
        )}
      </YStack>
    </ScrollView>
  )
}
