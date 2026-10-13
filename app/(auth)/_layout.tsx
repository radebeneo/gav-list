import { useAuth, useSession } from "@clerk/expo";
import { Redirect, Stack, usePathname, type Href } from "expo-router";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isLoaded: isSessionLoaded, session } = useSession();
  const pathname = usePathname();

  if (!isLoaded || !isSessionLoaded) return null;

  if (session?.currentTask && pathname !== "/session-task") {
    return <Redirect href={"/(auth)/session-task" as Href} />;
  }

  if (isSignedIn && !session?.currentTask) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
