import { UnauthorizedError } from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";

export const getAll = procedure.query(async ({ ctx }) => {
  if (!ctx.auth.user) {
    throw new UnauthorizedError();
  }

  const items = await ctx.database.items.getByUserId(ctx.auth.user.id);

  const plaidItems = await Promise.all(
    items?.map(async (item) => {
      const plaidItem = await ctx.datasource.plaid.item.get(item.token);

      if (plaidItem === null) {
        return {
          item,
          accounts: [],
          plaid: null,
        };
      }

      // get accounts
      const accounts = await ctx.datasource.plaid.account.get(item.token);

      return {
        plaid: plaidItem,
        item,
        accounts,
      };
    }) ?? [],
  );

  return {
    items: plaidItems.map(({ item, plaid, accounts }) => {
      return {
        itemId: item.itemId,
        status: item.status,
        institutionName: plaid?.item.institution_name ?? null,
        accounts: accounts?.map((account) => {
          return {
            id: account.account_id,
            name: account.name,
          };
        }),
      };
    }),
  };
});
