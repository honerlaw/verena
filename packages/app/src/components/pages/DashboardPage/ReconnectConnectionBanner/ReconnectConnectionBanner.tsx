import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { ConnectionBannerSection } from "./ConnectionBannerSection/ConnectionBannerSection";

export const ReconnectConnectionBanner: React.FC = () => {
  const trpc = useTRPC();

  const { data: itemsData, isLoading } = useQuery(
    trpc.item.getAll.queryOptions(),
  );

  if (isLoading) {
    return null;
  }

  const reconnectItems =
    itemsData?.items?.filter(
      (item) => item.status.toString() === "RECONNECT",
    ) || [];

  if (reconnectItems.length === 0) {
    return null;
  }

  return (
    <>
      {reconnectItems.map((item) => (
        <ConnectionBannerSection key={item.itemId} item={item} />
      ))}
    </>
  );
};
