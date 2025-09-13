import {
  InternalServerError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";

export const getAll = procedure.query(async ({ ctx }) => {
  if (!ctx.auth.user) {
    throw new UnauthorizedError();
  }

  const client =
    await ctx.service.sessionToken.getGraphQLClientByAuthContext(ctx);
  if (!client) {
    throw new InternalServerError("Failed to create graphql client");
  }

  // Fetch all connections using the existing GraphQL function
  const connections =
    await ctx.datasource.quilttGraphQL.getAllConnections(client);

  if (!connections) {
    throw new InternalServerError("Failed to fetch connections from Quiltt");
  }

  return {
    connections,
  };
});
