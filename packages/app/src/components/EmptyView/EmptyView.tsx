import { YStack, Text, H6 } from "tamagui"
import LottieView from "lottie-react-native"
import source from "@/assets/empty.json"

type EmptyViewProps = {
  inline?: boolean
}

export const EmptyView: React.FC<EmptyViewProps> = ({ inline }) => {
  return (
    <YStack
      flex={inline ? undefined : 1}
      justifyContent="center"
      alignItems="center"
    >
      <YStack justifyContent="center" alignItems="center">
        <YStack width="$13" height="$13" borderRadius="$4">
          <LottieView
            autoPlay
            loop={false}
            source={source}
            style={{ width: "100%", height: "100%" }}
          />
        </YStack>
        <H6 textAlign="center">Sorry, we couldn't find anything!</H6>
      </YStack>
    </YStack>
  )
}
