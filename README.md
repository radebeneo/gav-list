# Gav List

Gav List is a mobile-first personal places-to-visit app. It lets a user keep a private list of saved recommendations, search it locally, and hand off a result to Google Maps without needing an in-app map or a location API.

## Features

- Email/password account support via Firebase Auth
- Explicit guest demo mode with local-only storage
- Save, search, filter, mark visited, and delete places
- Google Maps search handoff from each saved place
- Private per-user Firestore data boundaries

## Tech stack

- Expo / React Native
- Expo Router
- Firebase Authentication and Cloud Firestore
- AsyncStorage for guest data
- React Context for session and place state

## Getting started

1. Install dependencies:

   npm install

2. Configure your Firebase web/client settings in `.env` or the app config.

3. Start the app:

   npx expo start

## Project structure

```text
app/                # Expo app entry files
src/                # Gav List app logic and screens
  app/              # protected screens and router layout
  components/      # shared UI primitives
  lib/              # validation, storage, and Firebase helpers
  providers/        # session and places state
  tests/            # node tests for validation and guest storage
firestore.rules     # Firestore owner-only access rules
```

## Notes

- Account data stays in `users/{uid}/places/{placeId}`.
- Guest data is kept on-device only and never merges into an account.
- This repository mirrors the Gav List product requirements documented in `context/` and the local `PRD.md`/`MVP.md` notes.
