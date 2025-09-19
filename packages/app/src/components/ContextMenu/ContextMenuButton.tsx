import React from "react";
import { Button, Text, XStack, Separator } from "tamagui";

export type ContextMenuButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  type?: "destructive";
  icon?: React.ComponentType<any>;
  showSeparator?: boolean;
};

export const ContextMenuButton: React.FC<ContextMenuButtonProps> = ({
  label,
  onPress,
  disabled,
  type,
  icon,
  showSeparator = false,
}) => {
  return (
    <>
      <Button
        size="$3"
        backgroundColor="transparent"
        borderWidth={0}
        justifyContent="flex-start"
        paddingHorizontal="$3"
        paddingVertical="$2"
        onPress={onPress}
        disabled={disabled}
        opacity={disabled ? 0.5 : 1}
        pressStyle={{
          backgroundColor: "$gray3",
        }}
        hoverStyle={{
          backgroundColor: "$gray2",
        }}
      >
        <XStack alignItems="center" gap="$2">
          {icon &&
            (() => {
              const IconComponent = icon;
              return (
                <IconComponent
                  size={16}
                  color={
                    disabled
                      ? "$gray8"
                      : type === "destructive"
                        ? "$red10"
                        : "$color"
                  }
                />
              );
            })()}
          <Text
            fontSize="$3"
            color={
              disabled ? "$gray8" : type === "destructive" ? "$red10" : "$color"
            }
            fontWeight={type === "destructive" ? "bold" : "normal"}
          >
            {label}
          </Text>
        </XStack>
      </Button>
      {showSeparator && <Separator marginVertical="$1" />}
    </>
  );
};
