import { useSignUp } from "@clerk/expo";
import { Link, type Href, useRouter } from "expo-router";
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
import { getAuthErrorMessage } from "../../src/lib/auth-state";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { clearGuestSession } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isFetching = fetchStatus === "fetching";
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const finalizeSignUp = async () => {
    const result = await signUp.finalize({
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

  const createAccount = async () => {
    setMessage(null);
    try {
      const result = await signUp.password({
        emailAddress: email.trim(),
        password,
      });
      if (result.error) {
        setMessage(getAuthErrorMessage(result.error));
        return;
      }

      const verification = await signUp.verifications.sendEmailCode();
      if (verification.error) {
        setMessage(getAuthErrorMessage(verification.error));
        return;
      }
      setIsVerifying(true);
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to create your account."));
    }
  };

  const verifyEmail = async () => {
    if (!code.trim()) return;
    setMessage(null);
    try {
      const result = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });
      if (result.error) {
        setMessage(getAuthErrorMessage(result.error));
        return;
      }
      if (signUp.status !== "complete") {
        setMessage("Email verification is not complete. Please check the code and try again.");
        return;
      }
      await finalizeSignUp();
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to verify your email."));
    }
  };

  const resendCode = async () => {
    setMessage(null);
    try {
      const result = await signUp.verifications.sendEmailCode();
      if (result.error) {
        setMessage(getAuthErrorMessage(result.error));
      } else {
        setMessage(`A new verification code was sent to ${email.trim()}.`);
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to resend the verification code."));
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
            {isVerifying
              ? `Enter the verification code sent to ${email.trim()}.`
              : "Create an account to keep your saved places with you."}
          </Text>

          <View style={[shared.card, { gap: 16 }]}>
            <Text style={shared.sectionTitle}>
              {isVerifying ? "Verify your email" : "Create your account"}
            </Text>
            {isVerifying ? (
              <>
                <Field
                  label="Verification code"
                  value={code}
                  onChangeText={setCode}
                  placeholder="Enter the code from your email"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />
                <Button
                  title={isFetching ? "Verifying..." : "Verify email"}
                  onPress={() => void verifyEmail()}
                  disabled={isFetching || !code.trim()}
                />
                <Pressable disabled={isFetching} onPress={() => void resendCode()}>
                  <Text style={{ color: colors.green, fontWeight: "700", textAlign: "center" }}>
                    Resend code
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
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
                  placeholder="At least 8 characters"
                  secureTextEntry
                  autoCapitalize="none"
                />
                {errors.fields.emailAddress ? (
                  <Message text={errors.fields.emailAddress.message} kind="error" />
                ) : null}
                {errors.fields.password ? (
                  <Message text={errors.fields.password.message} kind="error" />
                ) : null}
                <Button
                  title={isFetching ? "Creating account..." : "Create account"}
                  onPress={() => void createAccount()}
                  disabled={isFetching || !emailValid || password.length < 8}
                />
                <View nativeID="clerk-captcha" />
              </>
            )}
            {message ? <Message text={message} kind="error" /> : null}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
            <Text style={shared.caption}>Already have an account?</Text>
            <Link href={"/(auth)/sign-in" as Href}>
              <Text style={{ color: colors.green, fontWeight: "700" }}>Sign in</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
