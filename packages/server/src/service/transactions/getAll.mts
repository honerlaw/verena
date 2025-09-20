import type { Context } from "../../context.mjs";

export async function getAll(context: Context) {
  if (!context.auth.user) {
    context.logger.error(
      {
        tags: ["service", "transactions", "getAll"],
      },
      "User not found",
    );
    return null;
  }

  return await context.database.items.transactions.getAllByUserID(
    context.auth.user.id,
  );
}
