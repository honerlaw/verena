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

export type UseMessageReturn = {
  messages: ChatMessage[];
  isSending: boolean;
  sendMessage: (message: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  error: unknown | null;
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => Promise<void>;
  isSendDisabled: boolean;
};
