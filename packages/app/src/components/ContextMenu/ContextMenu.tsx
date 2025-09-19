import React, { useState, useRef } from "react";
import { Modal, Pressable, View, useWindowDimensions } from "react-native";
import { YStack, Button } from "tamagui";
import { MoreVertical } from "@tamagui/lucide-icons";

export interface ContextMenuProps {
  children: React.ReactNode;
  triggerComponent?: React.ReactNode;
  buttonSize?: "$2" | "$3" | "$4" | "$5";
}

type MenuPosition = {
  top: number;
  left: number;
  placement: "top" | "bottom" | "left" | "right";
};

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  triggerComponent,
  buttonSize = "$3",
}) => {
  const { width, height } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
    placement: "bottom",
  });
  const triggerRef = useRef<View>(null);

  // Calculate optimal menu position based on available space
  const calculateOptimalPosition = (triggerPos: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): MenuPosition => {
    const menuWidth = 160; // Estimated menu width
    const menuHeight = React.Children.count(children) * 44 + 16; // Estimated height: ~44px per item + padding
    const gap = 8; // Gap between trigger and menu
    const screenPadding = 8; // Minimum padding from screen edges

    // Calculate available space in each direction
    const spaceAbove = triggerPos.y - screenPadding;
    const spaceBelow =
      height - (triggerPos.y + triggerPos.height) - screenPadding;
    const spaceLeft = triggerPos.x - screenPadding;
    const spaceRight =
      width - (triggerPos.x + triggerPos.width) - screenPadding;

    // Determine best placement
    let placement: MenuPosition["placement"] = "bottom";
    let top = triggerPos.y + triggerPos.height + gap;
    let left = Math.max(
      screenPadding,
      triggerPos.x + triggerPos.width / 2 - menuWidth / 2,
    );

    // Check if menu fits below (preferred)
    if (spaceBelow >= menuHeight) {
      placement = "bottom";
      top = triggerPos.y + triggerPos.height + gap;
    }
    // Check if menu fits above
    else if (spaceAbove >= menuHeight) {
      placement = "top";
      top = triggerPos.y - menuHeight - gap;
    }
    // Check if menu fits to the right
    else if (spaceRight >= menuWidth) {
      placement = "right";
      top = Math.max(
        screenPadding,
        triggerPos.y + triggerPos.height / 2 - menuHeight / 2,
      );
      left = triggerPos.x + triggerPos.width + gap;
    }
    // Check if menu fits to the left
    else if (spaceLeft >= menuWidth) {
      placement = "left";
      top = Math.max(
        screenPadding,
        triggerPos.y + triggerPos.height / 2 - menuHeight / 2,
      );
      left = triggerPos.x - menuWidth - gap;
    }
    // Fallback: position where there's most space (even if it doesn't fully fit)
    else {
      const maxSpace = Math.max(spaceAbove, spaceBelow, spaceLeft, spaceRight);
      if (maxSpace === spaceBelow) {
        placement = "bottom";
        top = triggerPos.y + triggerPos.height + gap;
      } else if (maxSpace === spaceAbove) {
        placement = "top";
        top = Math.max(screenPadding, triggerPos.y - menuHeight - gap);
      } else if (maxSpace === spaceRight) {
        placement = "right";
        top = Math.max(
          screenPadding,
          triggerPos.y + triggerPos.height / 2 - menuHeight / 2,
        );
        left = triggerPos.x + triggerPos.width + gap;
      } else {
        placement = "left";
        top = Math.max(
          screenPadding,
          triggerPos.y + triggerPos.height / 2 - menuHeight / 2,
        );
        left = Math.max(screenPadding, triggerPos.x - menuWidth - gap);
      }
    }

    // Ensure menu stays within screen bounds
    left = Math.max(
      screenPadding,
      Math.min(left, width - menuWidth - screenPadding),
    );
    top = Math.max(
      screenPadding,
      Math.min(top, height - menuHeight - screenPadding),
    );

    return { top, left, placement };
  };

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      // Measure trigger position before opening
      triggerRef.current.measure((x, y, width, height, pageX, pageY) => {
        const triggerPos = { x: pageX, y: pageY, width, height };

        // Calculate optimal menu position
        const optimalPosition = calculateOptimalPosition(triggerPos);
        setMenuPosition(optimalPosition);

        setIsOpen(true);
      });
    } else {
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button
      size={buttonSize}
      circular
      icon={MoreVertical}
      onPress={handleToggle}
    />
  );

  // Clone trigger component to add onPress handler if it's a custom trigger
  const renderTrigger = () => {
    if (triggerComponent && React.isValidElement(triggerComponent)) {
      return React.cloneElement(triggerComponent, {
        onPress: handleToggle,
      } as any);
    }
    return defaultTrigger;
  };

  return (
    <>
      <View ref={triggerRef}>{renderTrigger()}</View>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setIsOpen(false)}>
          <View style={{ flex: 1, position: "relative" }}>
            <Pressable>
              <YStack
                position="absolute"
                top={menuPosition.top}
                left={menuPosition.left}
                backgroundColor="$background"
                borderRadius="$4"
                borderWidth={1}
                borderColor="$borderColor"
                padding="$2"
                minWidth={160}
                shadowColor="$shadowColor"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={8}
                elevation={10}
                zIndex={1000}
              >
                {React.Children.map(children, (child, index) => {
                  if (React.isValidElement(child)) {
                    const childProps = child.props as any;
                    return React.cloneElement(child, {
                      ...childProps,
                      onPress: () => {
                        childProps.onPress?.();
                        handleClose();
                      },
                      showSeparator: index < React.Children.count(children) - 1,
                    });
                  }
                  return child;
                })}
              </YStack>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};
