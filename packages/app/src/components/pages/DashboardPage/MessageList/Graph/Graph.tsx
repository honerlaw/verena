import React from "react";
import { type GraphSpecType } from "@onerlaw/verena-server/dist/service/openai/tools/buildGraphMarkdownFence/schema.mjs";
import { H4, YStack, Text, XStack, Stack, useTheme } from "tamagui";
import { PieChart, LineChart } from "react-native-gifted-charts";

type GraphProps = {
  spec: GraphSpecType;
};

export const Graph: React.FC<GraphProps> = ({ spec }) => {
  const theme = useTheme();
  if (spec.type === "line" && spec.line) {
    return (
      <YStack gap="$4" paddingBottom={"$4"}>
        <H4 fontWeight="600">{spec.title}</H4>
        <LineChart
          data={spec.line.data}
          hideYAxisText
          color={theme.primary?.val || "black"}
          textColor={theme.black?.val || "black"}
          textShiftY={-5}
          textShiftX={-5}
          thickness={2}
          curved
          dataPointsColor={theme.primary?.val || "black"}
          rotateLabel
          xAxisLabelsAtBottom
          xAxisLabelsVerticalShift={15}
          textFontSize={14}
          hideAxesAndRules
          showValuesAsDataPointsText
        />
      </YStack>
    );
  }
  if (spec.type === "pie" && spec.pie) {
    return (
      <YStack gap="$4">
        <H4 fontWeight="600">{spec.title}</H4>
        <PieChart data={spec.pie.data} />
        <XStack gap="$2" flexWrap="wrap">
          {spec.pie.data.map((d) => {
            return (
              <XStack key={d.label} alignItems="center" gap="$2">
                <Stack
                  height={12}
                  width={12}
                  backgroundColor={d.color}
                  borderRadius="$2"
                />
                <Text>
                  {d.label} ({d.value})
                </Text>
              </XStack>
            );
          })}
        </XStack>
      </YStack>
    );
  }
  return null;
};
