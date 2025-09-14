import React, { useCallback, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Button, Input, XStack, YStack } from "tamagui"
import { Mic, Plus, Send, ArrowUp } from "@tamagui/lucide-icons"

export interface ChatBarProps {
  isSending: boolean
  onMessageSent: (message: {
    id: string
    role: "user"
    content: string
    timestamp: Date
  }) => void
}

export const ChatBar: React.FC<ChatBarProps> = ({ isSending, onMessageSent }) => {
  const insets = useSafeAreaInsets()
  const [inputText, setInputText] = useState("")

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim()
    if (!trimmed || isSending) return
    const userMessage = {
      id: `${Date.now()}`,
      role: "user" as const,
      content: trimmed,
      timestamp: new Date(),
    }
    onMessageSent(userMessage)
    setInputText("")
  }, [inputText, isSending, onMessageSent])

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


