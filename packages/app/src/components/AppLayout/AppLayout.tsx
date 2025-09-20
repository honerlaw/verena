import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { AppThemeProvider } from "@/src/providers/AppThemeProvider";
import { TRPCProvider } from "@/src/providers/TRPCProvider";
import { AuthProvider } from "@/src/providers/AuthProvider";
import { ConfigProvider } from "@/src/providers/ConfigProvider";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import React from "react";

export const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AppThemeProvider>
      <ConfigProvider>
        <AuthProvider>
          <TRPCProvider>
            <ToastProvider>
                  {children}
                  <StatusBar style="auto" />
                  <ToastViewport />
            </ToastProvider>
          </TRPCProvider>
        </AuthProvider>
      </ConfigProvider>
    </AppThemeProvider>
  );
};
