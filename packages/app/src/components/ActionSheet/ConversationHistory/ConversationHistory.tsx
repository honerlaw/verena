import React from "react";
import { YStack, XStack, Text, Button, Sheet, H5 } from "tamagui";
import { formatDistanceToNow } from "date-fns";
import { LoadingView } from "@/src/components/LoadingView";
import { ErrorView } from "@/src/components/ErrorView";
import { EmptyView } from "@/src/components/EmptyView";
import { AlertModal } from "@/src/components/AlertModal/AlertModal";
import { Trash2, Plus } from "@tamagui/lucide-icons";
import { useActionSheet } from "../providers/ActionSheetProvider";
import { useConversation } from "@/src/providers/ConversationProvider";

export const ConversationHistory: React.FC = () => {
  const { setOpen } = useActionSheet();

  const {
    list: { conversations, isLoading, error },
    create,
    remove,
    setCurrentConversationId,
    message,
  } = useConversation();

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return (
      <ErrorView
        small
        error={error}
        message="Failed to fetch conversation history."
      />
    );
  }

  // No conversations, render empty state
  if (!conversations || conversations.length === 0) {
    return (
      <EmptyView message="Start a new conversation to see your chat history here." />
    );
  }

  return (
    <YStack gap="$4" flex={1}>
      <Sheet.ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <YStack padding={"$2"} backgroundColor="$background">
          <XStack alignItems="center" justifyContent="space-between" gap="$2">
            <H5 color="$color" fontWeight={"700"}>
              Conversations
            </H5>
            <Button
              size="$3"
              circular
              icon={<Plus size={14} color="$color" />}
              onPress={async () => {
                setOpen(false);
                message.clearMessages();
                setCurrentConversationId(null);
                await create.create(true);
              }}
            />
          </XStack>
        </YStack>
        {conversations.map((conversation) => (
          <XStack key={conversation.id} alignItems="center" gap="$2">
            <Button
              size="$4"
              backgroundColor="transparent"
              borderWidth={1}
              borderColor="$borderColor"
              justifyContent="flex-start"
              padding="$2"
              flex={1}
              onPress={() => {
                message.clearMessages();
                setCurrentConversationId(conversation.conversationId);
                setOpen(false);
              }}
            >
              <XStack alignItems="center" gap="$3" flex={1}>
                <YStack flex={1} alignItems="flex-start">
                  <Text
                    fontSize="$4"
                    color="$color"
                    fontWeight="500"
                    numberOfLines={1}
                  >
                    {conversation.title}
                  </Text>
                  <Text fontSize="$2" color="$gray11" numberOfLines={1}>
                    {formatDistanceToNow(new Date(conversation.updatedAt), {
                      addSuffix: true,
                    })}
                  </Text>
                </YStack>
              </XStack>
            </Button>
            <AlertModal
              title="Delete Conversation"
              message={`Are you sure you want to delete "${conversation.title}"? This action cannot be undone.`}
              buttons={[
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    await remove.remove(conversation.conversationId);
                  },
                },
              ]}
            >
              <Button
                size="$3"
                backgroundColor="transparent"
                borderColor={"transparent"}
                icon={<Trash2 color="$red10" size={14} />}
                circular
              />
            </AlertModal>
          </XStack>
        ))}
      </Sheet.ScrollView>
    </YStack>
  );
};
