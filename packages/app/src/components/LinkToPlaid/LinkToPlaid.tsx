import React from "react"
import { useLinkToPlaid } from "./useLinkToPlaid"

export const LinkToPlaid: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { error, token, openLink } = useLinkToPlaid()

  if (error) {
    return null
  }

  if (!token) {
    // @todo maybe an actual loading indiciator?
    return children
  }

  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.cloneElement<any>(child, {
      onPress: openLink,
    })
  })
}
