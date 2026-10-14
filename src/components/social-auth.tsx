import { useSSO } from "@clerk/expo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as AuthSession from "expo-auth-session";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { getAuthErrorMessage } from "../lib/auth-state";
import { useApp } from "../providers/app-provider";
import { colors, Message, shared } from "./ui";

type SocialStrategy = "oauth_apple" | "oauth_google";

export function SocialAuth({
  disabled = false,
  redirectPath,
}: {
  disabled?: boolean;
  redirectPath: "sign-in" | "sign-up";
}) {
  const { startSSOFlow } = useSSO();
  const { clearGuestSession } = useApp();
  const router = useRouter();
  const [submitting, setSubmitting] = useState<SocialStrategy | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const continueWith = async (strategy: SocialStrategy) => {
    if (disabled || submitting) return;
    setSubmitting(strategy);
    setMessage(null);
    try {
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "gav-list",
          path: redirectPath,
          isTripleSlashed: true,
        }),
      });

      if (createdSessionId && setActive) {
        await setActive({
          session: createdSessionId,
          navigate: ({ session }) => {
            clearGuestSession();
            router.replace((session?.currentTask ? "/(auth)/session-task" : "/") as Href);
          },
        });
        clearGuestSession();
      } else if (signIn?.status === "needs_second_factor" || signIn?.status === "needs_client_trust") {
        setMessage("Additional verification is required. Complete sign-in using your email.");
      } else if (signUp?.status === "missing_requirements") {
        setMessage("Additional account details are required. Please use email sign-up to finish.");
      } else {
        setMessage("Sign-in was not completed. Please try again.");
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to continue with this provider."));
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <Text style={[shared.caption, { textAlign: "center" }]}>Or continue with</Text>
      {(["oauth_apple", "oauth_google"] as const).map((strategy) => {
        const name = strategy === "oauth_apple" ? "Apple" : "Google";
        return (
          <Pressable
            key={strategy}
            accessibilityRole="button"
            accessibilityLabel={`Continue with ${name}`}
            disabled={disabled || submitting !== null}
            onPress={() => void continueWith(strategy)}
            style={{
              borderWidth: 1,
              borderColor: colors.line,
              backgroundColor: colors.white,
              borderRadius: 14,
              minHeight: 48,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              opacity: disabled || submitting ? 0.5 : 1,
            }}
          >
            <FontAwesome5
              name={strategy === "oauth_apple" ? "apple" : "google"}
              size={20}
              color={strategy === "oauth_apple" ? colors.ink : "#4285F4"}
            />
            <Text style={{ color: colors.ink, fontSize: 16, fontFamily: "Poppins-SemiBold" }}>
              {submitting === strategy ? "Opening..." : `Continue with ${name}`}
            </Text>
          </Pressable>
        );
      })}
      {message ? <Message text={message} kind="error" /> : null}
    </View>
  );
}