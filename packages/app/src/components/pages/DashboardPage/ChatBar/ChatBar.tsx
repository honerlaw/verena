import React from "react";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Input, useTheme, XStack, YStack } from "tamagui";
import { ArrowUp, MoreVertical } from "@tamagui/lucide-icons";
import { useConversation } from "../../../../providers/ConversationProvider";
import { useActionSheet } from "@/src/components/ActionSheet";
import { GlassView } from "expo-glass-effect";
import { useLiquidGlass } from "@/src/hooks/useLiquidGlass";

const STYLES = StyleSheet.create({
  inputContainer: {
    flex: 1,
    alignItems: "center",
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
  const theme = useTheme();

  return (
    <XStack
      margin="$3"
      alignItems="flex-end"
      marginBottom={insets.bottom * 1.3}
    >
      <YStack flex={1}>
        <XStack
          gap="$2"
          alignItems="center"
          marginBottom={Platform.OS === "web" ? "$3" : undefined}
        >
          <GlassView style={{ borderRadius: 100 }}>
            <Button
              backgroundColor={isLiquidGlassEnabled ? "transparent" : undefined}
              hoverStyle={
                isLiquidGlassEnabled
                  ? { backgroundColor: "transparent", borderWidth: 0 }
                  : undefined
              }
              pressStyle={
                isLiquidGlassEnabled
                  ? { backgroundColor: "transparent", borderWidth: 0 }
                  : undefined
              }
              size="$4"
              circular
              icon={MoreVertical}
              onPress={() => setOpen(true)}
            />
          </GlassView>
          <GlassView
            style={[
              STYLES.inputContainer,
              !isLiquidGlassEnabled &&
                Platform.OS === "web" && {
                  backgroundColor: theme.gray4?.val,
                  borderRadius: 24,
                },
            ]}
          >
            <Input
              multiline
              flex={1}
              height={Platform.OS === "web" ? 46 : undefined}
              maxHeight={140}
              flexGrow={1}
              value={message.inputText}
              onChangeText={message.setInputText}
              onSubmitEditing={message.handleSend}
              placeholder="Ask about your finances..."
              disabled={message.isSending}
              borderWidth={0}
              focusStyle={{ outline: "none" }}
              backgroundColor="transparent"
              fontWeight={400}
              style={{ fontSize: 15, lineHeight: 20 }}
              verticalAlign={"center"}
              returnKeyType="send"
              underlineColorAndroid="transparent"
            />
            <Button
              size="$3"
              circular
              disabled={message.isSendDisabled}
              backgroundColor={"$primary"}
              disabledStyle={{ backgroundColor: "$gray8" }}
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
