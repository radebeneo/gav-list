import React, { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useApp } from "@/providers/app-provider";
import { toDisplaySubscription } from "@/features/subscriptions/subscription-display";
import type {
  CreateSubscriptionRequest,
  SubscriptionActionResult,
  SubscriptionActionState,
  SubscriptionState,
  UpdateSubscriptionRequest,
} from "@/features/subscriptions/subscription-controller";
import type { PlaceInput } from "@/lib/places";

interface SubscriptionContextValue {
  state: SubscriptionState;
  actionState: SubscriptionActionState;
  subscriptions: Subscription[];
  provision: () => Promise<void>;
  retry: () => Promise<void>;
  clearAction: () => void;
  getSubscription: (id: string) => Promise<SubscriptionActionResult>;
  createSubscription: (
    payload: CreateSubscriptionRequest,
  ) => Promise<SubscriptionActionResult>;
  updateSubscription: (
    id: string,
    payload: UpdateSubscriptionRequest,
  ) => Promise<SubscriptionActionResult>;
  cancelSubscription: (id: string) => Promise<SubscriptionActionResult>;
  deleteSubscription: (id: string) => Promise<SubscriptionActionResult>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const {
    places,
    isLoading,
    error: appError,
    addPlace,
    updatePlace,
    removePlace,
    toggleVisited,
    getPlace,
  } = useApp();
  const [actionState, setActionState] = useState<SubscriptionActionState>({
    status: "idle",
  });

  const subscriptions = useMemo(
    () => places.map(toDisplaySubscription),
    [places],
  );

  const state: SubscriptionState = useMemo(() => {
    if (isLoading) {
      return {
        status: "loading-subscriptions",
        identity: { clerkUserId: "", userId: "", provisioned: true },
      };
    }
    if (appError) {
      return {
        status: "error",
        identity: null,
        failure: {
          operation: "subscriptions",
          code: "APP_ERROR",
          kind: "client",
          message: appError,
          retryable: true,
          mutationMayHaveCompleted: false,
        },
      };
    }
    return {
      status: "ready",
      identity: {
        provider: "clerk",
        clerkUserId: "current-user",
        userId: "current-user",
        provisioned: true,
      },
      subscriptions: places as any,
    };
  }, [isLoading, appError, places]);

  const clearAction = () => {
    setActionState({ status: "idle" });
  };

  const getSubscription = async (id: string): Promise<SubscriptionActionResult> => {
    const found = getPlace(id);
    if (!found) {
      const failure = {
        operation: "get" as const,
        code: "SUBSCRIPTION_NOT_FOUND",
        kind: "client",
        message: "Place not found.",
        retryable: false,
        mutationMayHaveCompleted: false,
      };
      return { status: "error", operation: "get", subscriptionId: id, failure };
    }
    return {
      status: "success",
      operation: "get",
      subscriptionId: id,
      subscription: found as any,
    };
  };

  const createSubscription = async (
    payload: CreateSubscriptionRequest,
  ): Promise<SubscriptionActionResult> => {
    try {
      setActionState({ status: "pending", operation: "create" });
      const input: PlaceInput = {
        name: payload.name,
        address: payload.address || payload.plan || payload.paymentMethod || "Saved Place",
        category: (payload.category as any) || "Other",
        notes: payload.notes || undefined,
        visited: Boolean(payload.visited),
      };
      const created = await addPlace(input);
      const result: SubscriptionActionResult = {
        status: "success",
        operation: "create",
        subscriptionId: created.id,
        subscription: created as any,
      };
      setActionState(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save place.";
      const failure = {
        operation: "create" as const,
        code: "CREATE_PLACE_FAILED",
        kind: "client",
        message,
        retryable: true,
        mutationMayHaveCompleted: false,
      };
      const result: SubscriptionActionResult = {
        status: "error",
        operation: "create",
        failure,
      };
      setActionState(result);
      return result;
    }
  };

  const updateSubscription = async (
    id: string,
    payload: UpdateSubscriptionRequest,
  ): Promise<SubscriptionActionResult> => {
    try {
      setActionState({ status: "pending", operation: "update", subscriptionId: id });
      const input: Partial<PlaceInput> = {};
      if (payload.name !== undefined) input.name = payload.name;
      if (payload.address !== undefined) input.address = payload.address;
      if (payload.category !== undefined) input.category = payload.category as any;
      if (payload.notes !== undefined) input.notes = payload.notes;
      if (payload.visited !== undefined) input.visited = payload.visited;

      const updated = await updatePlace(id, input);
      if (!updated) {
        throw new Error("Place not found for update.");
      }
      const result: SubscriptionActionResult = {
        status: "success",
        operation: "update",
        subscriptionId: id,
        subscription: updated as any,
      };
      setActionState(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update place.";
      const failure = {
        operation: "update" as const,
        code: "UPDATE_PLACE_FAILED",
        kind: "client",
        message,
        retryable: true,
        mutationMayHaveCompleted: false,
      };
      const result: SubscriptionActionResult = {
        status: "error",
        operation: "update",
        subscriptionId: id,
        failure,
      };
      setActionState(result);
      return result;
    }
  };

  const cancelSubscription = async (
    id: string,
  ): Promise<SubscriptionActionResult> => {
    try {
      setActionState({ status: "pending", operation: "cancel", subscriptionId: id });
      await toggleVisited(id);
      const place = getPlace(id);
      const result: SubscriptionActionResult = {
        status: "success",
        operation: "cancel",
        subscriptionId: id,
        subscription: place as any,
      };
      setActionState(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to toggle place status.";
      const failure = {
        operation: "cancel" as const,
        code: "TOGGLE_VISITED_FAILED",
        kind: "client",
        message,
        retryable: true,
        mutationMayHaveCompleted: false,
      };
      const result: SubscriptionActionResult = {
        status: "error",
        operation: "cancel",
        subscriptionId: id,
        failure,
      };
      setActionState(result);
      return result;
    }
  };

  const deleteSubscription = async (
    id: string,
  ): Promise<SubscriptionActionResult> => {
    try {
      setActionState({ status: "pending", operation: "delete", subscriptionId: id });
      await removePlace(id);
      const result: SubscriptionActionResult = {
        status: "success",
        operation: "delete",
        subscriptionId: id,
      };
      setActionState(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete place.";
      const failure = {
        operation: "delete" as const,
        code: "DELETE_PLACE_FAILED",
        kind: "client",
        message,
        retryable: true,
        mutationMayHaveCompleted: false,
      };
      const result: SubscriptionActionResult = {
        status: "error",
        operation: "delete",
        subscriptionId: id,
        failure,
      };
      setActionState(result);
      return result;
    }
  };

  const provision = async () => undefined;
  const retry = async () => undefined;

  return (
    <SubscriptionContext.Provider
      value={{
        state,
        actionState,
        subscriptions,
        provision,
        retry,
        clearAction,
        getSubscription,
        createSubscription,
        updateSubscription,
        cancelSubscription,
        deleteSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions(): SubscriptionContextValue {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscriptions must be used within SubscriptionProvider");
  }
  return context;
}
