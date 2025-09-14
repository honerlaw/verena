import React from "react"
import { Card, Text, XStack, YStack } from "tamagui"

export type MessageBubbleProps = {
  message: {
    role: "user" | "assistant"
    content: string
  }
  isLoading?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLoading }) => {
  const isUser = message.role === "user"

  return (
    <XStack justifyContent={isUser ? "flex-end" : "flex-start"}>
      <Card
        maxWidth="85%"
        borderWidth={0}
        borderRadius="$6"
        padding="$3"
        backgroundColor={isUser ? "$gray4" : "transparent"}
      >
        <YStack gap="$1">
          <Text opacity={isLoading ? 0.7 : 1}>
            {message.content}
          </Text>
        </YStack>
      </Card>
    </XStack>
  )
}


