import React from "react";
import { YStack, Button, Separator } from "tamagui";
import { LogOut } from "@tamagui/lucide-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertModal, type AlertButton } from "../../../AlertModal";
import { useQueryClient } from "@tanstack/react-query";

export const SignOutSection: React.FC = () => {
  const { signOut } = useAuth();
  const { bottom } = useSafeAreaInsets();
  const client = useQueryClient();

  const alertButtons: AlertButton[] = [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Sign Out",
      style: "destructive",
      onPress: async () => {
        await signOut();
        client.invalidateQueries();
        client.resetQueries();
      },
    },
  ];

  return (
    <YStack paddingBottom={bottom} paddingHorizontal={"$4"}>
      <Separator marginBottom="$4" />
      <AlertModal
        title="Sign Out"
        message="Are you sure you want to sign out?"
        buttons={alertButtons}
      >
        <Button size="$3" iconAfter={LogOut} fontWeight={"400"}>
          Sign Out
        </Button>
      </AlertModal>
    </YStack>
  );
};
