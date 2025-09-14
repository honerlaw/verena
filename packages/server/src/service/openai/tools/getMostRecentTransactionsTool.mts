import { RunContext, tool } from "@openai/agents";
import type { Context } from "../../../context.mjs";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  account: string;
}

const TransactionDataParams = {
  type: "object" as const,
  properties: {},
  required: [],
  additionalProperties: true as const,
};

export const getMostRecentTransactionsTool = tool({
  strict: false,
  name: "get_most_recent_transactions",
  description:
    "Retrieve user's most recent financial transaction data in a tabular format for analysis or viewing. Returns transactions with details like date, amount, category, and description.",
  parameters: TransactionDataParams,
  execute: async (params: unknown, context?: RunContext<Context>) => {
    try {
      if (!context) {
        throw new Error("Context is required");
      }
      return await executeGetMostRecentTransactions(context.context);
    } catch (error) {
      context?.context.logger.error(
        {
          error,
          attributes: {
            params,
          },
        },
        "Error executing get transaction data tool",
      );
      throw error;
    }
  },
});

async function executeGetMostRecentTransactions(
  context: Context,
): Promise<string> {
  const transactions =
    await context.service.root.getMostRecentTransactions(context);

  if (!transactions) {
    return "No transactions found.";
  }

  // Format as tabular data for LLM consumption
  const tableHeader = "| Date | Description | Kind | Amount | Type | Account |";
  const tableSeparator =
    "|------|-------------|----------|---------|------|---------|";

  const filteredTransactions = transactions.filter(
    (t) => t !== null && t !== undefined,
  );

  const tableRows = filteredTransactions
    .map(
      (t) =>
        `| ${t.date} | ${t.description} | ${t.kind} | $${t.amount.toFixed(2)} | ${t.entryType} | ${t.account.name} |`,
    )
    .join("\n");

  const table = `${tableHeader}\n${tableSeparator}\n${tableRows}`;

  console.log(table);

  return table;
}
