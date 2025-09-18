import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { YStack } from "tamagui";
import { MessageList } from "./MessageList";
import { ChatBar } from "./ChatBar";
import { ConversationProvider } from "./providers/ConversationProvider";

export const DashboardPage: React.FC = () => {
  return (
    <ConversationProvider>
      <YStack flex={1} backgroundColor="$background">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <MessageList />
          <ChatBar />
        </KeyboardAvoidingView>
      </YStack>
    </ConversationProvider>
  );
};
