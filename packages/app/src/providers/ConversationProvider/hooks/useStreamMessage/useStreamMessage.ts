import { useCallback, useMemo, useState } from "react";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useReportError } from "@/src/hooks/useReportError";
import { useSubscription } from "@trpc/tanstack-react-query";
import { ChatMessage, UseMessageReturn } from "./types";

/**
 * Good news we are streaming back messages as we receive them!
 *
 * However, we need to make sure we concatenate everything into one message, not add a bunch of messages
 * @returns
 */
export const useStreamMessage = (
  create: (force?: boolean) => Promise<string | null>,
): UseMessageReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [inputText, setInputText] = useState("");
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [currentMessageContent, setCurrentMessageContent] = useState<
    string | null
  >(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  const trpc = useTRPC();
  const { report } = useReportError();

  const isSubscriptionEnabled = useMemo(() => {
    return (
      !!currentConversationId &&
      currentMessage !== null &&
      currentMessage.trim().length > 0 &&
      isSending
    );
  }, [currentConversationId, currentMessage, isSending]);

  useSubscription(
    trpc.agent.stream.subscriptionOptions(
      {
        conversationId: currentConversationId,
        message: currentMessage,
      },
      {
        enabled: isSubscriptionEnabled,
        onData: (data) => {
          if (data.type === "CHUNK" && data.text) {
            setCurrentMessageContent((prev) =>
              prev ? prev + data.text : data.text,
            );
          }
          if (data.type === "COMPLETE") {
            if (currentMessageContent) {
              addMessage({
                id: `${Date.now()}-assistant`,
                role: "assistant",
                content: currentMessageContent,
              });
            }

            setIsSending(false);
            setCurrentMessage(null);
            setCurrentMessageContent(null);
          }
          if (data.type === "ERROR") {
            if (currentMessageContent) {
              addMessage({
                id: `${Date.now()}-assistant`,
                role: "assistant",
                content: currentMessageContent,
              });
            }
            setIsSending(false);
            setCurrentMessage(null);
            setCurrentMessageContent(null);
            setError(new Error("Failed to send message."));
          }
        },
        onError: (error) => {
          setError(error);
          setIsSending(false);
          setCurrentMessage(null);
          setCurrentMessageContent(null);
          report(error, "Failed to send message.");

          addMessage({
            id: `${Date.now()}-error`,
            role: "assistant",
            content:
              "Sorry, I encountered an error processing your message. Please try again.",
          });
        },
      },
    ),
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
      if (!trimmed || isSending) {
        return;
      }

      setError(null);
      setIsSending(true);
      setCurrentMessage(trimmed);

      const userMessage: ChatMessage = {
        id: `${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      // Add user message immediately
      addMessage(userMessage);

      // create the conversation or get the existing one
      const conversationId = await create();
      if (!conversationId) {
        setIsSending(false);
        return;
      }
      setCurrentConversationId(conversationId);
    },
    [isSending, addMessage],
  );

  const handleSend = useCallback(async () => {
    setInputText("");
    await sendMessage(inputText);
  }, [inputText, sendMessage]);

  const isSendDisabled = isSending || inputText.trim().length === 0;

  return {
    messages: currentMessageContent
      ? [
          ...messages,
          {
            id: `stream-response`,
            role: "assistant",
            content: currentMessageContent,
          },
        ]
      : messages,
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
