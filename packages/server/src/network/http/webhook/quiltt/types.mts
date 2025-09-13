import type { components } from "../../../../generated/quiltt.mjs";

export type ConnectionEvent = components["schemas"]["ConnectionEvent"];
export type ProfileEvent = components["schemas"]["ProfileEvent"];
export type AccountEvent = components["schemas"]["AccountEvent"];
export type BalanceEvent = components["schemas"]["BalanceEvent"];
export type StatementEvent = components["schemas"]["StatementEvent"];

export type WebhookEvent =
  | ConnectionEvent
  | ProfileEvent
  | AccountEvent
  | BalanceEvent
  | StatementEvent;

export type WebhookPayload = {
  events: WebhookEvent[];
};
