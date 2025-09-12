import type { Request, Response } from "express";

export const config = (req: Request, res: Response) => {
  res.status(200).json({
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
    muxEnvKey: process.env.APP_MUX_ENV_KEY!,
    trpcRelativeUrl: "/api/trpc",
  });
};
