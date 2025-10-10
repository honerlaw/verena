export type ChatMessage = {
  id: string;
  role:
    | "user"
    | "assistant"
    | "unknown"
    | "discriminator"
    | "developer"
    | "system"
    | "tool"
    | "critic";
  content: string;
};
