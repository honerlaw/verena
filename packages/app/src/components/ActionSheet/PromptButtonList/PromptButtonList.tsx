import React from "react";
import { XStack, YStack, ScrollView, H5 } from "tamagui";
import { PromptButton } from "./PromptButton";
import { useListPrompts } from "./hooks/useListPrompts";
import { ErrorView } from "../../ErrorView";
import { LoadingView } from "../../LoadingView";

export interface PromptButtonListProps {
  title?: string | null;
}

export const PromptButtonList: React.FC<PromptButtonListProps> = ({
  title = "Prompts Ideas",
}) => {
  const { prompts, isLoading, error } = useListPrompts();

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <YStack gap="$3" padding={"$2"}>
      {title && (
        <H5 color="$color" fontWeight={"700"}>
          {title}
        </H5>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$3" paddingVertical="$1">
          {prompts.map((promptItem) => (
            <PromptButton
              key={promptItem.id}
              title={promptItem.title}
              prompt={promptItem.prompt}
            />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
};
