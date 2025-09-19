import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/providers/TRPCProvider";
import { ConnectionBannerSection } from "./ConnectionBannerSection/ConnectionBannerSection";

export const ReconnectConnectionBanner: React.FC = () => {
  const trpc = useTRPC();

  const { data: connectionsData, isLoading } = useQuery(
    trpc.connection.getAll.queryOptions(),
  );

  if (isLoading) {
    return null;
  }

  const reconnectConnections =
    connectionsData?.connections?.filter(
      (connection) => connection.status.toString() === "RECONNECT",
    ) || [];

  if (reconnectConnections.length === 0) {
    return null;
  }

  return (
    <>
      {reconnectConnections.map((connection) => (
        <ConnectionBannerSection key={connection.id} connection={connection} />
      ))}
    </>
  );
};
