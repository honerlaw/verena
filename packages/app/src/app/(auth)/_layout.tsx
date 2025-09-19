import { LoadingView } from "@/src/components/LoadingView";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "tamagui";
import { User } from "@tamagui/lucide-icons";
import { Redirect, Stack, useRouter } from "expo-router";
import { WebLayout } from "@/src/components/WebLayout";

export const unstable_settings = {
  initialRouteName: "dashboard",
};

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return <LoadingView />;
  }

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
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
                scaleIcon={1.5}
                onPress={() => router.push("/profile")}
              />
            ),
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
    </WebLayout>
  );
}
