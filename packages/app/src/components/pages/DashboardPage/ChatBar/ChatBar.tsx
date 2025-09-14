import React, { useCallback, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Button, Input, XStack, YStack } from "tamagui"
import { Mic, Plus, Send, ArrowUp } from "@tamagui/lucide-icons"
import { useTRPC } from "@/src/providers/TRPCProvider"
import { useMutation } from "@tanstack/react-query"

export interface ChatBarProps {
  isSending: boolean
  onMessageSent: (message: {
    id: string
    role: "user"
    content: string
    timestamp: Date
  }) => void
  onResponseReceived: (message: {
    id: string
    role: "assistant"
    content: string
    timestamp: Date
  }) => void
}

export const ChatBar: React.FC<ChatBarProps> = ({ isSending, onMessageSent, onResponseReceived }) => {
  const insets = useSafeAreaInsets()
  const [inputText, setInputText] = useState("")
  const trpc = useTRPC()

  const { mutateAsync: getAgentResponse } = useMutation(
    trpc.agent.respond.mutationOptions()
  )

  const handleSend = useCallback(async () => {
    const trimmed = inputText.trim()
    if (!trimmed || isSending) return
    
    const userMessage = {
      id: `${Date.now()}`,
      role: "user" as const,
      content: trimmed,
      timestamp: new Date(),
    }
    
    // Send the user message immediately
    onMessageSent(userMessage)
    setInputText("")
    
    try {
      // Get agent response
      const result = await getAgentResponse({
        message: trimmed
      })
      
      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant" as const,
        content: result.response,
        timestamp: new Date(),
      }
      
      onResponseReceived(assistantMessage)
    } catch (error) {
      console.error('Failed to get agent response:', error)
      // Could add error handling here, maybe show an error message
      const errorMessage = {
        id: `${Date.now()}-error`,
        role: "assistant" as const,
        content: "Sorry, I encountered an error processing your message. Please try again.",
        timestamp: new Date(),
      }
      onResponseReceived(errorMessage)
    }
  }, [inputText, isSending, onMessageSent, onResponseReceived, getAgentResponse])

  const handleEnterKey = (e: any) => {
    if (e?.nativeEvent?.key === "Enter" && !e?.nativeEvent?.shiftKey) {
      e.preventDefault?.()
      handleSend()
    }
  }

  const isSendDisable = inputText.trim().length === 0 && !isSending

  return (
    <XStack
      padding="$2"
      margin="$3"
      alignItems="flex-end"
      marginBottom={insets.bottom}
      borderWidth={1}
      borderColor="$gray5"
      borderRadius="$8"
    >
      <YStack flex={1}>
        <XStack
          alignItems="center"
          gap="$2"
        >
          <Input
            flex={1}
            multiline
            maxHeight={140}
            value={inputText}
            onChangeText={setInputText}
            onKeyPress={handleEnterKey}
            placeholder="Ask about my finances..."
            disabled={isSending}
            borderWidth={0}
            backgroundColor="transparent"
            fontWeight={400}
            style={{ fontSize: 15 }}
          />

          <Button
            size="$4"
            circular
            disabled={isSendDisable}
            backgroundColor={!isSendDisable ? "$primary" : "$gray5"}
            onPress={handleSend}
          >
            <ArrowUp size={24} color={!isSendDisable ? "white" : "black"} />
          </Button>
        </XStack>
      </YStack>
    </XStack>
  )
}


