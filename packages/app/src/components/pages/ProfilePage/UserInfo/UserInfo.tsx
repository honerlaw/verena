import React from "react";
import { YStack, XStack, Text, Separator } from "tamagui";
import { useAuth } from "@/src/hooks/useAuth";
import { Avatar } from "./Avatar";
import { LoadingView } from "../../../LoadingView";
import { EmptyView } from "../../../EmptyView";

export const UserInfo: React.FC = () => {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingView />;
  }

  if (!user) {
    return <EmptyView />;
  }

  const email =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress;
  const displayName =
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    email?.split("@")[0];

  if (!email) {
    return <EmptyView />;
  }

  return (
    <YStack
      padding="$4"
      alignItems="center"
      gap="$4"
      backgroundColor="$background"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <XStack alignItems="center" gap="$4">
        <Avatar name={displayName} />
        <YStack gap="$2" flex={1}>
          <Text fontSize="$4" fontWeight="600" color="$color">
            {displayName}
          </Text>
          <Text fontSize="$3" color="$gray11" fontWeight={"600"}>
            {email}
          </Text>
        </YStack>
      </XStack>
      <Separator width={"100%"} />
      {email && (
        <Text fontSize="$3" color="$gray10" textAlign="center">
          Signed in as {email}
        </Text>
      )}
    </YStack>
  );
};
