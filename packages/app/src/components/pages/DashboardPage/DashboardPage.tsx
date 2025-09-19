import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { YStack } from "tamagui";
import { MessageList } from "./MessageList";
import { ChatBar } from "./ChatBar";
import { ConnectAccountBanner } from "./ConnectAccountBanner";
import { ReconnectConnectionBanner } from "./ReconnectConnectionBanner";

export const DashboardPage: React.FC = () => {
  return (
    <YStack flex={1} backgroundColor="$background">
      <ReconnectConnectionBanner />
      <ConnectAccountBanner />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <MessageList />
        <ChatBar />
      </KeyboardAvoidingView>
    </YStack>
  );
};
