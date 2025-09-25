import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useReportError } from "@/src/hooks/useReportError";

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

type UseMessageReturn = {
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

export const useMessage = (
  create: (force?: boolean) => Promise<string | null>,
): UseMessageReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [inputText, setInputText] = useState("");

  const trpc = useTRPC();
  const { report } = useReportError();

  const { mutateAsync: getAgentResponse } = useMutation(
    trpc.agent.respond.mutationOptions(),
  );

  const addMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    },
    [setMessages],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (!trimmed || isSending) return;

      setError(null);
      setIsSending(true);

      const userMessage: ChatMessage = {
        id: `${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      // Add user message immediately
      addMessage(userMessage);

      // create the conversation or get the current conversation
      const conversationId = await create();
      if (!conversationId) {
        return;
      }

      try {
        // Get agent response
        const result = await getAgentResponse({
          conversationId,
          message: trimmed,
        });

        const assistantMessage: ChatMessage = {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: result.response,
        };

        addMessage(assistantMessage);
      } catch (err) {
        setError(err);
        report(err, "Failed to send message");

        // Add error message
        const errorMessage: ChatMessage = {
          id: `${Date.now()}-error`,
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your message. Please try again.",
        };
        addMessage(errorMessage);
      } finally {
        setIsSending(false);
      }
    },
    [isSending, addMessage, getAgentResponse, report, create],
  );

  const handleSend = useCallback(async () => {
    setInputText("");
    await sendMessage(inputText);
  }, [inputText, sendMessage]);

  const isSendDisabled = inputText.trim().length === 0 || isSending;

  return {
    messages,
    isSending,
    sendMessage,
    addMessage,
    clearMessages,
    error,
    inputText,
    setInputText,
    handleSend,
    isSendDisabled,
  };
};
