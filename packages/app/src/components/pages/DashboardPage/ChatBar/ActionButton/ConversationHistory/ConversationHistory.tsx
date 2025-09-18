import React from "react";
import { YStack, XStack, Text, Button, ScrollView } from "tamagui";
import { MessageSquare, Clock } from "@tamagui/lucide-icons";
import { LoadingView } from "@/src/components/LoadingView";
import { ErrorView } from "@/src/components/ErrorView";
import { EmptyView } from "@/src/components/EmptyView";
import { Conversation } from "../../../providers/ConversationProvider/hooks/useListConversation";

type ConversationHistoryProps = {
  conversations: Conversation[]
  isLoading: boolean
  error: unknown | null
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({ conversations, isLoading, error }) => {
  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView small error={error} message="Failed to fetch conversation history." />;
  }

  // No conversations, render empty state
  if (!conversations || conversations.length === 0) {
    return (
      <EmptyView 
        message="Start a new conversation to see your chat history here."
      />
    );
  }

  return (
    <YStack gap="$4" flex={1}>
      <YStack gap="$2">
        <XStack alignItems="center" gap="$2">
          <Clock size={20} color="$gray11" />
          <Text fontSize="$5" fontWeight="600" color="$color">
            Recent Conversations
          </Text>
        </XStack>
        <Text fontSize="$3" color="$gray11">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} found
        </Text>
      </YStack>
      
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack gap="$2">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              size="$4"
              backgroundColor="transparent"
              borderWidth={1}
              borderColor="$borderColor"
              justifyContent="flex-start"
              paddingHorizontal="$3"
              paddingVertical="$3"
              pressStyle={{
                backgroundColor: "$gray3",
                borderColor: "$gray7",
              }}
              hoverStyle={{
                backgroundColor: "$gray2",
                borderColor: "$gray6",
              }}
              onPress={() => {
                // TODO: Navigate to conversation or handle selection
                console.log('Selected conversation:', conversation.id);
              }}
            >
              <XStack alignItems="center" gap="$3" flex={1}>
                <MessageSquare
                  size={18}
                  color="$gray11"
                />
                <YStack flex={1} alignItems="flex-start">
                  <Text
                    fontSize="$4"
                    color="$color"
                    fontWeight="500"
                    numberOfLines={1}
                  >
                    {conversation.title}
                  </Text>
                  <Text
                    fontSize="$2"
                    color="$gray11"
                    numberOfLines={1}
                  >
                    ID: {conversation.conversationId}
                  </Text>
                </YStack>
              </XStack>
            </Button>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
};
