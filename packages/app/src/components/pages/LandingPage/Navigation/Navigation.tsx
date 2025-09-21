import React from "react";
import { XStack, Text, Button, ScrollView } from "tamagui";
import { useRouter } from "expo-router";
import Icon from "@/assets/icon.svg";
import { useScreenSize } from "@/src/hooks/useScreenSize";

type NavigationProps = {
  scrollViewRef: React.RefObject<ScrollView | null>;
};

export const Navigation: React.FC<NavigationProps> = ({ scrollViewRef }) => {
  const router = useRouter();
  const { isDesktop } = useScreenSize();

  const handleSignIn = () => {
    router.push("/signin");
  };

  const handleCreateAccount = () => {
    router.push("/signup");
  };

  // For web only - navigation links
  const navigationItems = [
    { label: "Why Verena", href: "#why-verena" },
    { label: "Security", href: "#security" },
    { label: "How it works", href: "#how-it-works" },
  ];

  const handleScrollToSection = (href: string) => {
    const id = href.toLowerCase().replaceAll(" ", "-").replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      const elementTop = element.offsetTop + element.offsetHeight;
      scrollViewRef.current?.scrollTo?.({
        y: elementTop,
        animated: true,
      });
    }
  };

  // mobile render nothing
  if (!isDesktop) {
    return null;
  }

  return (
    <XStack
      width="100%"
      paddingHorizontal="$6"
      paddingVertical="$4"
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Logo/Brand */}
      <XStack alignItems="center" gap="$2" width={200}>
        <Icon width={32} height={32} />
        <Text fontSize="$6" fontWeight="bold" color="$color">
          Verena
        </Text>
      </XStack>

      {/* Navigation Items - Centered */}
      <XStack gap="$6" alignItems="center" justifyContent="center" flex={1}>
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="outlined"
            size="$3"
            backgroundColor="transparent"
            borderWidth={0}
            color="$color"
            onPress={() => handleScrollToSection(item.href)}
            hoverStyle={{
              backgroundColor: "$background075",
            }}
          >
            {item.label}
          </Button>
        ))}
      </XStack>

      {/* Action Buttons */}
      <XStack
        gap="$3"
        alignItems="center"
        justifyContent="flex-end"
        width={200}
      >
        <Button
          variant="outlined"
          size="$3"
          onPress={handleSignIn}
          borderColor="$borderColor"
          color="$color"
          hoverStyle={{
            backgroundColor: "$background075",
          }}
        >
          Sign in
        </Button>
        <Button
          size="$3"
          onPress={handleCreateAccount}
          backgroundColor="$primary"
          hoverStyle={{
            backgroundColor: "$primary2",
          }}
        >
          <Text color="white">Create account</Text>
        </Button>
      </XStack>
    </XStack>
  );
};
