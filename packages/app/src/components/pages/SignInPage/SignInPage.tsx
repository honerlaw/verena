import { useRouter } from "expo-router";
import React from "react";
import { Button, Form, H1, H3, Input, Stack, Text, XStack, YStack } from "tamagui";
import { KeyboardAvoiding } from "@/src/components/KeyboardAvoiding";
import { useSignInForm } from "./hooks/useSignInForm";
import Icon from "@/assets/icon.svg";

export function SignInPage() {
  const router = useRouter();
  const {
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    errors,
    onSignInPress,
    onAppleSignInPress,
    isSigningIn,
    isAppleSignInAvailable,
  } = useSignInForm();

  return (
    <KeyboardAvoiding>
      <XStack alignItems="center" justifyContent="center" marginBottom="$12">
        <Icon width={80} height={80} />
      </XStack>
      <Form onSubmit={onSignInPress} gap="$5" width={"75%"} maxWidth={"400px"}>
        <YStack borderRadius="$4" gap="$5">
          <H1 marginLeft={-8}>Verena</H1>
          <H3>Sign in</H3>
          {errors &&
            errors.map((e) => (
              <Text color="$red10" key={e}>
                {e}
              </Text>
            ))}
          <Input
            keyboardType="email-address"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <Input
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Form.Trigger asChild>
            <Button disabled={isSigningIn}>
              {isSigningIn ? "Signing in..." : "Sign in"}
            </Button>
          </Form.Trigger>

          {isAppleSignInAvailable && (
            <>
              <XStack alignItems="center" gap="$4" marginVertical="$4">
                <Stack flex={1} height={1} backgroundColor="$borderColor" />
                <Text color="$color11" fontSize="$3">or</Text>
                <Stack flex={1} height={1} backgroundColor="$borderColor" />
              </XStack>
              
              <Button
                onPress={onAppleSignInPress}
                disabled={isSigningIn}
                backgroundColor="$black12"
                borderColor="$borderColor"
                pressStyle={{ backgroundColor: "$gray11" }}
              >
                <XStack alignItems="center" gap="$3">
                  <Text color="white" fontWeight="600">
                    {isSigningIn ? "Signing in..." : "Continue with Apple"}
                  </Text>
                </XStack>
              </Button>
            </>
          )}

          <Stack justifyContent="center" alignItems="center" gap="$4">
            <Text onPress={() => router.push("/signup")}>
              Don&apos;t have an account? Create an account.
            </Text>
            <Text onPress={() => router.push("/password/forgot")}>
              Forgot your password?
            </Text>
          </Stack>
        </YStack>
      </Form>
    </KeyboardAvoiding>
  );
}
