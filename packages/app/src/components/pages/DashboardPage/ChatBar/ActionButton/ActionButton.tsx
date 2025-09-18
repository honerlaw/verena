import React, { useState } from "react";
import { Trash, MoreVertical } from "@tamagui/lucide-icons";
import { Button, Sheet, YStack, XStack, Text } from "tamagui";
import { ConversationHistory } from "./ConversationHistory";
import { useConversation } from "../../providers/ConversationProvider";

export const ActionButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);
  const { list: { conversations, isLoading, error } } = useConversation();

  const handleDeleteEntry = () => {
    console.log("called");
    setOpen(false);
  };

  return (
    <>
      <Button
        size="$3"
        circular
        icon={MoreVertical}
        onPress={() => setOpen(true)}
      />
      
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85, 60, 25]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="quick"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame
          padding="$4"
          backgroundColor="$background"
          borderTopLeftRadius="$4"
          borderTopRightRadius="$4"
          flex={1}
        >
          <YStack gap="$4" flex={1}>
            {/* Conversation History Section */}
            <YStack flex={1} minHeight={200}>
              <ConversationHistory conversations={conversations} isLoading={isLoading} error={error} />
            </YStack>
            
            {/* Actions Section */}
            <YStack gap="$2" paddingTop="$3" borderTopWidth={1} borderTopColor="$borderColor">
              <Button
                size="$4"
                backgroundColor="transparent"
                borderWidth={0}
                justifyContent="flex-start"
                paddingHorizontal="$4"
                paddingVertical="$3"
                onPress={handleDeleteEntry}
                pressStyle={{
                  backgroundColor: "$gray3",
                }}
                hoverStyle={{
                  backgroundColor: "$gray2",
                }}
              >
                <XStack alignItems="center" gap="$3">
                  <Trash
                    size={20}
                    color="$red10"
                  />
                  <Text
                    fontSize="$4"
                    color="$red10"
                    fontWeight="bold"
                  >
                    Delete Entry
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};
