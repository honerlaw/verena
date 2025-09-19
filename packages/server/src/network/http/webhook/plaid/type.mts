import { type Context } from "../../../../context.mjs";

export interface BasePlaidWebHook {
  webhook_type: string;
  webhook_code: string;
}

export type WebhookHandler<T extends BasePlaidWebHook> = (
  hook: T,
  ctx: Context,
) => Promise<boolean>;
