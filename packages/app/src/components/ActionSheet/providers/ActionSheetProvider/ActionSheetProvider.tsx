import React, { createContext, useContext, useState } from "react";

type ActionSheetContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ActionSheetContext = createContext<ActionSheetContextType | undefined>(
  undefined,
);

export const ActionSheetProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <ActionSheetContext.Provider value={{ open, setOpen }}>
      {children}
    </ActionSheetContext.Provider>
  );
};

export const useActionSheet = () => {
  const context = useContext(ActionSheetContext);
  if (context === undefined) {
    throw new Error(
      "useActionSheet must be used within an ActionSheetProvider",
    );
  }
  return context;
};
