import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { AppThemeProvider } from "@/src/providers/AppThemeProvider";
import { TRPCProvider } from "@/src/providers/TRPCProvider";
import { AuthProvider } from "@/src/providers/AuthProvider";
import { ConfigProvider } from "@/src/providers/ConfigProvider";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import React, { useEffect } from "react";
import { SplashScreen, useNavigationContainerRef } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";
import Head from "expo-router/head";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Construct a new integration instance. This is needed to communicate between the integration and React
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: "https://08c9c3ad8d1213e2508fe4703e961b4c@o4507030771007488.ingest.us.sentry.io/4510054013730816",
  debug: false,
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
  integrations: [
    // Pass integration
    navigationIntegration,
  ],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
});

export const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Capture the NavigationContainer ref and register it with the integration.
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    SplashScreen.hideAsync();
  });

  return (
    <>
      {Platform.OS === "web" && (
        <Head>
          <title>Verena</title>
        </Head>
      )}
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
    </>
  );
};
