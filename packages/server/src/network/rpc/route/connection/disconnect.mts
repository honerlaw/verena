import {
  InternalServerError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";
import { z } from "zod";

const DisconnectConnectionSchema = z.object({
  connectionId: z.string().min(1, "Connection ID is required"),
});

export const disconnect = procedure
  .input(DisconnectConnectionSchema)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.auth.user) {
      throw new UnauthorizedError();
    }

    const { connectionId } = input;

    const client =
      await ctx.service.sessionToken.getGraphQLClientByAuthContext(ctx);
    if (!client) {
      throw new InternalServerError("Failed to create graphql client");
    }

    // Call the disconnectConnection function from quiltt GraphQL datasource
    const result = await ctx.datasource.quilttGraphQL.disconnectConnection(
      client,
      connectionId,
    );

    if (!result) {
      throw new InternalServerError("Failed to disconnect connection");
    }

    return {
      success: true,
    };
  });
