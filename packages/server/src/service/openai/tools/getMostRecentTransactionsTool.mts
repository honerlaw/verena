import { RunContext, tool } from "@openai/agents";
import type { Context } from "../../../context.mjs";
import type { Transaction } from "plaid";
import { parse, isValid } from "date-fns";

type TransactionParams = {
  startDate?: string;
  endDate?: string;
};

const TransactionDataParams: Parameters<typeof tool>["0"]["parameters"] = {
  type: "object" as const,
  properties: {
    startDate: {
      type: "string" as const,
      description:
        "The start date to include in the response in YYYY-MM-DD format",
    },
    endDate: {
      type: "string" as const,
      description:
        "The end date to include in the response in YYYY-MM-DD format",
    },
  },
  required: [],
  additionalProperties: true as const,
};

export const getMostRecentTransactionsTool = tool({
  strict: false,
  name: "get_most_recent_transactions",
  description:
    "Retrieve user's most recent financial transaction data in a tabular format for analysis or viewing. Returns transactions with details like date, amount, category, and description. If no start or end date is specified, it will default to return the last 100 transactions.",
  parameters: TransactionDataParams,
  execute: async (params: unknown, context?: RunContext<Context>) => {
    try {
      if (!context) {
        throw new Error("Context is required");
      }
      return await executeGetMostRecentTransactions(
        context.context,
        (params as TransactionParams) || {},
      );
    } catch (error) {
      context?.context.logger.error(
        {
          error,
          tags: ["service", "openai", "tools", "getMostRecentTransactions"],
          attributes: {
            params,
          },
        },
        "Error executing get transaction data tool",
      );
      return "Error executing, no transactions found.";
    }
  },
});

function parseFlexibleDate(dateString?: string | null): Date | null {
  if (!dateString || typeof dateString !== "string") {
    return null;
  }

  const formats = [
    "yyyy-MM-dd", // ISO standard
    "MM/dd/yyyy", // US format
    "dd/MM/yyyy", // European format
    "MM-dd-yyyy", // US with dashes
    "dd-MM-yyyy", // European with dashes
  ];

  for (const format of formats) {
    const parsed = parse(dateString, format, new Date());
    if (isValid(parsed)) {
      return parsed;
    }
  }

  // Try native Date parse as a fallback (handles ISO and RFC formats)
  const nativeParsed = new Date(dateString);
  if (isValid(nativeParsed)) {
    return nativeParsed;
  }

  return null;
}

async function getTransactionsBasedOnParams(
  context: Context,
  params: TransactionParams,
) {
  const itemTransactions = await context.service.transactions.getAll(context);

  if (!itemTransactions || itemTransactions.length === 0) {
    return [];
  }

  // Sort transactions from most recent to oldest by transaction date
  itemTransactions.sort((a, b) => {
    const dateA = new Date(a.transaction.date);
    const dateB = new Date(b.transaction.date);
    return dateB.getTime() - dateA.getTime();
  });

  // if a start and end date is provided, filter the trnasaction
  const startDate = parseFlexibleDate(params?.startDate);
  const endDate = parseFlexibleDate(params?.endDate);
  if (startDate && endDate) {
    return itemTransactions.filter(
      (t) =>
        new Date(t.transaction.date) >= startDate &&
        new Date(t.transaction.date) <= endDate,
    );
  }

  return itemTransactions.slice(0, 100);
}

async function executeGetMostRecentTransactions(
  context: Context,
  params: TransactionParams,
): Promise<string> {
  const itemTransactions = await getTransactionsBasedOnParams(context, params);

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
        const plaidTransaction: Transaction = itemTransaction.transaction;

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
