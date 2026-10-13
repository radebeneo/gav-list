# Gav List

Gav List is a mobile-first personal places-to-visit app. It lets a user keep a private list of saved recommendations, search it locally, and hand off a result to Google Maps without needing an in-app map or a location API.

## Features

- Email/password and Google/Apple authentication via Clerk, including email verification
- Explicit guest demo mode with local-only storage
- Save, search, filter, mark visited, and delete places
- Google Maps search handoff from each saved place

## Tech stack

- Expo / React Native
- Expo Router
- Clerk Authentication
- Expo SecureStore for Clerk session tokens
- AsyncStorage for guest data
- React Context for session and place state

## Getting started

1. Install dependencies:

   npm install

2. Create a Clerk application with email and password sign-in, email verification and required first/last name enabled for sign-up, plus the Google and Apple social connections.

3. Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env` using the publishable key from the Clerk Dashboard. Use `.env.example` as a reference so existing local configuration is preserved.

4. Start the app:

   npx expo start

Clerk sessions are persisted using platform secure storage. Guest places remain local to the device. Account sign-in is configured; account place syncing still requires a data backend.

## Project structure

```text
app/                # Expo app entry files
src/                # Gav List app logic and screens
  components/      # shared UI primitives
  lib/              # validation and guest storage helpers
  providers/        # session and places state
  tests/            # node tests for validation and guest storage
```

## Notes

- Guest data is kept on-device only and never merges into an account.
