import React, { createContext, useCallback, useContext } from "react";
import { useReportError } from "@/src/hooks/useReportError";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useMutation } from "@tanstack/react-query";
import { useConversationList } from "../ConversationListProvider";
import { useConversationCurrent } from "../ConversationCurrentProvider";

type ConversationRemoveContextType = {
  remove: (conversationId: string) => Promise<boolean>;
};

const ConversationRemoveContext =
  createContext<ConversationRemoveContextType | null>(null);

export const useConversationRemove = () => {
  const context = useContext(ConversationRemoveContext);
  if (!context) {
    throw new Error(
      "useConversationRemove must be used within a ConversationRemoveProvider",
    );
  }
  return context;
};

export const ConversationRemoveProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { currentConversationId, setCurrentConversationId } =
    useConversationCurrent();
  const { refetch: refetchConversations } = useConversationList();
  const { report } = useReportError();
  const trpc = useTRPC();

  // Remove conversation mutation
  const { mutateAsync: removeConversation } = useMutation(
    trpc.conversation.remove.mutationOptions(),
  );

  const remove = useCallback(
    async (conversationId: string): Promise<boolean> => {
      try {
        // Remove the conversation
        await removeConversation({ conversationId });

        // If we're removing the current conversation, clear the current conversation ID
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
        }

        // Refetch conversations to update the list
        refetchConversations();

        return true;
      } catch (err) {
        report(err, "Failed to delete conversation.");
        return false;
      }
    },
    [
      currentConversationId,
      removeConversation,
      refetchConversations,
      setCurrentConversationId,
      report,
    ],
  );

  const value: ConversationRemoveContextType = {
    remove,
  };

  return (
    <ConversationRemoveContext.Provider value={value}>
      {children}
    </ConversationRemoveContext.Provider>
  );
};
