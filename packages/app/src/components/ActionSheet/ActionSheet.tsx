import React, { useState } from "react";
import { Sheet, YStack } from "tamagui";
import { ConversationHistory } from "./ConversationHistory";
import { useActionSheet } from "./providers/ActionSheetProvider";
import { PromptButtonList } from "./PromptButtonList";

export const ActionSheet: React.FC = () => {
  const [position, setPosition] = useState(0);
  const { open, setOpen } = useActionSheet();

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      snapPoints={[60]}
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
        padding={"$4"}
        backgroundColor="$background"
        borderTopLeftRadius="$4"
        borderTopRightRadius="$4"
        flex={1}
      >
        <YStack gap="$4" flex={1}>
          <PromptButtonList />
          <ConversationHistory />
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
