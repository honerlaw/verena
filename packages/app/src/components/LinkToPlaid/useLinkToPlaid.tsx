import { useEffect, useMemo } from "react";
import { create, open } from "react-native-plaid-link-sdk";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReportError } from "@/src/hooks/useReportError";

export function useLinkToPlaid(itemId?: string) {
  const trpc = useTRPC();
  const { report } = useReportError();
  const client = useQueryClient();

  const {
    data,
    error,
    mutateAsync: createLinkToken,
  } = useMutation(trpc.link.create.mutationOptions());
  const { mutateAsync: exchangePublicToken, error: exchangeError } =
    useMutation(trpc.link.exchange.mutationOptions());

  useEffect(() => {
    createLinkToken({
      itemId,
    });
  }, [itemId, createLinkToken]);

  useEffect(() => {
    if (!data?.token) {
      return;
    }
    create({
      token: data.token.link_token,
      noLoadingState: true,
    });
  }, [itemId, data?.token]);

  const token = data?.token?.link_token || null;

  // notify sentry of the error since we want to render nothing if it fails
  useMemo(() => {
    if (!error) {
      return;
    }
    report(error, "Failed to start linking process.");
  }, [error, report]);

  useMemo(() => {
    if (!exchangeError) {
      return;
    }
    report(exchangeError, "Failed to connect accounts.");
  }, [exchangeError, report]);

  const openLink = () => {
    open({
      onSuccess: async (success) => {
        await exchangePublicToken({
          publicToken: success.publicToken,
          accounts: success.metadata.accounts.map((account) => ({
            id: account.id,
            name: account.name,
            mask: account.mask,
            type: account.type,
          })),
        });

        // create a new token for the next time
        await createLinkToken({
          itemId,
        });

        // trigger everything to refetch
        client.invalidateQueries();
      },
      onExit: async ({ error }) => {
        if (error) {
          return report(error, "Failed to link accounts.");
        }

        // create a new token for the next time
        await createLinkToken({
          itemId,
        });
      },
    });
  };

  return {
    // this is to match the contract with web
    ready: true,
    error,
    token,
    openLink,
  };
}
