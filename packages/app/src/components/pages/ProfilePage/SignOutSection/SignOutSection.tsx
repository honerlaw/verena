import React from "react"
import { YStack, Button, Separator } from "tamagui"
import { LogOut } from "@tamagui/lucide-icons"
import { useAuth } from "@clerk/clerk-expo"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AlertModal, type AlertButton } from "../../../AlertModal"

export const SignOutSection: React.FC = () => {
  const { signOut } = useAuth()
  const { bottom } = useSafeAreaInsets()

  const alertButtons: AlertButton[] = [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Sign Out",
      style: "destructive",
      onPress: async () => {
        await signOut()
      },
    },
  ]

  return (
    <YStack paddingBottom={bottom}>
      <Separator marginBottom="$4" />
      <AlertModal
        title="Sign Out"
        message="Are you sure you want to sign out?"
        buttons={alertButtons}
      >
        <Button size="$4" iconAfter={LogOut}>
          Sign Out
        </Button>
      </AlertModal>
    </YStack>
  )
}
