import type { ContextRequest } from "@onerlaw/framework/backend/context";
import { createContext, type Context } from "../../context.mjs";
import { router } from "./router.mjs";
import * as trpcExpress from "@trpc/server/adapters/express";
import type { User } from "../../util/database.mjs";
import * as userRoutes from "./route/user/index.mjs";
import * as connectionRoutes from "./route/connection/index.mjs";
import * as agentRoutes from "./route/agent/index.mjs";

const appRouter = router({
  user: router(userRoutes),
  connection: router(connectionRoutes),
  agent: router(agentRoutes),
});

export type AppRouter = typeof appRouter;

export const expressTRPCMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: async ({ req }) => {
    return await createContext(req as unknown as ContextRequest<User, Context>);
  },
});
