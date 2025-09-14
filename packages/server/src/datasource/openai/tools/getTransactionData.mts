import { tool } from "@openai/agents";
import { z } from "zod";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  account: string;
}

export const TransactionDataParamsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().optional(),
  limit: z.number().optional(),
});

type TransactionDataParams = z.infer<typeof TransactionDataParamsSchema>;

export const getTransactionDataTool = tool({
  strict: true,
  name: "get_transaction_data",
  description:
    "Retrieve user's financial transaction data in a tabular format for analysis. Returns transactions with details like date, amount, category, and description.",
  parameters: TransactionDataParamsSchema,
  execute: async (params: TransactionDataParams) => {
    return await executeGetTransactionData(params);
  },
});

async function executeGetTransactionData(
  params: TransactionDataParams,
): Promise<string> {
  const { startDate, endDate, category, limit = 50 } = params;

  // Mock transaction data - in production, this would fetch from your database
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      date: "2024-09-10",
      description: "Grocery Store Purchase",
      category: "food",
      amount: -85.32,
      type: "expense",
      account: "Checking",
    },
    {
      id: "2",
      date: "2024-09-09",
      description: "Salary Deposit",
      category: "income",
      amount: 3200.0,
      type: "income",
      account: "Checking",
    },
    {
      id: "3",
      date: "2024-09-08",
      description: "Gas Station",
      category: "transport",
      amount: -45.67,
      type: "expense",
      account: "Credit Card",
    },
    {
      id: "4",
      date: "2024-09-07",
      description: "Coffee Shop",
      category: "food",
      amount: -12.5,
      type: "expense",
      account: "Credit Card",
    },
    {
      id: "5",
      date: "2024-09-06",
      description: "Movie Theater",
      category: "entertainment",
      amount: -28.75,
      type: "expense",
      account: "Credit Card",
    },
    {
      id: "6",
      date: "2024-09-05",
      description: "Electric Bill",
      category: "utilities",
      amount: -120.0,
      type: "expense",
      account: "Checking",
    },
    {
      id: "7",
      date: "2024-09-04",
      description: "Restaurant Dinner",
      category: "food",
      amount: -65.4,
      type: "expense",
      account: "Credit Card",
    },
    {
      id: "8",
      date: "2024-09-03",
      description: "Freelance Payment",
      category: "income",
      amount: 500.0,
      type: "income",
      account: "Checking",
    },
    {
      id: "9",
      date: "2024-09-02",
      description: "Uber Ride",
      category: "transport",
      amount: -18.25,
      type: "expense",
      account: "Credit Card",
    },
    {
      id: "10",
      date: "2024-09-01",
      description: "Subscription Service",
      category: "entertainment",
      amount: -15.99,
      type: "expense",
      account: "Credit Card",
    },
    {
      id: "11",
      date: "2024-08-31",
      description: "ATM Withdrawal",
      category: "cash",
      amount: -100.0,
      type: "expense",
      account: "Checking",
    },
    {
      id: "12",
      date: "2024-08-30",
      description: "Pharmacy",
      category: "health",
      amount: -32.15,
      type: "expense",
      account: "Credit Card",
    },
    {
      id: "13",
      date: "2024-08-29",
      description: "Online Shopping",
      category: "shopping",
      amount: -89.99,
      type: "expense",
      account: "Credit Card",
    },
    {
      id: "14",
      date: "2024-08-28",
      description: "Bank Interest",
      category: "income",
      amount: 2.5,
      type: "income",
      account: "Savings",
    },
    {
      id: "15",
      date: "2024-08-27",
      description: "Rent Payment",
      category: "housing",
      amount: -1200.0,
      type: "expense",
      account: "Checking",
    },
  ];

  // Apply filters
  let filteredTransactions = mockTransactions;

  if (startDate) {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.date >= startDate,
    );
  }

  if (endDate) {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.date <= endDate,
    );
  }

  if (category) {
    filteredTransactions = filteredTransactions.filter((t) =>
      t.category.toLowerCase().includes(category.toLowerCase()),
    );
  }

  // Apply limit
  filteredTransactions = filteredTransactions.slice(0, limit);

  // Format as tabular data for LLM consumption
  const tableHeader =
    "| Date | Description | Category | Amount | Type | Account |";
  const tableSeparator =
    "|------|-------------|----------|---------|------|---------|";

  const tableRows = filteredTransactions
    .map(
      (t) =>
        `| ${t.date} | ${t.description} | ${t.category} | $${t.amount.toFixed(2)} | ${t.type} | ${t.account} |`,
    )
    .join("\n");

  const summary = `\n\n**Summary:**
- Total transactions: ${filteredTransactions.length}
- Total income: $${filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
    .toFixed(2)}
- Total expenses: $${Math.abs(filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
- Net: $${filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}`;

  return `${tableHeader}\n${tableSeparator}\n${tableRows}${summary}`;
}
