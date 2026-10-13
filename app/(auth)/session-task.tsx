import { useAuth, useSession } from "@clerk/expo";
import { Redirect, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Message, shared } from "../../src/components/ui";
import { getAuthErrorMessage, getSessionTaskCopy } from "../../src/lib/auth-state";

export default function SessionTask() {
  const { isLoaded, session } = useSession();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isLoaded) return null;
  if (!session) return <Redirect href={"/(auth)/sign-in" as Href} />;
  if (!session.currentTask) return <Redirect href="/" />;

  const copy = getSessionTaskCopy(session.currentTask.key);

  const checkAgain = async () => {
    setIsWorking(true);
    setMessage(null);
    try {
      const updatedSession = await session.touch();
      if (!updatedSession.currentTask) {
        router.replace("/");
      } else {
        setMessage(
          "This account action is still required. Complete it in your Clerk account, then check again.",
        );
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to refresh your account state."));
    } finally {
      setIsWorking(false);
    }
  };

  const restart = async () => {
    setIsWorking(true);
    setMessage(null);
    try {
      await signOut();
      router.replace("/(auth)/sign-in" as Href);
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Unable to sign out."));
      setIsWorking(false);
    }
  };

  return (
    <SafeAreaView style={[shared.screen, { justifyContent: "center" }]}>
      <View style={[shared.card, { gap: 16 }]}>
        <Text style={shared.title}>{copy.title}</Text>
        <Text style={shared.body}>{copy.description}</Text>
        <Text style={shared.caption}>
          Gav List will keep your account protected until Clerk confirms this step is complete.
        </Text>
        {message ? <Message text={message} kind="error" /> : null}
        <Button
          title={isWorking ? "Checking..." : "Check again"}
          onPress={() => void checkAgain()}
          disabled={isWorking}
        />
        <Button
          title="Sign out and restart"
          onPress={() => void restart()}
          disabled={isWorking}
        />
      </View>
    </SafeAreaView>
  );
}
