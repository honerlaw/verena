import React from "react";
import { QuilttProvider } from "@quiltt/react-native";
import { useTRPC } from "../TRPCProvider";
import { useQuery } from "@tanstack/react-query";
import { LoadingView } from "@/src/components/LoadingView";
import { ErrorView } from "@/src/components/ErrorView";

export const ConnectorProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const trpc = useTRPC()
    const { data, isLoading, error } = useQuery(trpc.user.getSessionToken.queryOptions())

    if (isLoading) {
        return <LoadingView />
    }

    if (error || !data) {
        return <ErrorView error={error} />
    }
    
    return <QuilttProvider token={data.token}>
        {children}
    </QuilttProvider>
};