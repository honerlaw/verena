import React, { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { YStack } from "tamagui";
import { MessageBubble } from "./MessageBubble";
import { useConversation } from "../../../../providers/ConversationProvider";
import { LoadingView } from "@/src/components/LoadingView";
import { PromptButtonList } from "@/src/components/ActionSheet/PromptButtonList";
import Icon from "@/assets/icon.svg";

export const MessageList: React.FC = () => {
  const {
    message: { messages, isSending },
    items,
  } = useConversation();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // loading a conversation, but have no messages yet
  if (items.isLoading) {
    return <LoadingView />;
  }

  if (messages.length === 0 && !isSending) {
    return (
      <YStack flex={1} padding={"$4"} justifyContent="flex-end">
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Icon width={100} height={100} />
        </YStack>
        <PromptButtonList title={null} />
      </YStack>
    );
  }

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
              id: "thinking",
              role: "assistant",
              content: "Thinking…",
            }}
            isLoading
          />
        )}
      </YStack>
    </ScrollView>
  );
};
