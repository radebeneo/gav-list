import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, colors, Field, Message, shared } from "../../src/components/ui";
import { useApp } from "../../src/providers/app-provider";
import {
  getAuthErrorMessage,
  getMfaStrategyLabel,
  getSupportedMfaStrategies,
  type SupportedMfaStrategy,
} from "../../src/lib/auth-state";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { signOut: signOutClerk } = useAuth();
  const { setGuestSession, clearGuestSession } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [mfaStrategy, setMfaStrategy] =
    useState<SupportedMfaStrategy | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const isFetching = fetchStatus === "fetching";
  const supportedStrategies = getSupportedMfaStrategies(
    signIn.supportedSecondFactors,
  );
  const needsMfa =
    signIn.status === "needs_second_factor" ||
    signIn.status === "needs_client_trust";

  const finalizeSignIn = async () => {
    const result = await signIn.finalize({
      navigate: ({ session }) => {
        router.replace(
          (session?.currentTask ? "/(auth)/session-task" : "/") as Href,
        );
      },
    });
    if (result.error) {
      setMessage(getAuthErrorMessage(result.error));
      return;
    }
    clearGuestSession();
  };

  const prepareMfa = async (strategy: SupportedMfaStrategy) => {
    setMfaStrategy(strategy);
    setCode("");
    setMessage(null);
    try {
      const result =
        strategy === "email_code"
          ? await signIn.mfa.sendEmailCode()
          : strategy === "phone_code"
            ? await signIn.mfa.sendPhoneCode()
            : null;
      if (result?.error) setMessage(getAuthErrorMessage(result.error));
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    }
  };

  const submitSignIn = async () => {
    setMessage(null);
    try {
      const result = await signIn.password({
        identifier: email.trim(),
        password,
      });
      if (result.error) {
        setMessage(getAuthErrorMessage(result.error));
      } else if (signIn.status === "complete") {
        await finalizeSignIn();
      } else if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_client_trust"
      ) {
        const strategies = getSupportedMfaStrategies(
          signIn.supportedSecondFactors,
        );
        if (strategies.length === 0) {
          setMessage("This account requires a verification method that is not supported here.");
        } else {
          await prepareMfa(strategies[0]);
        }
      } else {
        setMessage("Sign-in needs an additional step. Reset your password or try again.");
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to sign in."));
    }
  };

  const verifyMfa = async () => {
    if (!mfaStrategy || !code.trim()) return;
    setMessage(null);
    try {
      const result =
        mfaStrategy === "email_code"
          ? await signIn.mfa.verifyEmailCode({ code: code.trim() })
          : mfaStrategy === "phone_code"
            ? await signIn.mfa.verifyPhoneCode({ code: code.trim() })
            : mfaStrategy === "totp"
              ? await signIn.mfa.verifyTOTP({ code: code.trim() })
              : await signIn.mfa.verifyBackupCode({ code: code.trim() });

      if (result.error) {
        setMessage(getAuthErrorMessage(result.error));
      } else if (signIn.status === "complete") {
        await finalizeSignIn();
      } else {
        setMessage("Verification is not complete. Try another method or start over.");
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to verify your code."));
    }
  };

  const continueAsGuest = async () => {
    setMessage(null);
    try {
      await setGuestSession();
      router.replace("/");
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to start a guest session."));
    }
  };

  const startOver = async () => {
    setMessage(null);
    setMfaStrategy(null);
    setCode("");
    try {
      const result = await signIn.reset();
      if (result.error) setMessage(getAuthErrorMessage(result.error));
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    }
  };

  const signOutAndRestart = async () => {
    try {
      await signOutClerk();
      clearGuestSession();
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to sign out."));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[shared.screen, { justifyContent: "center", gap: 16 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={shared.title}>Gav List</Text>
          <Text style={shared.caption}>
            {needsMfa
              ? "Verify your identity to continue to your saved places."
              : "Keep your favorite places in one list, wherever you go."}
          </Text>

          <View style={[shared.card, { gap: 16 }]}>
            <Text style={shared.sectionTitle}>
              {needsMfa ? "Verify your identity" : "Welcome back"}
            </Text>
            {needsMfa ? (
              <View style={{ gap: 16 }}>
              <>
              <>
              <>
              <>
                {mfaStrategy ? (
                  <Field
                    label={mfaStrategy === "backup_code" ? "Backup code" : "Verification code"}
                    value={code}
                    onChangeText={setCode}
                    placeholder={
                      mfaStrategy === "backup_code"
                        ? "Enter a backup code"
                        : "Enter the code"
                    }
                    keyboardType={mfaStrategy === "backup_code" ? "default" : "number-pad"}
                    autoCapitalize="none"
                  />
                ) : null}
                {supportedStrategies.map((strategy) => (
                  <Pressable
                    key={strategy}
                    disabled={isFetching}
                    onPress={() => void prepareMfa(strategy)}
                  >
                    <Text style={{ color: colors.green, fontWeight: "700", textAlign: "center" }}>
                      {strategy === mfaStrategy ? "Resend " : "Use "}
                      {getMfaStrategyLabel(strategy)}
                    </Text>
                  </Pressable>
                ))}
                <Button
                  title={isFetching ? "Verifying..." : "Verify"}
                  onPress={() => void verifyMfa()}
                  disabled={isFetching || !mfaStrategy || !code.trim()}
                />
                <Button
                  title="Start over"
                  onPress={() => void startOver()}
                  disabled={isFetching}
                />
                <Button
                  title="Sign out and restart"
                  onPress={() => void signOutAndRestart()}
                  disabled={isFetching}
                />
              </View>
            ) : (
              <View style={{ gap: 16 }}>
                <Field
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Field
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                  autoCapitalize="none"
                />
                {errors.fields.identifier ? (
                  <Message text={errors.fields.identifier.message} kind="error" />
                ) : null}
                {errors.fields.password ? (
                  <Message text={errors.fields.password.message} kind="error" />
                ) : null}
                {message ? <Message text={message} kind="error" /> : null}
                <Button
                  title={isFetching ? "Signing in..." : "Sign in"}
                  onPress={() => void submitSignIn()}
                  disabled={isFetching || !email.trim() || !password}
                />
                <Link href={"/(auth)/reset-password" as Href} asChild>
                  <Pressable>
                    <Text style={{ color: colors.green, fontWeight: "700", textAlign: "center" }}>
                      Forgot password?
                    </Text>
                  </Pressable>
                </Link>
                <Link href={"/(auth)/sign-up" as Href} asChild>
                  <Pressable>
                    <Text style={{ color: colors.green, fontWeight: "700", textAlign: "center" }}>
                      Create an account
                    </Text>
                  </Pressable>
                </Link>
                <Button
                  title="Continue as guest"
                  onPress={() => void continueAsGuest()}
                  disabled={isFetching}
                />
                <View nativeID="clerk-captcha" />
              </View>
            )}
            {needsMfa && errors.fields.code ? (
              <Message text={errors.fields.code.message} kind="error" />
            ) : null}
            {needsMfa && message ? <Message text={message} kind="error" /> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
