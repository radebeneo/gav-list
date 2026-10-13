import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import SubscriptionCard from "@/components/SubscriptionCard";
import SubscriptionStateView from "@/components/SubscriptionStateView";
import { type Category, CATEGORIES } from "@/lib/places";
import { useApp } from "@/providers/app-provider";
import { useSubscriptions } from "@/providers/SubscriptionContext";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StatusFilter = "all" | "to-visit" | "visited";

export default function SavedPlaces() {
  const { view } = useLocalSearchParams<{ view?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    view === "upcoming" ? "to-visit" : "all"
  );
  const [createVisible, setCreateVisible] = useState(false);

  const { toggleVisited, removePlace } = useApp();
  const { state, subscriptions: allPlaces, createSubscription } = useSubscriptions();

  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPlaces.filter((place) => {
      // Status filter
      if (statusFilter === "to-visit" && place.visited) return false;
      if (statusFilter === "visited" && !place.visited) return false;

      // Category filter
      if (selectedCategory !== "All" && place.category !== selectedCategory) return false;

      // Search filter
      if (!q) return true;
      const haystack = [place.name, place.address, place.notes ?? "", place.category]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [allPlaces, statusFilter, selectedCategory, searchQuery]);

  const openPlaceDetails = (id: string) => {
    router.push({
      pathname: "/(app)/(tabs)/insights",
      params: { id },
    } as any);
  };

  if (state.status !== "ready") return <SubscriptionStateView />;

  return (
    <SafeAreaView className="flex-1 bg-background px-5" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Top Header */}
        <View className="mb-4 flex-row items-center justify-between gap-3">
          <View>
            <Text className="text-3xl font-sans-bold text-primary">Saved Places</Text>
            <Text className="text-xs font-sans-medium text-muted-foreground">
              {filteredPlaces.length} of {allPlaces.length} places
            </Text>
          </View>
          <Pressable
            className="rounded-full bg-primary px-4 py-2.5 active:opacity-90"
            onPress={() => setCreateVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Add place"
          >
            <Text className="font-sans-bold text-background">+ Add Place</Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="mb-3 flex-row items-center rounded-2xl border border-border bg-card px-4 py-3">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search saved places..."
            placeholderTextColor="#888"
            autoCapitalize="none"
            autoCorrect={false}
            className="flex-1 text-base font-sans-medium text-primary"
            accessibilityLabel="Search saved places"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} className="p-1">
              <Text className="text-xs font-sans-bold text-muted-foreground">✕</Text>
            </Pressable>
          )}
        </View>

        {/* Status Filter Tabs (All / To Visit / Visited) */}
        <View className="mb-3 flex-row rounded-2xl bg-muted p-1">
          {(
            [
              { key: "all", label: "All" },
              { key: "to-visit", label: "To Visit" },
              { key: "visited", label: "Visited" },
            ] as const
          ).map((item) => {
            const active = statusFilter === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setStatusFilter(item.key)}
                className={`flex-1 rounded-xl py-2 items-center ${
                  active ? "bg-card shadow-sm" : ""
                }`}
              >
                <Text
                  className={`text-xs font-sans-bold ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Category Filter Chips */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2"
          >
            {(["All", ...CATEGORIES] as (Category | "All")[]).map((cat) => {
              const active = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 border ${
                    active
                      ? "bg-primary border-primary"
                      : "bg-card border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-sans-bold ${
                      active ? "text-background" : "text-primary"
                    }`}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Places List */}
        <FlatList
          data={filteredPlaces}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              onPress={() => openPlaceDetails(item.id)}
              onToggleVisited={() => void toggleVisited(item.id)}
              onDelete={() => void removePlace(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListEmptyComponent={
            <View className="items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8">
              <Text className="text-center text-base font-sans-semibold text-muted-foreground">
                {searchQuery || selectedCategory !== "All" || statusFilter !== "all"
                  ? "No places match your selected filters."
                  : "No saved places yet."}
              </Text>
              {(searchQuery || selectedCategory !== "All" || statusFilter !== "all") && (
                <Pressable
                  onPress={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setStatusFilter("all");
                  }}
                  className="mt-3 rounded-full bg-muted px-4 py-2"
                >
                  <Text className="text-xs font-sans-bold text-primary">Clear Filters</Text>
                </Pressable>
              )}
            </View>
          }
          ItemSeparatorComponent={() => <View className="h-4" />}
          contentContainerClassName="pb-32"
        />
      </KeyboardAvoidingView>

      <CreateSubscriptionModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onSubmit={createSubscription}
      />
    </SafeAreaView>
  );
}
