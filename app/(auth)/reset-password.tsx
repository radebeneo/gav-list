import { useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, colors, Field, Message, shared } from "../../src/components/ui";
import { getAuthErrorMessage } from "../../src/lib/auth-state";
import { useApp } from "../../src/providers/app-provider";

type RecoveryStep = "email" | "code" | "password";

export default function ResetPassword() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { clearGuestSession } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const isFetching = fetchStatus === "fetching";
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordValid = password.length >= 8 && password === confirmPassword;

  const sendCode = async () => {
    if (!emailValid) return;
    setMessage(null);
    try {
      const resetResult = await signIn.reset();
      if (resetResult.error) {
        setMessage(getAuthErrorMessage(resetResult.error));
        return;
      }
      const createResult = await signIn.create({ identifier: email.trim() });
      if (createResult.error) {
        setMessage(getAuthErrorMessage(createResult.error));
        return;
      }
      const result = await signIn.resetPasswordEmailCode.sendCode();
      if (result.error) {
        setMessage(getAuthErrorMessage(result.error));
        return;
      }
      setCode("");
      setStep("code");
      setMessage(`We sent a recovery code to ${email.trim()}.`);
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to send a recovery code."));
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) return;
    setMessage(null);
    try {
      const result = await signIn.resetPasswordEmailCode.verifyCode({
        code: code.trim(),
      });
      if (result.error) {
        setMessage(getAuthErrorMessage(result.error));
        return;
      }
      if (signIn.status !== "needs_new_password") {
        setMessage("The code could not be verified. Request a new code.");
        return;
      }
      setStep("password");
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to verify the recovery code."));
    }
  };

  const submitPassword = async () => {
    if (!passwordValid) return;
    setMessage(null);
    try {
      const result = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      });
      if (result.error) {
        setMessage(getAuthErrorMessage(result.error));
        return;
      }
      if (signIn.status !== "complete") {
        setMessage("Your password was updated, but sign-in still needs attention.");
        return;
      }
      const finalizeResult = await signIn.finalize({
        navigate: ({ session }) => {
          router.replace(
            (session?.currentTask ? "/(auth)/session-task" : "/") as Href,
          );
        },
      });
      if (finalizeResult.error) {
        setMessage(getAuthErrorMessage(finalizeResult.error));
      } else {
        clearGuestSession();
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to update your password."));
    }
  };

  const restart = async () => {
    setMessage(null);
    try {
      const result = await signIn.reset();
      if (result.error) {
        setMessage(getAuthErrorMessage(result.error));
        return;
      }
      setCode("");
      setPassword("");
      setConfirmPassword("");
      setStep("email");
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    }
  };

  const title =
    step === "email"
      ? "Reset your password"
      : step === "code"
        ? "Check your email"
        : "Choose a new password";
  const fieldError =
    errors.fields.identifier?.message ??
    errors.fields.code?.message ??
    errors.fields.password?.message;
  const disabled =
    isFetching ||
    (step === "email" && !emailValid) ||
    (step === "code" && !code.trim()) ||
    (step === "password" && !passwordValid);
  const onContinue =
    step === "email"
      ? sendCode
      : step === "code"
        ? verifyCode
        : submitPassword;

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
           <Text style={[shared.title, { textAlign: "center" }]}>Gav List</Text>
           <Text style={[shared.caption, { textAlign: "center" }]}>{title}</Text>
          <View style={[shared.card, { gap: 16 }]}>
            {step === "email" ? (
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : null}
            {step === "code" ? (
              <Field
                label="Recovery code"
                value={code}
                onChangeText={setCode}
                placeholder="Enter the code from your email"
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            ) : null}
            {step === "password" ? (
              <>
                <Field
                  label="New password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 8 characters"
                  secureTextEntry
                  autoCapitalize="none"
                />
                <Field
                  label="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repeat your new password"
                  secureTextEntry
                  autoCapitalize="none"
                />
                {confirmPassword && password !== confirmPassword ? (
                  <Message text="Passwords do not match." kind="error" />
                ) : null}
              </>
            ) : null}
            {message || fieldError ? (
              <Message text={message ?? fieldError ?? ""} kind="error" />
            ) : null}
            <Button
              title={
                isFetching
                  ? "Please wait..."
                  : step === "email"
                    ? "Send recovery code"
                    : step === "code"
                      ? "Verify code"
                      : "Update password"
              }
              onPress={() => void onContinue()}
              disabled={disabled}
            />
            {step !== "email" ? (
              <Button
                title="Start over"
                onPress={() => void restart()}
                disabled={isFetching}
              />
            ) : null}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
            <Text style={shared.caption}>Remembered your password?</Text>
            <Link href={"/(auth)/sign-in" as Href}>
              <Text style={{ color: colors.green, fontWeight: "700" }}>Sign in</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
