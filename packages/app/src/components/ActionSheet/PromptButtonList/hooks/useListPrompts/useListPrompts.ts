import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { type AppRouter } from "@onerlaw/verena-server/dist/network/rpc/index.mjs";
import { useReportError } from "@/src/hooks/useReportError";

export type Prompt =
  AppRouter["prompt"]["list"]["_def"]["$types"]["output"]["prompts"][number];

type UseListPromptsReturn = {
  prompts: Prompt[];
  isLoading: boolean;
  error: unknown | null;
  refetch: () => void;
};

export const useListPrompts = (): UseListPromptsReturn => {
  const trpc = useTRPC();
  const { report } = useReportError();

  // Fetch all prompts
  const { data, isLoading, error, refetch } = useQuery(
    trpc.prompt.list.queryOptions(),
  );

  const prompts: Prompt[] = data?.prompts || [];

  useEffect(() => {
    if (error) {
      report(error);
    }
  }, [error, report]);

  return {
    prompts,
    isLoading,
    error,
    refetch,
  };
};
