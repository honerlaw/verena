import { useCallback } from "react";
import {
  create,
  LinkIOSPresentationStyle,
  open,
} from "react-native-plaid-link-sdk";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReportError } from "@/src/hooks/useReportError";
import { useToastController } from "@tamagui/toast";
import { useLoading } from "@/src/providers/LoadingProvider";

// @todo refactor this so that the create is called on button click
export function useLinkToPlaid(itemId?: string) {
  const trpc = useTRPC();
  const { report } = useReportError();
  const client = useQueryClient();
  const toast = useToastController();
  const { showLoading, hideLoading } = useLoading();

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
      report(error, "Failed to connect accounts.");
    }
    return null;
  }, [createLinkToken, itemId, report]);

  const openLink = async () => {
    showLoading();
    const token = await createToken();
    if (!token || !token.token) {
      hideLoading();
      return;
    }

    create({
      token: token.token.link_token,
      noLoadingState: true,
    });

    open({
      iOSPresentationStyle: LinkIOSPresentationStyle.FULL_SCREEN,
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

          toast.show("Successfully connected accounts.", {
            type: "success",
          });

          // trigger everything to refetch
          client.invalidateQueries();
        } catch (error) {
          report(error, "Failed to connect accounts.");
        } finally {
          // hide loading after everything
          // this way the user knows we are doing something
          // instead of the weird blank screen while we are
          // exchanging the token?
          hideLoading();
        }
      },
      onExit: async ({ error }) => {
        hideLoading();
        if (error) {
          return report(error, error.displayMessage);
        }
      },
    });
  };

  return {
    openLink,
  };
}
