import { isClerkAPIResponseError, useSignIn, useOAuth } from "@clerk/clerk-expo";
import React from "react";
import * as AppleAuthentication from 'expo-apple-authentication';
import { useReportError } from "@/src/hooks/useReportError/useReportError";

interface UseSignInFormReturn {
  emailAddress: string;
  setEmailAddress: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  errors: string[] | null;
  onSignInPress: () => Promise<void>;
  onAppleSignInPress: () => Promise<void>;
  isSigningIn: boolean;
  isAppleSignInAvailable: boolean;
}

export function useSignInForm(): UseSignInFormReturn {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_apple" });
  const [errors, setErrors] = React.useState<string[] | null>(null);
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [isAppleSignInAvailable, setIsAppleSignInAvailable] = React.useState(false);
  const { report } = useReportError();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Check if Apple Sign In is available on this device
  React.useEffect(() => {
    const checkAppleSignInAvailability = async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      setIsAppleSignInAvailable(isAvailable);
    };
    checkAppleSignInAvailability();
  }, []);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    setErrors(null);
    setIsSigningIn(true);

    if (!isLoaded) {
      setIsSigningIn(false);
      return;
    }

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        // router.replace('/')
      } else {
        report(
          new Error(
            JSON.stringify(
              {
                status: signInAttempt.status,
              },
              null,
              2,
            ),
          ),
        );
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(["Invalid email or password."]);
      } else {
        report(err, "Failed to sign in.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Apple Sign In
  const onAppleSignInPress = async () => {
    setErrors(null);
    setIsSigningIn(true);

    if (!isLoaded) {
      setIsSigningIn(false);
      return;
    }

    try {
      const { createdSessionId, setActive: oauthSetActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      } else {
        setErrors(["Failed to complete Apple sign in."]);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
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
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    errors,
    onSignInPress,
    onAppleSignInPress,
    isSigningIn,
    isAppleSignInAvailable,
  };
}
