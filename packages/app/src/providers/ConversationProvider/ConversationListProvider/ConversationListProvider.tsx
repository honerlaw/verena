import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { type AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs";

export type Conversation =
  AppRouter["conversation"]["list"]["_def"]["$types"]["output"]["conversations"][number];

type ConversationListContextType = {
  conversations: Conversation[];
  refetch: () => void;
  isLoading: boolean;
  error: unknown | null;
};

const ConversationListContext =
  createContext<ConversationListContextType | null>(null);

export const useConversationList = () => {
  const context = useContext(ConversationListContext);
  if (!context) {
    throw new Error(
      "useConversationList must be used within a ConversationListProvider",
    );
  }
  return context;
};

export const ConversationListProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const trpc = useTRPC();

  // Fetch all conversations
  const { data, error, isLoading, refetch } = useQuery(
    trpc.conversation.list.queryOptions(),
  );

  const conversations: Conversation[] = data?.conversations || [];

  const value: ConversationListContextType = {
    conversations,
    refetch,
    isLoading,
    error,
  };

  return (
    <ConversationListContext.Provider value={value}>
      {children}
    </ConversationListContext.Provider>
  );
};
