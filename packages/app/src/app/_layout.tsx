import { Stack } from "expo-router";
import "react-native-reanimated";
import { AppLayout } from "@/src/components/AppLayout";
import * as Sentry from "@sentry/react-native";

export const unstable_settings = {
  anchor: "index",
};

function RootLayout() {
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

export default Sentry.wrap(RootLayout);
