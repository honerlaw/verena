import { LoadingView } from "@/src/components/LoadingView";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "tamagui";
import { Plus, User } from "@tamagui/lucide-icons";
import { Redirect, Stack, useRouter } from "expo-router";
import { WebLayout } from "@/src/components/WebLayout";
import { ActionSheetProvider, ActionSheet } from "@/src/components/ActionSheet";
import {
  ConversationProvider,
  useConversationCreate,
  useConversationStreamMessage,
  useConversationCurrent,
} from "@/src/providers/ConversationProvider";
import React from "react";
import { useLiquidGlass } from "@/src/hooks/useLiquidGlass";
import { Platform } from "react-native";

export const unstable_settings = {
  initialRouteName: "dashboard",
};

const HeaderRight: React.FC = () => {
  const { isLiquidGlassEnabled } = useLiquidGlass();
  const { create } = useConversationCreate();
  const { clearMessages } = useConversationStreamMessage();
  const { setCurrentConversationId } = useConversationCurrent();
  return (
    <Button
      size="$3"
      circular
      icon={Plus}
      marginHorizontal={Platform.OS === "web" ? "$4" : undefined}
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
      onPress={async () => {
        clearMessages();
        setCurrentConversationId(null);
        await create(true);
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
                    marginHorizontal={Platform.OS === "web" ? "$4" : undefined}
                    marginRight={Platform.OS === "android" ? "$4" : undefined}
                    backgroundColor={
                      isLiquidGlassEnabled ? "transparent" : undefined
                    }
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
                headerBackButtonDisplayMode: "minimal",
                headerShadowVisible: false,
              }}
            />
          </Stack>
          <ActionSheet />
        </WebLayout>
      </ConversationProvider>
    </ActionSheetProvider>
  );
}
