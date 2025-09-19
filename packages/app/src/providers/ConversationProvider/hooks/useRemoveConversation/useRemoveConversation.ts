import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { useReportError } from "@/src/hooks/useReportError";

type UseRemoveConversationReturn = {
  remove: (conversationId: string) => Promise<boolean>;
};

export const useRemoveConversation = (
  refetchConversations: () => void,
  setCurrentConversationId: (conversationId: string | null) => void,
  currentConversationId: string | null,
): UseRemoveConversationReturn => {
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
        report(err, "Failed to remove conversation");
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

  return {
    remove,
  };
};
