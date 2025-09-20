import { z } from "zod";
import {
  InternalServerError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { type AccountBase } from "plaid";
import { procedure } from "../../router.mjs";

const exchangePublicTokenMetadataInput = z.object({
  publicToken: z.string(),
  accounts: z.array(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      mask: z.string().optional(),
      type: z.string(),
    }),
  ),
});

// either the public token or metadata and token to detect if its
// a duplicate
const exchangePublicTokenInput = z
  .string()
  .or(exchangePublicTokenMetadataInput);

type ExchangePublicTokenMetadataInput = z.infer<
  typeof exchangePublicTokenMetadataInput
>;

function isExchangePublicTokenMetadataInput(
  input: unknown,
): input is ExchangePublicTokenMetadataInput {
  return exchangePublicTokenMetadataInput.safeParse(input).success;
}

export const exchange = procedure
  .input(exchangePublicTokenInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.auth.user) {
      throw new UnauthorizedError();
    }

    // do the duplicate item check ahead of time, and error if we detect duplicates
    if (isExchangePublicTokenMetadataInput(input)) {
      const items = await ctx.database.items.getByUserId(ctx.auth.user.id);

      // something errored
      if (items === null) {
        throw new InternalServerError("Failed to fetch accounts!");
      }

      // no error, and we have more than one token
      if (items.length > 0) {
        const allAccounts = (
          await Promise.all(
            items.map((item) => ctx.datasource.plaid.account.get(item.token)),
          )
        ).flat();

        const hasFailed = allAccounts.some((account) => account === null);
        if (hasFailed) {
          throw new InternalServerError("Failed to fetch accounts!");
        }

        const accounts = allAccounts.filter(
          (account): account is AccountBase => account !== null,
        );

        const hasDuplicates = accounts.some((account) => {
          return input.accounts.some((inputAccount) => {
            const idMatch = account.account_id === inputAccount.id;
            const otherMatch =
              account.mask === inputAccount.mask &&
              account.name === inputAccount.name &&
              account.type === inputAccount.type;
            return idMatch || otherMatch;
          });
        });

        if (hasDuplicates) {
          throw new InternalServerError(
            "Duplicate account detected! Please remove the existing account link and try again.",
          );
        }
      }
    }

    // otherwise go ahead and exchange the token
    const publicToken = typeof input === "string" ? input : input.publicToken;
    const itemToken = await ctx.datasource.plaid.token.exchange(publicToken);
    if (itemToken === null) {
      throw new InternalServerError("Failed to exchange public token.");
    }
    const added = await ctx.database.items.create(
      ctx.auth.user.id,
      itemToken.itemId,
      itemToken.token,
    );
    if (!added) {
      throw new InternalServerError("Failed to add plaid access token.");
    }

    // run a quick sync
    await ctx.service.transactions.sync(ctx, itemToken.itemId);

    return {
      itemId: itemToken.itemId,
    };
  });
