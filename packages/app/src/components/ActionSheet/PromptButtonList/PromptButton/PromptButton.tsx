import { useConversation } from "@/src/providers/ConversationProvider";
import React from "react";
import { Button, Text, YStack } from "tamagui";
import { useActionSheet } from "../../providers/ActionSheetProvider";

export interface PromptButtonProps {
  title: string;
  prompt: string;
}

export const PromptButton: React.FC<PromptButtonProps> = ({
  title,
  prompt,
}) => {
  const { setOpen } = useActionSheet();
  const { message } = useConversation();

  return (
    <Button
      onPress={async () => {
        setOpen(false);
        await message.sendMessage(prompt);
      }}
      borderWidth={1}
      borderRadius="$3"
      width={200}
      height={100}
    >
      <YStack alignItems="flex-start" gap="$2" width="100%">
        <Text
          fontSize="$4"
          fontWeight="600"
          color="$color12"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <Text
          fontSize="$3"
          color="$color11"
          numberOfLines={2}
          ellipsizeMode="tail"
          lineHeight={18}
        >
          {prompt}
        </Text>
      </YStack>
    </Button>
  );
};
