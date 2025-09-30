import { useCallback } from "react";
import { create, open } from "react-native-plaid-link-sdk";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReportError } from "@/src/hooks/useReportError";
import { useToastController } from "@tamagui/toast";

// @todo refactor this so that the create is called on button click
export function useLinkToPlaid(itemId?: string) {
  const trpc = useTRPC();
  const { report } = useReportError();
  const client = useQueryClient();
  const toast = useToastController();

  const { mutateAsync: createLinkToken } = useMutation(
    trpc.link.create.mutationOptions(),
  );
  const { mutateAsync: exchangePublicToken } = useMutation(
    trpc.link.exchange.mutationOptions(),
  );

  const createToken = useCallback(async () => {
    try {
      return await createLinkToken({
        itemId,
      });
    } catch (error) {
      report(error, "Failed to create link token.");
    }
    return null;
  }, [createLinkToken, itemId, report]);

  const openLink = async () => {
    const token = await createToken();
    if (!token || !token.token) {
      return;
    }

    create({
      token: token.token.link_token,
    });

    open({
      onSuccess: async (success) => {
        try {
          await exchangePublicToken({
            publicToken: success.publicToken,
            accounts: success.metadata.accounts.map((account) => ({
              id: account.id,
              name: account.name,
              mask: account.mask,
              type: account.type,
            })),
          });
          toast.show("Successfully linked accounts.", {
            type: "success",
          });

          // trigger everything to refetch
          client.invalidateQueries();
        } catch (error) {
          report(error, "Failed to connect accounts.");
        }
      },
      onExit: async ({ error }) => {
        if (error) {
          return report(error, error.displayMessage);
        }

        // create a new token for the next time
        await createLinkToken({
          itemId,
        });
      },
    });
  };

  return {
    openLink,
  };
}
