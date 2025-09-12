import React from "react"
import { YStack } from "tamagui"
import { UserInfo } from "@/src/components/pages/ProfilePage/UserInfo"
import { DeleteAccountSection } from "@/src/components/pages/ProfilePage/DeleteAccountSection"
import { SignOutSection } from "@/src/components/pages/ProfilePage/SignOutSection"

export const ProfilePage: React.FC = () => {
  return (
    <YStack flex={1} padding="$4" gap="$4" backgroundColor="$background">
      <YStack flex={1} gap="$4">
        <UserInfo />
        <DeleteAccountSection />
      </YStack>
      <SignOutSection />
    </YStack>
  )
}
