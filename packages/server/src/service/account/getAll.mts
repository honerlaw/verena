import type { Context } from "../../context.mjs";

export async function getAll(context: Context) {
  if (!context.auth.user) {
    context.logger.error(
      {
        tags: ["service", "account", "getAll"],
      },
      "User not found",
    );
    return null;
  }

  const items = await context.database.items.getByUserId(context.auth.user.id);
  const results = await Promise.all(
    items?.map(async (item) => {
      return await context.datasource.plaid.account.get(item.token);
    }) ?? [],
  );

  return results.flat().filter((account) => account !== null);
}
