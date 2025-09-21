import React from "react";
import { YStack, XStack, Text, Card } from "tamagui";
import { Eye, Settings, Shield } from "@tamagui/lucide-icons";
import { useScreenSize } from "@/src/hooks/useScreenSize";

interface SecurityFeatureProps {
  icon: React.ReactNode;
  title: string;
}

const SecurityFeature: React.FC<SecurityFeatureProps> = ({ icon, title }) => {
  return (
    <XStack alignItems="center" gap="$4" marginBottom="$4">
      <YStack
        width={48}
        height={48}
        backgroundColor="$primary"
        borderRadius="$4"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <YStack
          position="absolute"
          width={48}
          height={48}
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </YStack>
      </YStack>

      <Text fontSize="$5" fontWeight="500" color="$color" flex={1}>
        {title}
      </Text>
    </XStack>
  );
};

interface SecurityBadgeProps {
  label: string;
}

const SecurityBadge: React.FC<SecurityBadgeProps> = ({ label }) => {
  return (
    <YStack
      backgroundColor="$background"
      borderColor="$borderColor"
      borderWidth={1}
      borderRadius="$6"
      paddingHorizontal="$4"
      paddingVertical="$3"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="$3" fontWeight="600" color="$color" textAlign="center">
        {label}
      </Text>
    </YStack>
  );
};

export const Security: React.FC = () => {
  const securityFeatures = [
    {
      icon: <Eye color="white" />,
      title: "Read-only access; we can't move money",
    },
    {
      icon: <Shield color="white" />,
      title: "Encryption in transit and at rest",
    },
    {
      icon: <Settings color="white" />,
      title: "Granular controls and easy disconnect",
    },
  ];

  const securityBadges = ["AES 256 CTR Encryption", "Read-Only"];

  const { isDesktop } = useScreenSize();

  return (
    <YStack
      id="security"
      paddingVertical="$10"
      paddingHorizontal="$4"
      alignItems="center"
      justifyContent="center"
      minHeight={"100vh"}
      backgroundColor="$background"
    >
      {/* Section Title */}
      <Text
        fontSize="$10"
        fontWeight="bold"
        color="$color"
        textAlign="center"
        marginBottom="$10"
      >
        Security you can trust.
      </Text>

      {/* Main Content Container */}
      <YStack width="100%" maxWidth={1200} alignItems="stretch" gap="$8">
        <XStack
          gap="$8"
          alignItems="center"
          flexDirection={isDesktop ? "row" : "column"}
        >
          {/* Left Side - Security Features */}
          <YStack flex={1} gap="$2">
            {securityFeatures.map((feature, index) => (
              <SecurityFeature
                key={index}
                icon={feature.icon}
                title={feature.title}
              />
            ))}
          </YStack>

          {/* Right Side - Bank-Level Security */}
          <YStack flex={1} alignItems="center">
            <Card
              padding="$8"
              backgroundColor="$background075"
              borderColor="$borderColor"
              borderWidth={1}
              borderRadius="$6"
              alignItems="center"
              width="100%"
            >
              <YStack alignItems="center" gap="$6">
                {/* Large Shield Icon with Circle Background */}
                <YStack
                  width={160}
                  height={160}
                  backgroundColor="$primary"
                  borderRadius="$12"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                >
                  <YStack
                    position="absolute"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Shield color="white" width={80} height={80} />
                  </YStack>
                </YStack>

                <Text
                  fontSize="$8"
                  fontWeight="bold"
                  color="$color"
                  textAlign="center"
                >
                  Bank-Level Security
                </Text>

                <Text
                  fontSize="$4"
                  color="$color075"
                  textAlign="center"
                  lineHeight="$2"
                >
                  Your data is protected with the same security standards used
                  by major financial institutions.
                </Text>
              </YStack>
            </Card>
          </YStack>
        </XStack>

        {/* Bottom Section */}
        <YStack alignItems="center" gap="$6" marginTop="$10">
          <Text
            fontSize="$5"
            color="$color075"
            textAlign="center"
            fontWeight="500"
          >
            Read-only connections. Bank-grade encryption. You stay in control.
          </Text>

          {/* Security Badges */}
          <XStack
            gap="$4"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
          >
            {securityBadges.map((badge, index) => (
              <SecurityBadge key={index} label={badge} />
            ))}
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
};
