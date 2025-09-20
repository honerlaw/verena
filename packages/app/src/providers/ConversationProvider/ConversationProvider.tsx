import React, { createContext, useContext, useEffect, useState } from "react";
import { useCreateConversation } from "./hooks/useCreateConversation";
import { useListConversation } from "./hooks/useListConversation";
import { useListConversationItems } from "./hooks/useListConversationItems";
import { useMessage } from "./hooks/useMessage";
import { useRemoveConversation } from "./hooks/useRemoveConversation";

interface ConversationContextType {
  list: ReturnType<typeof useListConversation>;
  create: ReturnType<typeof useCreateConversation>;
  remove: ReturnType<typeof useRemoveConversation>;
  items: ReturnType<typeof useListConversationItems>;
  message: ReturnType<typeof useMessage>;
  currentConversationId: string | null;
  setCurrentConversationId: (conversationId: string | null) => void;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider",
    );
  }
  return context;
};

export const ConversationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  // Use the list conversation hook
  const list = useListConversation();

  // Use the create conversation hook
  const create = useCreateConversation(
    list.refetch,
    setCurrentConversationId,
    currentConversationId,
  );

  // Use the remove conversation hook
  const remove = useRemoveConversation(
    list.refetch,
    setCurrentConversationId,
    currentConversationId,
  );

  // Use the list conversation items hook
  const items = useListConversationItems(currentConversationId);

  // Use the message hook
  const message = useMessage(create.create);

  // Refetch items whenever currentConversationId changes
  const refetch = items.refetch;
  useEffect(() => {
    if (currentConversationId) {
      refetch();
    }
  }, [currentConversationId, refetch]);

  // items changed, and we have no messages, so add the previous historical messages
  useEffect(() => {
    if (items.isLoading || items.isFetching) {
      return;
    }

    if (message.messages.length !== 0) {
      return;
    }
    // the history is from a different conversation, so we don't need to add it
    if (items.items.conversationId !== currentConversationId) {
      return;
    }
    for (const item of items.items.items) {
      for (const content of item.content) {
        // we don't handle other message types yet
        if (content.type !== "input_text" && content.type !== "output_text") {
          continue;
        }

        message.addMessage({
          id: item.id,
          role: item.role,
          content: content.text,
        });
      }
    }
  }, [items, message, currentConversationId]);

  const value: ConversationContextType = {
    list,
    create,
    remove,
    items,
    message,
    currentConversationId,
    setCurrentConversationId,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};
