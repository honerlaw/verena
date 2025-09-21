import React from "react";
import { YStack, XStack, Text, Card } from "tamagui";
import { Platform } from "react-native";

// Custom Icons
const EyeIcon: React.FC = () => (
  <YStack width={24} height={24} alignItems="center" justifyContent="center">
    <YStack
      width={20}
      height={12}
      backgroundColor="transparent"
      borderWidth={2}
      borderColor="$primary"
      borderRadius="$4"
      position="relative"
      alignItems="center"
      justifyContent="center"
    >
      <YStack
        width={6}
        height={6}
        backgroundColor="$primary"
        borderRadius="$6"
      />
    </YStack>
  </YStack>
);

const ShieldIcon: React.FC = () => (
  <YStack width={24} height={24} alignItems="center" justifyContent="center">
    <YStack
      width={16}
      height={20}
      backgroundColor="$primary"
      borderRadius="$2"
      borderTopLeftRadius="$4"
      borderTopRightRadius="$4"
      position="relative"
      alignItems="center"
      justifyContent="center"
    >
      <YStack
        width={6}
        height={2}
        backgroundColor="white"
        borderRadius="$1"
        marginTop="$1"
      />
      <YStack
        width={4}
        height={2}
        backgroundColor="white"
        borderRadius="$1"
        marginTop="$1"
      />
    </YStack>
  </YStack>
);

const SettingsIcon: React.FC = () => (
  <YStack width={24} height={24} alignItems="center" justifyContent="center">
    <YStack
      width={16}
      height={16}
      backgroundColor="$primary"
      borderRadius="$6"
      position="relative"
      alignItems="center"
      justifyContent="center"
    >
      <YStack width={6} height={6} backgroundColor="white" borderRadius="$6" />
      <YStack
        position="absolute"
        top={-2}
        width={2}
        height={4}
        backgroundColor="$primary"
        borderRadius="$1"
      />
      <YStack
        position="absolute"
        bottom={-2}
        width={2}
        height={4}
        backgroundColor="$primary"
        borderRadius="$1"
      />
      <YStack
        position="absolute"
        left={-2}
        width={4}
        height={2}
        backgroundColor="$primary"
        borderRadius="$1"
      />
      <YStack
        position="absolute"
        right={-2}
        width={4}
        height={2}
        backgroundColor="$primary"
        borderRadius="$1"
      />
    </YStack>
  </YStack>
);

const LargeShieldIcon: React.FC = () => (
  <YStack width={80} height={80} alignItems="center" justifyContent="center">
    <YStack
      width={64}
      height={80}
      backgroundColor="$primary"
      borderRadius="$4"
      borderTopLeftRadius="$8"
      borderTopRightRadius="$8"
      position="relative"
      alignItems="center"
      justifyContent="center"
    >
      <YStack
        width={24}
        height={4}
        backgroundColor="white"
        borderRadius="$2"
        marginTop="$2"
      />
      <YStack
        width={20}
        height={4}
        backgroundColor="white"
        borderRadius="$2"
        marginTop="$2"
      />
      <YStack
        width={16}
        height={4}
        backgroundColor="white"
        borderRadius="$2"
        marginTop="$2"
      />
    </YStack>
  </YStack>
);

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
        opacity={0.1}
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
      icon: <EyeIcon />,
      title: "Read-only access; we can't move money",
    },
    {
      icon: <ShieldIcon />,
      title: "Encryption in transit and at rest",
    },
    {
      icon: <SettingsIcon />,
      title: "Granular controls and easy disconnect",
    },
  ];

  const securityBadges = ["256-bit SSL", "SOC 2", "Read-Only"];

  return (
    <YStack
      paddingVertical="$10"
      paddingHorizontal="$4"
      alignItems="center"
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
        {Platform.OS === "web" ? (
          // Desktop Layout - Horizontal
          <XStack gap="$8" alignItems="flex-start">
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
                    opacity={0.1}
                    position="relative"
                  >
                    <YStack
                      position="absolute"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <LargeShieldIcon />
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
        ) : (
          // Mobile Layout - Stack vertically
          <YStack gap="$8">
            {/* Security Features */}
            <YStack gap="$2">
              {securityFeatures.map((feature, index) => (
                <SecurityFeature
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                />
              ))}
            </YStack>

            {/* Bank-Level Security Card */}
            <Card
              padding="$6"
              backgroundColor="$background075"
              borderColor="$borderColor"
              borderWidth={1}
              borderRadius="$6"
              alignItems="center"
            >
              <YStack alignItems="center" gap="$4">
                {/* Large Shield Icon with Circle Background */}
                <YStack
                  width={160}
                  height={160}
                  backgroundColor="$primary"
                  borderRadius="$12"
                  alignItems="center"
                  justifyContent="center"
                  opacity={0.1}
                  position="relative"
                >
                  <YStack
                    position="absolute"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <LargeShieldIcon />
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
        )}

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
