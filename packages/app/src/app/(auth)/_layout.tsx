import { LoadingView } from "@/src/components/LoadingView";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "tamagui";
import { Plus, User } from "@tamagui/lucide-icons";
import { Redirect, Stack, useRouter } from "expo-router";
import { WebLayout } from "@/src/components/WebLayout";
import { ActionSheetProvider, ActionSheet } from "@/src/components/ActionSheet";
import {
  ConversationProvider,
  useConversation,
} from "@/src/providers/ConversationProvider";
import React from "react";
import { useLiquidGlass } from "@/src/hooks/useLiquidGlass";

export const unstable_settings = {
  initialRouteName: "dashboard",
};

const HeaderRight: React.FC = () => {
  const { isLiquidGlassEnabled } = useLiquidGlass();
  const { create, message, setCurrentConversationId } = useConversation();
  return (
    <Button
      size="$3"
      circular
      icon={Plus}
      backgroundColor={isLiquidGlassEnabled ? "transparent" : undefined}
      onPress={async () => {
        message.clearMessages();
        setCurrentConversationId(null);
        await create.create(true);
      }}
    />
  );
};

export default function AuthLayout() {
  const { isLiquidGlassEnabled } = useLiquidGlass();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return <LoadingView />;
  }

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <ActionSheetProvider>
      <ConversationProvider>
        <WebLayout>
          <Stack
            initialRouteName="dashboard"
            screenOptions={{
              headerBackButtonDisplayMode: "minimal",
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen
              name="dashboard"
              options={{
                headerTitle: "Verena",
                headerLeft: () => (
                  <Button
                    size="$3"
                    circular
                    icon={User}
                    backgroundColor={
                      isLiquidGlassEnabled ? "transparent" : undefined
                    }
                    scaleIcon={1.5}
                    onPress={() => router.push("/profile")}
                  />
                ),
                headerRight: () => <HeaderRight />,
              }}
            />
            <Stack.Screen
              name="profile"
              options={{
                headerTitle: "Profile",
                headerTransparent: false,
                presentation: "modal",
                animationTypeForReplace: "push",
              }}
            />
          </Stack>
          <ActionSheet />
        </WebLayout>
      </ConversationProvider>
    </ActionSheetProvider>
  );
}
