import images from "@/config/images";
import { deleteAccount } from "@/features/account/account-deletion";
import { formatDisplayName } from "@/features/profile/profile-name";
import { useApp } from "@/providers/app-provider";
import { useAuth, useSessionList, useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const { signOut, sessionId } = useAuth();
  const { user } = useUser();
  const sessionList = useSessionList();
  const { places, sessionMode, signOut: appSignOut } = useApp();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);

  const otherSessions =
    sessionList.isLoaded && sessionId
      ? sessionList.sessions.filter((session) => session.id !== sessionId)
      : [];

  const visitedCount = places.filter((p) => p.visited).length;

  const handleUpdateProfile = async () => {
    if (!user) return;
    setBusy(true);
    setMessage(null);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setIsEditingName(false);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Could not update profile. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await signOut();
      appSignOut();
      router.replace("/(auth)/sign-in" as any);
    } catch {
      setMessage("We could not sign you out. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const removeOtherSessions = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await Promise.all(otherSessions.map((session) => session.remove()));
      setMessage("Other sessions registered on this device were signed out.");
    } catch {
      setMessage("Some sessions could not be removed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAccount = async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (user) {
        await deleteAccount({
          deleteProviderUser: () => user.delete(),
        });
      }
      appSignOut();
      router.replace("/(auth)/sign-in" as any);
    } catch {
      setMessage("We could not finish deleting your account. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Delete Gav List Account?",
      "This permanently removes your account and all saved places from this device.",
      [
        { text: "Keep Account", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            void handleDeleteAccount();
          },
        },
      ]
    );
  };

  const currentDisplayName = user
    ? formatDisplayName({
        firstName: user.firstName,
        lastName: user.lastName,
        primaryEmailAddress: user.emailAddresses[0]?.emailAddress,
      })
    : sessionMode === "guest"
    ? "Guest Explorer"
    : "Explorer";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32">
        <Text className="text-3xl font-sans-bold text-primary">Settings</Text>

        {/* Profile Card */}
        <View className="mt-6 rounded-3xl border border-border bg-card p-5">
          <Text className="text-xs font-sans-semibold uppercase tracking-wider text-muted-foreground">
            Profile
          </Text>

          <View className="mt-4 flex-row items-center gap-4">
            <Image
              className="h-16 w-16 rounded-full border border-border"
              source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            />
            <View className="flex-1">
              <Text className="text-xl font-sans-bold text-primary">
                {currentDisplayName}
              </Text>
              <Text className="text-sm font-sans-medium text-muted-foreground">
                {user?.emailAddresses[0]?.emailAddress ||
                  (sessionMode === "guest"
                    ? "Guest Mode (Local storage)"
                    : "No email")}
              </Text>
            </View>
          </View>

          {/* Edit Name Section */}
          {user && (
            <View className="mt-5 border-t border-border/50 pt-4">
              {isEditingName ? (
                <View className="gap-3">
                  <View>
                    <Text className="mb-1 text-xs font-sans-semibold text-muted-foreground">
                      First Name
                    </Text>
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="First name"
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-sans-medium text-primary"
                    />
                  </View>
                  <View>
                    <Text className="mb-1 text-xs font-sans-semibold text-muted-foreground">
                      Last Name
                    </Text>
                    <TextInput
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Last name"
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-sans-medium text-primary"
                    />
                  </View>
                  <View className="mt-2 flex-row gap-2">
                    <Pressable
                      onPress={handleUpdateProfile}
                      disabled={busy}
                      className="flex-1 rounded-xl bg-primary py-2.5 items-center"
                    >
                      {busy ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text className="text-xs font-sans-bold text-background">
                          Save Changes
                        </Text>
                      )}
                    </Pressable>
                    <Pressable
                      onPress={() => setIsEditingName(false)}
                      className="rounded-xl border border-border px-4 py-2.5 items-center"
                    >
                      <Text className="text-xs font-sans-bold text-muted-foreground">
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  onPress={() => {
                    setFirstName(user.firstName ?? "");
                    setLastName(user.lastName ?? "");
                    setIsEditingName(true);
                  }}
                  className="self-start rounded-full bg-muted px-4 py-2"
                >
                  <Text className="text-xs font-sans-semibold text-primary">
                    Edit Profile Name
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        {/* Places Statistics Card */}
        <View className="mt-5 rounded-3xl border border-border bg-card p-5">
          <Text className="text-xs font-sans-semibold uppercase tracking-wider text-muted-foreground">
            Gav List Stats
          </Text>
          <View className="mt-3 flex-row gap-4">
            <View className="flex-1 rounded-2xl bg-muted p-3">
              <Text className="text-2xl font-sans-extrabold text-primary">
                {places.length}
              </Text>
              <Text className="mt-0.5 text-xs font-sans-medium text-muted-foreground">
                Total Places
              </Text>
            </View>
            <View className="flex-1 rounded-2xl bg-emerald-50 p-3">
              <Text className="text-2xl font-sans-extrabold text-emerald-800">
                {visitedCount}
              </Text>
              <Text className="mt-0.5 text-xs font-sans-medium text-emerald-700">
                Visited
              </Text>
            </View>
            <View className="flex-1 rounded-2xl bg-amber-50 p-3">
              <Text className="text-2xl font-sans-extrabold text-amber-800">
                {places.length - visitedCount}
              </Text>
              <Text className="mt-0.5 text-xs font-sans-medium text-amber-700">
                To Visit
              </Text>
            </View>
          </View>
        </View>

        {/* Security / Session Management */}
        {sessionList.isLoaded && otherSessions.length > 0 && (
          <View className="mt-5 rounded-3xl border border-border bg-card p-5">
            <Text className="text-base font-sans-bold text-primary">
              Active Sessions
            </Text>
            <Text className="mt-1 text-xs font-sans-medium text-muted-foreground">
              {`${otherSessions.length} other session${
                otherSessions.length === 1 ? "" : "s"
              } active on this account`}
            </Text>
            <Pressable
              disabled={busy}
              onPress={removeOtherSessions}
              className="mt-3 rounded-xl border border-border bg-muted py-2.5 items-center"
            >
              <Text className="text-xs font-sans-bold text-primary">
                Sign Out Other Sessions
              </Text>
            </Pressable>
          </View>
        )}

        {/* Messages */}
        {message && (
          <Text className="mt-4 text-center text-sm font-sans-medium text-primary">
            {message}
          </Text>
        )}

        {/* Sign Out Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          className="mt-5 rounded-2xl bg-accent py-4 items-center active:opacity-90"
          disabled={busy}
          onPress={handleSignOut}
        >
          <Text className="text-center text-base font-sans-bold text-primary">
            Sign Out
          </Text>
        </Pressable>

        {/* Delete Account */}
        <View className="mt-8 rounded-3xl border border-red-200 bg-red-50/50 p-5">
          <Text className="text-base font-sans-bold text-destructive">
            Delete Account
          </Text>
          <Text className="mt-1 text-xs font-sans-medium text-muted-foreground">
            Permanently removes your account and all saved places.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete account"
            className="mt-4 rounded-xl bg-destructive py-3 items-center active:opacity-90"
            disabled={busy}
            onPress={confirmDeleteAccount}
          >
            <Text className="text-center text-xs font-sans-bold text-white">
              Delete Account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
