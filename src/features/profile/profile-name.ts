export const PROFILE_NAME_MIN_LENGTH = 2;
export const PROFILE_NAME_MAX_LENGTH = 20;

export function normalizeProfileNamePart(value: string): string {
  return value.trim();
}

export function deriveProfileName(firstName: string, lastName: string): string {
  return [firstName, lastName]
    .map(normalizeProfileNamePart)
    .filter(Boolean)
    .join(" ");
}

export function isValidProfileName(firstName: string, lastName: string): boolean {
  const name = deriveProfileName(firstName, lastName);
  return (
    name.length >= PROFILE_NAME_MIN_LENGTH &&
    name.length <= PROFILE_NAME_MAX_LENGTH
  );
}

export function formatDisplayName({
  firstName,
  lastName,
  primaryEmailAddress,
}: {
  firstName?: string | null;
  lastName?: string | null;
  primaryEmailAddress?: string | null;
}): string {
  const derived = deriveProfileName(firstName ?? "", lastName ?? "");
  if (derived) return derived;
  if (primaryEmailAddress) return primaryEmailAddress.split("@")[0];
  return "Explorer";
}
