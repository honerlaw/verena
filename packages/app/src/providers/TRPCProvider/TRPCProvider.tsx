import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useCallback, useMemo, useState } from "react"

import {
  useDebounce,
  useSubscribeToEvent,
} from "@onerlaw/framework/frontend/utils/hooks"
import { useAuth } from "@clerk/clerk-expo"
import superjson from "superjson"
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCContext } from "@trpc/tanstack-react-query"
import type { AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs"
import { useConfig } from "@/src/providers/ConfigProvider"

const context = createTRPCContext<AppRouter>()

const TRPCContextProvider = context.TRPCProvider

export const useTRPC = context.useTRPC

export const TRPCProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const config = useConfig()
  const { getToken } = useAuth()
  const [queryClient] = useState(() => new QueryClient())

  // ensure that we reset all of the queries, so that on the next load they are refetched
  // this prevents us showing another user's data to another user when they sign out and
  // back in on the same device
  const reset = useDebounce(async () => {
    await queryClient.invalidateQueries()
    await queryClient.resetQueries()
  }, 10)
  useSubscribeToEvent("signout", async () => {
    reset()
  })

  const getHeaders = useCallback(async () => {
    try {
      const token = await getToken()
      if (!token) {
        return {}
      }
      return {
        Authorization: `Bearer ${token}`,
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return {}
    }
  }, [])

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
            return await getHeaders()
          },
        }),
      ],
    }),
    [getHeaders],
  )
  const trpcClient = useMemo(
    () => createTRPCClient<AppRouter>(options),
    [options],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCContextProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCContextProvider>
    </QueryClientProvider>
  )
}
