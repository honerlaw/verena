import { z } from "zod";

// separate file so that we can reuse the schema in the tool and in the app
export const LineGraphData = z.object({
  data: z.array(z.object({ value: z.number(), label: z.string() })),
});

export const PieGraphData = z.object({
  data: z.array(
    z.object({ label: z.string(), value: z.number(), color: z.string() }),
  ),
});

export const GraphSpec = z
  .object({
    type: z.enum(["line", "pie"]),
    title: z.string().optional(),
    line: LineGraphData.optional(),
    pie: PieGraphData.optional(),
  })
  .refine((s) => (s.type === "line" && s.line) || (s.type === "pie" && s.pie), {
    message: "For type=line, provide line; for type=pie, provide pie.",
  });

export type GraphSpecType = z.infer<typeof GraphSpec>;
