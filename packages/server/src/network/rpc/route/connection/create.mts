import {
  InternalServerError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";
import { z } from "zod";

const CreateConnectionSchema = z.object({
  connectionId: z.string().min(1, "Connection ID is required"),
});

export const create = procedure
  .input(CreateConnectionSchema)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.auth.user) {
      throw new UnauthorizedError();
    }

    const { connectionId } = input;
    const userId = ctx.auth.user.id;

    const newConnection = await ctx.database.connection.create(
      userId,
      connectionId,
    );

    if (!newConnection) {
      throw new InternalServerError("Failed to create connection.");
    }

    return {
      success: true,
      connection: {
        id: newConnection.id,
        userId: newConnection.userId,
        quilttConnectionId: newConnection.quilttConnectionId,
        createdAt: newConnection.createdAt,
        updatedAt: newConnection.updatedAt,
      },
    };
  });
