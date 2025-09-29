import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Input, XStack, YStack } from "tamagui";
import { ArrowUp, MoreVertical } from "@tamagui/lucide-icons";
import { useConversation } from "../../../../providers/ConversationProvider";
import { useActionSheet } from "@/src/components/ActionSheet";
import { GlassView } from "expo-glass-effect";
import { useLiquidGlass } from "@/src/hooks/useLiquidGlass";

const STYLES = StyleSheet.create({
  inputContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 46,
    flexDirection: "row",
    paddingVertical: 8,
  },
});

export const ChatBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { message } = useConversation();
  const { setOpen } = useActionSheet();
  const { isLiquidGlassEnabled } = useLiquidGlass();

  return (
    <XStack
      margin="$3"
      alignItems="flex-end"
      marginBottom={insets.bottom * 1.3}
    >
      <YStack flex={1}>
        <XStack gap="$2" alignItems="center">
          <GlassView style={{ borderRadius: 100 }}>
            <Button
              backgroundColor={isLiquidGlassEnabled ? "transparent" : undefined}
              size="$4"
              circular
              icon={MoreVertical}
              onPress={() => setOpen(true)}
            />
          </GlassView>
          <GlassView style={STYLES.inputContainer}>
            <Input
              multiline
              flex={1}
              maxHeight={140}
              value={message.inputText}
              onChangeText={message.setInputText}
              onSubmitEditing={message.handleSend}
              placeholder="Ask about my finances..."
              disabled={message.isSending}
              borderWidth={0}
              backgroundColor="transparent"
              fontWeight={400}
              style={{ fontSize: 15, lineHeight: 20 }}
              verticalAlign={"center"}
              returnKeyType="send"
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
          </GlassView>
        </XStack>
      </YStack>
    </XStack>
  );
};
