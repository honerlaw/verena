import React from "react";
import { XStack, YStack, Text } from "tamagui";
import LottieView from "lottie-react-native";

export const ThinkingMessage: React.FC = () => {
  return (
    <XStack justifyContent="flex-start">
      <YStack
        maxWidth="90%"
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderRadius="$6"
        backgroundColor="transparent"
      >
        <XStack alignItems="center" gap="$1">
          <LottieView
            autoPlay
            loop
            source={require("@/assets/thinking.json")}
            style={{ width: 80, height: 80 }}
          />
          <YStack marginLeft={-12}>
            <Text fontSize={16} color={"$color11"} fontWeight="400">
              Thinking...
            </Text>
          </YStack>
        </XStack>
      </YStack>
    </XStack>
  );
};
