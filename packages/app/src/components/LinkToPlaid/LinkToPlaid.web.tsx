import { Pressable } from "react-native";
import { useLinkToPlaid } from "./useLinkToPlaid";

export const LinkToPlaid: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { openLink } = useLinkToPlaid();

  return <Pressable onPress={() => openLink()}>{children}</Pressable>;
};
