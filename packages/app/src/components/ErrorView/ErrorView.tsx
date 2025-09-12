import { useReportError } from "@/src/hooks/useReportError"
import { YStack } from "tamagui"
import LottieView from "lottie-react-native"
import source from "@/assets/error.json"

type ErrorViewProps = {
  error: Error | string | null | unknown
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error }) => {
  useReportError(error)

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <YStack width="$13" height="$13" borderRadius="$4">
        <LottieView
          autoPlay
          loop
          source={source}
          style={{ width: "100%", height: "100%" }}
        />
      </YStack>
    </YStack>
  )
}
