import { PLACE_CATEGORIES, type Category, type PlaceInput } from "@/lib/places";
import type { SubscriptionActionResult } from "@/features/subscriptions/subscription-controller";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    payload: any,
  ) => Promise<SubscriptionActionResult | void> | void;
  initialSubscription?: any;
  initialData?: any;
}

export default function CreateSubscriptionModal(props: CreateSubscriptionModalProps) {
  const initial = props.initialData ?? props.initialSubscription;
  return (
    <PlaceModalContent
      key={`${props.visible}-${initial?.id ?? "new"}`}
      {...props}
    />
  );
}

function PlaceModalContent({
  visible,
  onClose,
  onSubmit,
  initialSubscription,
  initialData,
}: CreateSubscriptionModalProps) {
  const initial = initialData ?? initialSubscription;
  const [name, setName] = useState(initial?.name ?? "");
  const [address, setAddress] = useState(
    initial?.address ?? initial?.location ?? "",
  );
  const [category, setCategory] = useState<Category>(
    (initial?.category as Category) ?? "Nature",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [visited, setVisited] = useState<boolean>(
    Boolean(initial?.visited),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = name.trim().length > 0 && address.trim().length > 0;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Place name is required.");
      return;
    }
    if (!address.trim()) {
      setError("Address or location is required.");
      return;
    }
    if (name.trim().length > 100) {
      setError("Name must be 100 characters or fewer.");
      return;
    }
    if (address.trim().length > 250) {
      setError("Address must be 250 characters or fewer.");
      return;
    }
    if (notes.trim().length > 500) {
      setError("Notes must be 500 characters or fewer.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: PlaceInput = {
      name: name.trim(),
      address: address.trim(),
      category,
      notes: notes.trim() || undefined,
      visited,
    };

    try {
      const result = await onSubmit(payload);
      if (result && result.status !== "success" && result.status !== "stale") {
        setError(
          result.status === "error" || result.status === "validation-error"
            ? (result as any).failure?.message ?? "Failed to save place."
            : "The result could not be confirmed. Please try again.",
        );
        return;
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save place.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="max-h-[90%] rounded-t-3xl bg-background p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-2xl font-sans-bold text-primary">
              {initialSubscription ? "Edit Place" : "Save a Place"}
            </Text>
            <Pressable onPress={onClose} accessibilityRole="button">
              <Text className="text-base font-sans-semibold text-muted-foreground">
                Cancel
              </Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {error && (
              <View className="mb-4 rounded-xl bg-destructive/10 p-3">
                <Text className="text-sm font-sans-medium text-destructive">
                  {error}
                </Text>
              </View>
            )}

            {/* Name */}
            <View className="mb-4">
              <Text className="mb-1 text-sm font-sans-semibold text-primary">
                Place Name *
              </Text>
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError(null);
                }}
                placeholder="e.g. Copper House Café"
                placeholderTextColor="rgba(0,0,0,0.4)"
                className="rounded-xl border border-border bg-card px-4 py-3 text-base font-sans-medium text-primary"
              />
            </View>

            {/* Address */}
            <View className="mb-4">
              <Text className="mb-1 text-sm font-sans-semibold text-primary">
                Address / Location *
              </Text>
              <TextInput
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  setError(null);
                }}
                placeholder="e.g. Downtown Tucson, AZ"
                placeholderTextColor="rgba(0,0,0,0.4)"
                className="rounded-xl border border-border bg-card px-4 py-3 text-base font-sans-medium text-primary"
              />
            </View>

            {/* Category */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-sans-semibold text-primary">
                Category
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {PLACE_CATEGORIES.map((cat) => {
                  const selected = category === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`rounded-full px-4 py-2 border ${
                        selected
                          ? "bg-primary border-primary"
                          : "bg-card border-border"
                      }`}
                    >
                      <Text
                        className={`text-sm font-sans-semibold ${
                          selected ? "text-background" : "text-primary"
                        }`}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Notes */}
            <View className="mb-4">
              <Text className="mb-1 text-sm font-sans-semibold text-primary">
                Notes (optional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g. Great coffee and pastries after the trail."
                placeholderTextColor="rgba(0,0,0,0.4)"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="min-h-[80px] rounded-xl border border-border bg-card px-4 py-3 text-base font-sans-medium text-primary"
              />
            </View>

            {/* Visited Toggle */}
            <Pressable
              onPress={() => setVisited(!visited)}
              className="mb-6 flex-row items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <View>
                <Text className="text-base font-sans-semibold text-primary">
                  Visited
                </Text>
                <Text className="text-xs font-sans-medium text-muted-foreground">
                  Have you visited this place yet?
                </Text>
              </View>
              <View
                className={`h-7 w-12 rounded-full p-1 transition-colors ${
                  visited ? "bg-accent" : "bg-neutral-300"
                }`}
              >
                <View
                  className={`h-5 w-5 rounded-full bg-white transition-transform ${
                    visited ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </View>
            </Pressable>

            {/* Submit Button */}
            <Pressable
              onPress={() => void handleSubmit()}
              disabled={!isValid || isSubmitting}
              className={`rounded-2xl bg-primary py-4 ${
                !isValid || isSubmitting ? "opacity-50" : ""
              }`}
            >
              <Text className="text-center text-base font-sans-bold text-background">
                {isSubmitting
                  ? "Saving..."
                  : initialSubscription
                    ? "Update Place"
                    : "Save Place"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
