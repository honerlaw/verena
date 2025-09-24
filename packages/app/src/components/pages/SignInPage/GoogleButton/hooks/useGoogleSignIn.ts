import React from "react";
import { useSSO, isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { useReportError } from "@/src/hooks/useReportError/useReportError";

export const useGoogleSignIn = () => {
  const { startSSOFlow } = useSSO();
  const { setActive } = useSignIn();
  const { report } = useReportError();
  const [isLoading, setIsLoading] = React.useState(false);

  const signIn = React.useCallback(async () => {
    setIsLoading(true);

    try {
      const { createdSessionId } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        console.error("Google sign in error:", err);
        report(err, "Failed to sign in with Google");
      } else {
        report(err, "Failed to sign in with Google");
      }
    } finally {
      setIsLoading(false);
    }
  }, [startSSOFlow, setActive, report]);

  return {
    signIn,
    isLoading,
  };
};
