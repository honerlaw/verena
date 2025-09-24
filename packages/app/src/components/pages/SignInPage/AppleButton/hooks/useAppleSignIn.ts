import { isClerkAPIResponseError, useSignIn, useSSO } from "@clerk/clerk-expo";
import React from "react";
import { useReportError } from "@/src/hooks/useReportError/useReportError";

interface UseAppleSignInReturn {
  /** Whether Apple Sign In is available on this device */
  isAppleSignInAvailable: boolean;
  /** Whether the Apple Sign In process is currently in progress */
  isSigningIn: boolean;
  /** Any errors that occurred during Apple Sign In */
  errors: string[] | null;
  /** Function to initiate Apple Sign In */
  onAppleSignInPress: () => Promise<void>;
  /** Whether the last sign-in attempt was successful */
  isSuccess: boolean;
}

export function useAppleSignIn(): UseAppleSignInReturn {
  const { setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const [errors, setErrors] = React.useState<string[] | null>(null);
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { report } = useReportError();

  // Handle Apple Sign In
  const onAppleSignInPress = async () => {
    setErrors(null);
    setIsSuccess(false);
    setIsSigningIn(true);

    if (!isLoaded) {
      setIsSigningIn(false);
      return;
    }

    try {
      const { createdSessionId } = await startSSOFlow({
        strategy: "oauth_apple",
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        setIsSuccess(true);
      } else {
        setErrors(["Failed to complete Apple sign in."]);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        console.log("err", err);
        setErrors([err.errors?.[0]?.message || "Apple sign in failed."]);
      } else {
        report(err, "Failed to sign in with Apple.");
        setErrors(["Apple sign in failed. Please try again."]);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return {
    isSigningIn,
    errors,
    onAppleSignInPress,
    isSuccess,
  };
}
