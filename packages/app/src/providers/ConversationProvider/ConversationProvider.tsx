import React from "react";
import { ConversationListProvider } from "./ConversationListProvider";
import { ConversationCreateProvider } from "./ConversationCreateProvider";
import { ConversationCurrentProvider } from "./ConversationCurrentProvider";
import { ConversationRemoveProvider } from "./ConversationRemoveProvider";
import { ConversationListItemsProvider } from "./ConversationListItemsProvider";
import { ConversationStreamMessageProvider } from "./ConversationStreamMessageProvider";

export const ConversationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <ConversationCurrentProvider>
      <ConversationListProvider>
        <ConversationCreateProvider>
          <ConversationRemoveProvider>
            <ConversationListItemsProvider>
              <ConversationStreamMessageProvider>
                {children}
              </ConversationStreamMessageProvider>
            </ConversationListItemsProvider>
          </ConversationRemoveProvider>
        </ConversationCreateProvider>
      </ConversationListProvider>
    </ConversationCurrentProvider>
  );
};
