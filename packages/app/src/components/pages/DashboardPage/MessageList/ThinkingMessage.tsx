import React from "react";
import { XStack, YStack } from "tamagui";
import LottieView from "lottie-react-native";

export const ThinkingMessage: React.FC = () => {
  return (
    <XStack justifyContent="flex-start">
      <YStack
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderRadius="$6"
        backgroundColor="transparent"
        width={80}
        height={80}
      >
        <LottieView
          autoPlay
          loop
          source={require("@/assets/thinking.json")}
          style={{ width: 80, height: 80 }}
        />
      </YStack>
    </XStack>
  );
};
