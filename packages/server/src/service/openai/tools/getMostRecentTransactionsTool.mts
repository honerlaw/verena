import { RunContext, tool } from "@openai/agents";
import type { Context } from "../../../context.mjs";
import type { Transaction } from "plaid";

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
  const itemTransactions = await context.service.transactions.getAll(context);

  if (!itemTransactions || itemTransactions.length === 0) {
    return "No transactions found.";
  }

  // Format as tabular data for LLM consumption with Plaid transaction structure
  const tableHeader =
    "| Date | Transaction ID | Name | Amount | Category | Personal Finance Category | Account ID | Transaction Type |";
  const tableSeparator =
    "|------|----------------|------|--------|----------|---------------------------|------------|------------------|";

  const filteredTransactions = itemTransactions.filter(
    (t) => t !== null && t !== undefined,
  );

  const tableRows = filteredTransactions
    .map((itemTransaction) => {
      try {
        // Parse the stored transaction bytes back to Plaid Transaction object
        const plaidTransaction: Transaction = JSON.parse(
          Buffer.from(itemTransaction.transaction).toString(),
        );

        const date = plaidTransaction.date;
        const transactionId = plaidTransaction.transaction_id;
        const name =
          plaidTransaction.name ||
          plaidTransaction.original_description ||
          "N/A";
        const amount = `$${Math.abs(plaidTransaction.amount).toFixed(2)}`;
        const category = plaidTransaction.category
          ? plaidTransaction.category.join(", ")
          : "N/A";
        const personalFinanceCategory =
          plaidTransaction.personal_finance_category?.primary || "N/A";
        const accountId = plaidTransaction.account_id;
        const transactionType = plaidTransaction.transaction_type || "N/A";

        return `| ${date} | ${transactionId} | ${name} | ${amount} | ${category} | ${personalFinanceCategory} | ${accountId} | ${transactionType} |`;
      } catch (error) {
        context.logger.error(
          {
            error,
            attributes: {
              transactionId: itemTransaction.transactionId,
            },
            tags: ["service", "openai", "tools", "getMostRecentTransactions"],
          },
          "Failed to parse transaction data",
        );
        return `| - | ${itemTransaction.transactionId} | Parse Error | - | - | - | - | - |`;
      }
    })
    .join("\n");

  return `${tableHeader}\n${tableSeparator}\n${tableRows}`;
}
