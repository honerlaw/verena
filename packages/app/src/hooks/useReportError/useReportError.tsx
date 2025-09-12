import { useToastController } from "@tamagui/toast"
import * as Sentry from "@sentry/react-native"
import { useCallback, useEffect } from "react"

export function useReportError(error?: unknown) {
  const toast = useToastController()

  const report = useCallback(
    (error: unknown, displayMessage?: string) => {
      if (process.env.NODE_ENV !== "production") {
        console.error(error, displayMessage)
      }

      Sentry.captureException(error)

      if (displayMessage) {
        toast.show(displayMessage, {
          message: "Error",
          native: true,
        })
      }
    },
    [toast],
  )

  useEffect(() => {
    if (!error) {
      return
    }
    report(error)
  }, [error, report])

  return {
    report,
  }
}
