import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { type AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs";
import { useReportError } from "@/src/hooks/useReportError";

export type Conversation =
  AppRouter["conversation"]["list"]["_def"]["$types"]["output"]["conversations"][number];

type UseListConversationReturn = {
  conversations: Conversation[];
  isLoading: boolean;
  error: unknown | null;
  refetch: () => void;
};

export const useListConversation = (): UseListConversationReturn => {
  const trpc = useTRPC();
  const { report } = useReportError();

  // Fetch all conversations
  const { data, isLoading, error, refetch } = useQuery(
    trpc.conversation.list.queryOptions(),
  );

  const conversations: Conversation[] = data?.conversations || [];

  useEffect(() => {
    if (error) {
      report(error);
    }
  }, [error, report]);

  return {
    conversations,
    isLoading,
    error,
    refetch,
  };
};
