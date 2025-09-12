import { useEffect, useRef } from "react"
import { Animated, Easing } from "react-native"
import { YStack } from "tamagui"
import Icon from "@/assets/icon.svg"

export const LoadingView: React.FC = () => {
  const bounceAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const startBounceAnimation = () => {
      Animated.sequence([
        // Jump up - starts fast, slows at peak
        Animated.timing(bounceAnim, {
          toValue: -30,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        // Fall down - starts slow, accelerates quickly
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        // Delay between jumps - pause before next jump
        Animated.delay(800),
      ]).start(() => startBounceAnimation())
    }

    startBounceAnimation()
  }, [bounceAnim])

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        <Icon width={100} height={100} />
      </Animated.View>
    </YStack>
  )
}
