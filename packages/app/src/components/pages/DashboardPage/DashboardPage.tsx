import React, { useEffect, useRef, useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { YStack } from "tamagui"
import { MessageBubble } from "./MessageBubble"
import { ChatBar } from "./ChatBar"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export const DashboardPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [isSending, setIsSending] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  const handleMessageSent = (userMessage: ChatMessage) => {
    if (isSending) return
    setMessages((prev) => [...prev, userMessage])
    setIsSending(true)
  }

  const handleResponseReceived = (assistantMessage: ChatMessage) => {
    setMessages((prev) => [...prev, assistantMessage])
    setIsSending(false)
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
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

        <ChatBar 
          isSending={isSending} 
          onMessageSent={handleMessageSent}
          onResponseReceived={handleResponseReceived}
        />
      </KeyboardAvoidingView>
    </YStack>
  )
}

