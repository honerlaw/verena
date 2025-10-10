import React, {
  useMemo,
  useState,
  useCallback,
  useContext,
  createContext,
  useEffect,
} from "react";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { ChatMessage } from "./types";
import { useReportError } from "@/src/hooks/useReportError";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useConversationCreate } from "../ConversationCreateProvider";
import { useConversationCurrent } from "../ConversationCurrentProvider";
import { useConversationListItems } from "../ConversationListItemsProvider";

type ConversationStreamMessageContextType = {
  messages: ChatMessage[];
  isSending: boolean;
  sendMessage: (message: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => Promise<void>;
  isSendDisabled: boolean;
};

export const ConversationStreamMessageContext =
  createContext<ConversationStreamMessageContextType | null>(null);

export const useConversationStreamMessage = () => {
  const context = useContext(ConversationStreamMessageContext);

  if (context === null) {
    throw new Error(
      "useConversationStreamMessage must be used within a ConversationStreamMessageProvider",
    );
  }

  return context;
};

export const ConversationStreamMessageProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const { create } = useConversationCreate();
  const { currentConversationId, setCurrentConversationId } =
    useConversationCurrent();
  const {
    items,
    conversationId: conversationIdFromItems,
    isLoading: isLoadingItems,
  } = useConversationListItems();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [inputText, setInputText] = useState("");
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [currentMessageContent, setCurrentMessageContent] = useState<
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
            report(
              new Error("Failed to send message."),
              "Failed to send message.",
            );
          }
        },
        onError: (error) => {
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
    [isSending, addMessage, create, setCurrentConversationId],
  );

  const handleSend = useCallback(async () => {
    setInputText("");
    await sendMessage(inputText);
  }, [inputText, sendMessage]);

  const isSendDisabled = isSending || inputText.trim().length === 0;

  // items changed, and we have no messages, so add the previous historical messages
  useEffect(() => {
    if (isLoadingItems) {
      return;
    }

    if (messages.length !== 0) {
      return;
    }
    // the history is from a different conversation, so we don't need to add it
    if (conversationIdFromItems !== currentConversationId) {
      return;
    }
    for (const item of items) {
      for (const content of item.content) {
        // we don't handle other message types yet
        if (content.type !== "input_text" && content.type !== "output_text") {
          continue;
        }

        addMessage({
          id: item.id,
          role: item.role,
          content: content.text,
        });
      }
    }
  }, [
    items,
    addMessage,
    currentConversationId,
    conversationIdFromItems,
    isLoadingItems,
    messages,
  ]);

  const value: ConversationStreamMessageContextType = {
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
    inputText,
    setInputText,
    handleSend,
    isSendDisabled,
  };

  return (
    <ConversationStreamMessageContext.Provider value={value}>
      {children}
    </ConversationStreamMessageContext.Provider>
  );
};
