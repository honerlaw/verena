import React from "react";
import { useLinkToPlaid } from "./useLinkToPlaid";

export const LinkToPlaid: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { openLink } = useLinkToPlaid();

  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    return React.cloneElement<any>(child, {
      onPress: openLink,
    });
  });
};
