import React from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Button, Input, XStack, YStack } from "tamagui"
import { ArrowUp } from "@tamagui/lucide-icons"
import { ActionButton } from "./ActionButton"
import { useConversation } from "../providers/ConversationProvider"

export const ChatBar: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { message } = useConversation()

  return (
    <XStack
      margin="$3"
      alignItems="flex-end"
      marginBottom={insets.bottom}
    >
      <YStack flex={1}>
        <XStack
          gap="$2"
          alignItems="center"
        >
          <ActionButton />
          <XStack backgroundColor="$gray4" flex={1} borderRadius={"$8"} alignItems="center">
            <Input
              multiline
              flex={1}
              maxHeight={140}
              value={message.inputText}
              onChangeText={message.setInputText}
              onKeyPress={message.handleEnterKey}
              placeholder="Ask about my finances..."
              disabled={message.isSending}
              borderWidth={0}
              backgroundColor="transparent"
              fontWeight={400}
              style={{ fontSize: 15, lineHeight: 20 }}
              verticalAlign={"center"}
            />
            <Button
              size="$3"
              circular
              disabled={message.isSendDisabled}
              backgroundColor={"$primary"}
              color="white"
              icon={ArrowUp}
              onPress={message.handleSend}
              marginRight={"$2"}
            />
          </XStack>
        </XStack>
      </YStack>
    </XStack>
  )
}


