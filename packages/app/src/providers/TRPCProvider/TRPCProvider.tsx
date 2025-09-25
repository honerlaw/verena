import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";

import { useAuth } from "@clerk/clerk-expo";
import superjson from "superjson";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs";
import { useConfig } from "@/src/providers/ConfigProvider";
import { useReportError } from "@/src/hooks/useReportError";

const context = createTRPCContext<AppRouter>();

const TRPCContextProvider = context.TRPCProvider;

export const useTRPC = context.useTRPC;

export const TRPCProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const config = useConfig();
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());
  const { report } = useReportError();

  const getHeaders = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        return {};
      }
      return {
        Authorization: `Bearer ${token}`,
      };
    } catch (err) {
      report(err);
      return {};
    }
  }, [getToken, report]);

  const options = useMemo(
    () => ({
      links: [
        loggerLink(),
        httpBatchLink({
          transformer: superjson,
          // this needs to be in a string template otherwise metro will compile it with \"
          // wrapped around it, causing it to fail
          url: `${config.baseUrl}${config.trpcRelativeUrl}`,
          async headers() {
            return await getHeaders();
          },
        }),
      ],
    }),
    [getHeaders, config],
  );
  const trpcClient = useMemo(
    () => createTRPCClient<AppRouter>(options),
    [options],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCContextProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCContextProvider>
    </QueryClientProvider>
  );
};
