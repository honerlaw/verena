import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppThemeProvider } from '@/src/providers/AppThemeProvider';
import { TRPCProvider } from '@/src/providers/TRPCProvider';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { ConfigProvider } from '@/src/providers/ConfigProvider';
import { ToastProvider, ToastViewport } from "@tamagui/toast"

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <ConfigProvider>
        <AuthProvider>
          <TRPCProvider>
            <ToastProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(unauth)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
              <ToastViewport />
            </ToastProvider>
          </TRPCProvider>
        </AuthProvider>
      </ConfigProvider>
    </AppThemeProvider>
  );
}
