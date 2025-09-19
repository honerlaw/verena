import { Pressable } from "react-native"
import { useLinkToPlaid } from "./useLinkToPlaid"

export const LinkToPlaid: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { error, token, ready, openLink } = useLinkToPlaid()

  if (error) {
    return null
  }

  if (!ready) {
    // @todo maybe an actual loading indiciator?
    return children
  }

  if (!token) {
    // @todo log that we don't have a token, but we got a successful response
    return null
  }

  return <Pressable onPress={() => openLink()}>{children}</Pressable>
}
