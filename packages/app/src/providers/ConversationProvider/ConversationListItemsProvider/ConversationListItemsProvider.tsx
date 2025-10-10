import React, { createContext, useContext, useEffect } from "react";
import { useConversationCurrent } from "../ConversationCurrentProvider";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useReportError } from "@/src/hooks/useReportError";
import { useQuery } from "@tanstack/react-query";
import { type AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs";

export type ConversationItem =
  AppRouter["conversation"]["items"]["_def"]["$types"]["output"]["items"][number];

type ConversationListItemsContextType = {
  conversationId: string | null | undefined;
  items: ConversationItem[];
  isLoading: boolean;
};

const ConversationListItemsContext =
  createContext<ConversationListItemsContextType | null>(null);

export const useConversationListItems = () => {
  const context = useContext(ConversationListItemsContext);
  if (!context) {
    throw new Error(
      "useConversationListItems must be used within a ConversationListItemsProvider",
    );
  }
  return context;
};

export const ConversationListItemsProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const { currentConversationId } = useConversationCurrent();

  const trpc = useTRPC();
  const { report } = useReportError();

  // Fetch conversation items only if conversationId is provided
  const { data, error, refetch, isLoading, isFetching } = useQuery({
    ...trpc.conversation.items.queryOptions({
      conversationId: currentConversationId!,
    }),
    enabled: !!currentConversationId, // Only fetch if conversationId exists
  });

  const items: ConversationItem[] = data?.items || [];

  useEffect(() => {
    if (error) {
      report(error);
    }
  }, [error, report]);

  // Refetch items whenever currentConversationId changes
  useEffect(() => {
    if (currentConversationId) {
      refetch();
    }
  }, [currentConversationId, refetch]);

  const value: ConversationListItemsContextType = {
    isLoading: isLoading || isFetching,
    conversationId: data?.conversationId,
    items,
  };

  return (
    <ConversationListItemsContext.Provider value={value}>
      {children}
    </ConversationListItemsContext.Provider>
  );
};
