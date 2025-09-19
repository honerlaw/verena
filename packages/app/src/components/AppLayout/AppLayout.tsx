import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { AppThemeProvider } from "@/src/providers/AppThemeProvider";
import { TRPCProvider } from "@/src/providers/TRPCProvider";
import { AuthProvider } from "@/src/providers/AuthProvider";
import { ConfigProvider } from "@/src/providers/ConfigProvider";
import { ConversationProvider } from "@/src/providers/ConversationProvider";
import { ActionSheetProvider, ActionSheet } from "@/src/components/ActionSheet";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import React from "react";

export const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AppThemeProvider>
      <ConfigProvider>
        <AuthProvider>
          <TRPCProvider>
            <ToastProvider>
              <ActionSheetProvider>
                <ConversationProvider>
                  {children}
                  <ActionSheet />
                  <StatusBar style="auto" />
                  <ToastViewport />
                </ConversationProvider>
              </ActionSheetProvider>
            </ToastProvider>
          </TRPCProvider>
        </AuthProvider>
      </ConfigProvider>
    </AppThemeProvider>
  );
};
