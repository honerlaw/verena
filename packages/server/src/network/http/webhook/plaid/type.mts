import { type Context } from "../../../../context.mjs";

export type BasePlaidWebHook = {
  webhook_type: string;
  webhook_code: string;
};

export type WebhookHandler<T extends BasePlaidWebHook> = (
  hook: T,
  ctx: Context,
) => Promise<boolean>;
