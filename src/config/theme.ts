export const colors = {
    background: "#F7F4EC",
    foreground: "#1D3F31",
    card: "#FFFFFF",
    muted: "#EEEAE0",
    mutedForeground: "#817B70",
    primary: "#1D3F31",
    accent: "#1D3F31",
    border: "#E8E3D9",
    success: "#2F7657",
    destructive: "#B5473A",
    subscription: "#DCE8D8",
} as const;

export const spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    18: 72,
    20: 80,
    24: 96,
    30: 120,
} as const;

export const components = {
    tabBar: {
        height: spacing[18],
        horizontalInset: spacing[5],
        radius: spacing[8],
        iconFrame: spacing[12],
        itemPaddingVertical: spacing[2],
    },
} as const;

export const theme = {
    colors,
    spacing,
    components,
} as const;