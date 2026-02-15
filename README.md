# Bite 🍔

Bite is a modern, high-performance food delivery mobile application built with **React Native**, **Expo**, and **NativeWind**. It offers a seamless user experience for browsing menus, searching for favorite meals, and managing a digital shopping cart, all backed by a robust backend using **Appwrite**.

## ✨ Features

- **Authentication**: Secure user login and registration powered by Appwrite.
- **Dynamic Menu Browsing**: Explore a wide variety of food options with high-quality images and detailed descriptions.
- **Advanced Search**: Quickly find the meals you're craving.
- **Shopping Cart**: Effortlessly add items, manage quantities, and prepare for checkout.
- **Modern UI/UX**: Beautifully designed interface using Tailwind CSS (NativeWind) for a consistent look and feel across platforms.
- **State Management**: Fast and scalable state handling with Zustand.
- **Monitoring**: Error tracking and performance monitoring integrated with Sentry.

## 🚀 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Backend**: [Appwrite](https://appwrite.io/) (Auth, Database, Storage)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Images**: [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)
- **Error Tracking**: [Sentry](https://sentry.io/)

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your mobile device (or an emulator/simulator)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bite.git
   cd bite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Appwrite and Sentry credentials (see `.env.example` if available).

### Running the App

Start the development server:

```bash
npx expo start
```

- Open the **Expo Go** app on your phone and scan the QR code.
- Press `a` for Android emulator.
- Press `i` for iOS simulator.
- Press `w` for web.

## 📁 Project Structure

```text
├── app/               # Expo Router pages and layouts
│   ├── (auth)/        # Authentication screens (Sign In/Up)
│   ├── (tabs)/        # Main app tabs (Home, Search, Cart, Profile)
│   └── _layout.tsx    # Root layout
├── components/        # Reusable UI components
├── constants/         # App constants (images, themes, dummy data)
├── lib/               # Utility functions and API clients (Appwrite)
├── store/             # Zustand store definitions
├── assets/            # Static assets (images, fonts)
└── tailwind.config.js # Tailwind CSS configuration
```

## 📝 License

This project is [MIT](./LICENSE) licensed.

---

Built with ❤️ for food lovers.
