import { Stack } from "expo-router";
import "react-native-reanimated";
import { AppLayout } from "@/src/components/AppLayout";

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  return (
    <AppLayout>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(unauth)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AppLayout>
  );
}
