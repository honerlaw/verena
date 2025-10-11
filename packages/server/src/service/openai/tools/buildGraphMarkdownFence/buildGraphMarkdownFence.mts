import { RunContext, tool } from "@openai/agents";
import type { Context } from "../../../../context.mjs";
import { type GraphSpecType, GraphSpec } from "./schema.mjs";

const GraphMarkdownFenceDataParams = {
  type: "object" as const,
  properties: {
    type: { enum: ["line", "pie"] },
    title: { type: "string" },
    line: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              value: { type: "number" },
              label: { type: "string" },
            },
            required: ["value", "label"],
          },
        },
      },
      required: ["data"],
    },
    pie: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              value: { type: "number" },
              color: { type: "string" },
            },
            required: ["label", "value", "color"],
          },
        },
      },
      required: ["data"],
    },
  },
  required: ["type"],
  additionalProperties: true as const,
};

export const buildGraphMarkdownFenceTool = tool({
  strict: false,
  name: "build_graph_markdown_fence",
  description:
    "Build a markdown fence with a graph spec for a line or pie chart.",
  parameters: GraphMarkdownFenceDataParams,
  execute: async (params: unknown, context?: RunContext<Context>) => {
    try {
      if (!context) {
        throw new Error("Context is required");
      }
      return await executeBuildGraphMarkdownFence(GraphSpec.parse(params));
    } catch (error) {
      context?.context.logger.error(
        {
          error,
          tags: ["service", "openai", "tools", "buildGraphMarkdownFence"],
          attributes: {
            params,
          },
        },
        "Error executing build graph markdown fence tool",
      );
      return "Error executing, no graph built.";
    }
  },
});

async function executeBuildGraphMarkdownFence(
  spec: GraphSpecType,
): Promise<string> {
  return ["```graph", JSON.stringify(spec, null, 2), "```"].join("\n");
}
