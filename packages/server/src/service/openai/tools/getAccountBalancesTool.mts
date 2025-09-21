import { RunContext, tool } from "@openai/agents";
import type { Context } from "../../../context.mjs";

export interface AccountBalance {
  id: string;
  name: string;
  available: number | null;
  current: number | null;
  limit: number | null;
  balanceAt: string;
}

const AccountBalanceDataParams = {
  type: "object" as const,
  properties: {},
  required: [],
  additionalProperties: true as const,
};

export const getAccountBalancesTool = tool({
  strict: false,
  name: "get_account_balances",
  description:
    "Retrieve user's current account balances in a tabular format for analysis or viewing. Returns account balances with details like account name, available balance, current balance, and credit limits.",
  parameters: AccountBalanceDataParams,
  execute: async (params: unknown, context?: RunContext<Context>) => {
    try {
      if (!context) {
        throw new Error("Context is required");
      }
      return await executeGetAccountBalances(context.context);
    } catch (error) {
      context?.context.logger.error(
        {
          error,
          attributes: {
            params,
          },
        },
        "Error executing get account balances tool",
      );
      return "Error executing, no accounts found.";
    }
  },
});

async function executeGetAccountBalances(context: Context): Promise<string> {
  const accounts = await context.service.account.getAll(context);

  if (!accounts || accounts.length === 0) {
    return "No accounts found.";
  }

  // Format as tabular data for LLM consumption
  const tableHeader =
    "| Account Name | Account Type | Available Balance | Current Balance | Credit Limit | Balance As Of |";
  const tableSeparator =
    "|--------------|-------------------|-----------------|--------------|---------------|";

  const filteredAccounts = accounts.filter(
    (account) => account !== null && account !== undefined,
  );

  const tableRows = filteredAccounts
    .map((account) => {
      const availableBalance = account.balances.available
        ? `$${account.balances.available.toFixed(2)}`
        : "N/A";
      const currentBalance = account.balances.current
        ? `$${account.balances.current.toFixed(2)}`
        : "N/A";
      const creditLimit = account.balances.limit
        ? `$${account.balances.limit.toFixed(2)}`
        : "N/A";
      const balanceAt = account.balances.last_updated_datetime
        ? new Date(account.balances.last_updated_datetime).toLocaleDateString()
        : "N/A";

      return `| ${account.name} | ${account.type} | ${availableBalance} | ${currentBalance} | ${creditLimit} | ${balanceAt} |`;
    })
    .join("\n");

  return `${tableHeader}\n${tableSeparator}\n${tableRows}`;
}
