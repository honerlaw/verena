import { useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useReportError } from "@/src/hooks/useReportError";
import { Plaid, usePlaidLink } from "react-plaid-link";
import { useToastController } from "@tamagui/toast";

export function useLinkToPlaid(itemId?: string) {
  const trpc = useTRPC();
  const client = useQueryClient();
  const { report } = useReportError();
  const toast = useToastController();
  const { data, mutateAsync: createLinkToken } = useMutation(
    trpc.link.create.mutationOptions(),
  );
  const { mutateAsync: exchangePublicToken } = useMutation(
    trpc.link.exchange.mutationOptions(),
  );

  const token = data?.token?.link_token || null;

  // this is also web only, so we shouldn't call it unless we are on the web platform
  const {
    open,
    ready,
    error: plaidError,
  } = usePlaidLink({
    token,
    // @todo the second argument is a metadata object so we could
    // display data right away technically
    onSuccess: async (publicToken, metadata) => {
      try {
        await exchangePublicToken({
          publicToken,
          accounts: metadata.accounts.map((account) => ({
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
    onExit: async (error) => {
      if (error) {
        return report(error, error.display_message);
      }
    },
  });

  useMemo(() => {
    if (!plaidError) {
      return;
    }
    report(plaidError, "Failed to start linking process.");
  }, [plaidError, report]);

  useEffect(() => {
    if (ready) {
      open();
    }
  }, [ready, open]);

  return {
    openLink: async () => {
      try {
        await createLinkToken({
          itemId,
        });
      } catch (error) {
        report(error, "Failed to create link token.");
      }
    },
  };
}
