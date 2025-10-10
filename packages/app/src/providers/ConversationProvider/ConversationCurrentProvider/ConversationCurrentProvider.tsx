import React, { createContext, useContext, useState } from "react";

type ConversationCurrentContextType = {
  currentConversationId: string | null;
  setCurrentConversationId: (conversationId: string | null) => void;
};

const ConversationCurrentContext =
  createContext<ConversationCurrentContextType | null>(null);

export const useConversationCurrent = () => {
  const context = useContext(ConversationCurrentContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider",
    );
  }
  return context;
};

export const ConversationCurrentProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  const value: ConversationCurrentContextType = {
    currentConversationId,
    setCurrentConversationId,
  };

  return (
    <ConversationCurrentContext.Provider value={value}>
      {children}
    </ConversationCurrentContext.Provider>
  );
};
