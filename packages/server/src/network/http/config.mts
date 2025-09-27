import type { Request, Response } from "express";
import { getConfig } from "../../util/config.mjs";

export const config = async (req: Request, res: Response) => {
  const CLERK_PUBLISHABLE_KEY = await getConfig("CLERK_PUBLISHABLE_KEY");
  const APP_MUX_ENV_KEY = await getConfig("APP_MUX_ENV_KEY");

  res.status(200).json({
    clerkPublishableKey: CLERK_PUBLISHABLE_KEY,
    muxEnvKey: APP_MUX_ENV_KEY,
    trpcRelativeUrl: "/api/trpc",
  });
};
