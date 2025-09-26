import { useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useReportError } from "@/src/hooks/useReportError";
import { usePlaidLink } from "react-plaid-link";

export function useLinkToPlaid(itemId?: string) {
  const trpc = useTRPC();
  const client = useQueryClient();
  const { report } = useReportError();
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

  const token = data?.token?.link_token || null;

  // this is also web only, so we shouldn't call it unless we are on the web platform
  const { open, ready, error: plaidError } = usePlaidLink({
    token,
    // @todo the second argument is a metadata object so we could
    // display data right away technically
    onSuccess: async (publicToken, metadata) => {
      await exchangePublicToken({
        publicToken,
        accounts: metadata.accounts.map((account) => ({
          id: account.id,
          name: account.name,
          mask: account.mask,
          type: account.type,
        })),
      });

      // trigger everything to refetch
      client.invalidateQueries();
    },
  });

  useMemo(() => {
    if (!plaidError) {
      return;
    }
    report(plaidError, "Failed to start linking process.");
  }, [plaidError, report]);

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

  return {
    ready,
    error,
    token,
    openLink: open,
  };
}
