import React from "react";
import { YStack, Text, Button } from "tamagui";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useReportError } from "@/src/hooks/useReportError";
import { useAuth } from "@/src/hooks/useAuth";
import { AlertModal } from "@/src/components/AlertModal";

export const DeleteAccountSection: React.FC = () => {
  const trpc = useTRPC();
  const { report } = useReportError();
  const { logout } = useAuth();

  const { mutateAsync: removeUser, isPending } = useMutation(
    trpc.user.remove.mutationOptions(),
  );

  return (
    <YStack
      padding="$4"
      gap="$4"
      backgroundColor="$background"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$red4"
    >
      {/* Heading */}
      <Text fontSize="$3" fontWeight="600" color="$red10">
        Delete account & all data
      </Text>

      {/* Description */}
      <Text fontSize="$3" color="$gray11">
        This permanently deletes all of your data. This cannot be undone.
      </Text>

      {/* Delete Button */}
      <AlertModal
        title="Delete Account"
        message="Are you sure you want to permanently delete your account and all data? This action cannot be undone."
        buttons={[
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete Account",
            style: "destructive",
            onPress: async () => {
              try {
                await removeUser();
                // Sign out the user after successful deletion
                await logout();
              } catch (error) {
                report(error, "Failed to delete account. Please try again.");
              }
            },
          },
        ]}
      >
        <Button
          size="$3"
          backgroundColor="$red9"
          color="$red1"
          disabled={isPending}
          fontWeight={"600"}
          pressStyle={{
            backgroundColor: "$red10",
          }}
          hoverStyle={{
            backgroundColor: "$red10",
          }}
          marginTop="$2"
        >
          {isPending ? "Deleting..." : "Delete account & data"}
        </Button>
      </AlertModal>
    </YStack>
  );
};
