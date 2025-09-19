import { procedure } from "../../router.mjs";

const GENERIC_PROMPTS = [
  {
    title: "Financial Overview",
    prompt:
      "Please provide a summary of my current financial situation including account balances, recent transactions, and any notable spending patterns.",
  },
  {
    title: "Monthly Budget Analysis",
    prompt:
      "Analyze my spending from the past month and help me create a budget for the upcoming month based on my income and expenses.",
  },
  {
    title: "Investment Advice",
    prompt:
      "Based on my current financial situation and goals, what investment opportunities would you recommend for me?",
  },
  {
    title: "Debt Management",
    prompt:
      "Help me understand my current debt situation and create a plan to pay off my debts efficiently.",
  },
  {
    title: "Savings Goals",
    prompt:
      "Help me set realistic savings goals and create a plan to achieve them based on my current income and expenses.",
  },
];

const PROMPTS = [
  {
    title: "Spend Overview (This Month)",
    prompt:
      "Where did my money go this month? Summarize top 5 categories and merchants for [MONTH].",
  },

  {
    title: "Top Savings Moves",
    prompt:
      "What 3 actions would most improve my savings rate next month given my recent spending?",
  },

  {
    title: "Subscription Cleanup",
    prompt:
      "Find waste: list subscriptions I could cancel or downgrade, with estimated monthly savings.",
  },

  {
    title: "50/30/20 Budget Fit",
    prompt:
      "Build a 50/30/20 budget from my last 90 days and show where I’m off target.",
  },

  {
    title: "Emergency Fund Plan",
    prompt:
      "I want a 6-month emergency fund. How much do I need and what’s a realistic 90-day plan to start?",
  },

  {
    title: "Debt Payoff Strategy",
    prompt:
      "Optimize debt: given my balances and APRs, choose avalanche vs. snowball and show a payoff timeline.",
  },

  {
    title: "Card Rewards Optimization",
    prompt:
      "Compare cards: which of my credit cards should I use for groceries, dining, and travel to maximize rewards?",
  },

  {
    title: "Cash Flow Anomalies",
    prompt:
      "Cash flow check: any recurring charges that increased vs last month? Flag anomalies over $[AMOUNT].",
  },

  {
    title: "Move Cash to HYSA?",
    prompt:
      "Should I move excess checking to HYSA? Calculate opportunity cost and a safe transfer amount.",
  },

  {
    title: "What-If Savings Impact",
    prompt:
      "What-if: if I cut dining by 20% and entertainment by 15%, how does that change my savings by [DATE]?",
  },

  {
    title: "Next Paycheck Allocation",
    prompt:
      "Create a paycheck plan: allocate my next paycheck across bills, savings, investments, and fun money.",
  },

  {
    title: "Year-to-Date Trend Check",
    prompt:
      "Year-to-date view: are my expenses trending up or down vs. last year? Call out 3 notable shifts.",
  },

  {
    title: "Tax-Aware Opportunities",
    prompt:
      "Tax-aware moves: based on my transactions, suggest 3 deductions/adjustments I might be missing.",
  },

  {
    title: "Starter Investment Plan",
    prompt:
      "Investment basics: with $[AMOUNT]/month, propose a simple diversified portfolio and auto-transfer plan.",
  },

  {
    title: "Goal Backplan",
    prompt:
      "Goal drilldown: I want $[AMOUNT] for [GOAL] by [DATE]. Outline monthly targets and tradeoffs.",
  },

  {
    title: "Bill Timing Smoother",
    prompt:
      "Bill timing: reorder payment dates to reduce cash crunches and avoid overdraft risk.",
  },

  {
    title: "Merchant Audit",
    prompt:
      "Merchant audit: show my top 10 merchants by spend and one actionable change for each.",
  },

  {
    title: "Healthy Spend Benchmarks",
    prompt:
      "Healthy ranges: benchmark my housing, transport, and food spend vs. recommended percentages.",
  },

  {
    title: "Five Quick Wins",
    prompt:
      "Quick wins: list five 10-minute actions I can take today to improve my finances.",
  },

  {
    title: "Explain My Savings Rate",
    prompt:
      "Explain like I’m 5: why is my savings rate only [X]% and what’s the simplest way to raise it next month?",
  },
];

export const list = procedure.query(async () => {
  return {
    prompts: [...GENERIC_PROMPTS, ...PROMPTS].map((prompt, index) => {
      return {
        id: index.toString(),
        title: prompt.title,
        prompt: prompt.prompt,
      };
    }),
  };
});
