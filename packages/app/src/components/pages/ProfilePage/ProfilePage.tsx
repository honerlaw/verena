import React from "react";
import { ScrollView } from "react-native";
import { YStack } from "tamagui";
import { UserInfo } from "@/src/components/pages/ProfilePage/UserInfo";
import { ConnectionList } from "@/src/components/pages/ProfilePage/ConnectionList";
import { DeleteAccountSection } from "@/src/components/pages/ProfilePage/DeleteAccountSection";
import { SignOutSection } from "@/src/components/pages/ProfilePage/SignOutSection";

export const ProfilePage: React.FC = () => {
  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <UserInfo />
        <ConnectionList />
        <DeleteAccountSection />
      </ScrollView>
      <SignOutSection />
    </YStack>
  );
};
