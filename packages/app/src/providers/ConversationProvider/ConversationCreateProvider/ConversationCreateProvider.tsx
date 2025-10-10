import React, { createContext, useContext, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useReportError } from "@/src/hooks/useReportError";
import { useConversationCurrent } from "../ConversationCurrentProvider";
import { useConversationList } from "../ConversationListProvider";

type ConversationCreateContextType = {
  create: (force?: boolean) => Promise<string | null>;
};

const ConversationCreateContext =
  createContext<ConversationCreateContextType | null>(null);

export const useConversationCreate = (): ConversationCreateContextType => {
  const context = useContext(ConversationCreateContext);
  if (!context) {
    throw new Error(
      "useConversationCreate must be used within a ConversationCreateProvider",
    );
  }
  return context;
};

export const ConversationCreateProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { currentConversationId, setCurrentConversationId } =
    useConversationCurrent();
  const { refetch: refetchConversations } = useConversationList();
  const { report } = useReportError();
  const trpc = useTRPC();

  // Create conversation mutation
  const { mutateAsync } = useMutation(
    trpc.conversation.create.mutationOptions(),
  );

  const create = useCallback(
    async (force: boolean = false): Promise<string | null> => {
      try {
        // If we already have a current conversation ID, return it
        if (!force && currentConversationId) {
          return currentConversationId;
        }

        // Create a new conversation
        const result = await mutateAsync();
        const newConversationId = result.conversation.conversationId;

        // Set it as the current conversation
        setCurrentConversationId(newConversationId);

        // Refetch conversations to include the new one
        refetchConversations();

        return newConversationId;
      } catch (err) {
        report(err);
        return null;
      }
    },
    [
      currentConversationId,
      mutateAsync,
      refetchConversations,
      setCurrentConversationId,
      report,
    ],
  );

  const value: ConversationCreateContextType = {
    create,
  };

  return (
    <ConversationCreateContext.Provider value={value}>
      {children}
    </ConversationCreateContext.Provider>
  );
};
