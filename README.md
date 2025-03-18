# Budgie - Make your budget fly 💸

Budgie is a modern e-commerce mobile app built for those on a tight budget. Created with React Native and Expo, featuring a beautiful UI with smooth animations and a focus on discount discovery. The app helps users find the best deals and manage their shopping cart efficiently.

The CoolShop name didn't cut it for me, so I decided to make my own! 🤩

## Getting Started 🚀

1. Clone the repository
   ```bash
   git clone https://github.com/JSimai/Budgie.git
   cd budgie
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Install Expo Go on your mobile device
   - [iOS App Store](https://apps.apple.com/app/apple-store/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

4. Start the development server
   ```bash
   npm start
   ```

5. Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android)

## Features ✨

### Product Discovery
- **Smart Grid Layout**: Responsive product grid with smooth animations
- **Filtering**: Filter products by category
- **Search Functionality**: Real-time search with debounced queries
- **Sort Options**: Multiple sorting options (biggest discount, price, etc.)

### Shopping Experience
- **Animated Cart Controls**: Smooth transitions when adding/removing items
- **Quantity Management**: Intuitive quantity controls with increment/decrement
- **Wishlist**: Save items for later with price tracking
- **Price Alerts**: Set alerts for price drops on wishlist items

### UI/UX Features
- **Dark Mode Support**: Full dark mode implementation
- **Smooth Animations**: Throughout the app for a polished feel
  - Staggered product card animations
  - Cart button state transitions
  - Smooth filter/sort animations
- **Haptic Feedback**: Native feeling interactions
- **Pull-to-Refresh**: Update product listings with a pull gesture

### State Management
- **Redux Integration**: Centralized state management for cart and wishlist
- **Persistent Storage**: Save user preferences and cart items
- **Real-time Updates**: Immediate UI updates on state changes

## Tech Stack 🛠️

- React Native
- Expo
- Redux Toolkit
- TypeScript
- Cursor

## Reasoning 🤔

- I chose Expo with React Native because it's an unbelievable tool for creating mobile apps speedily and I have experience with it.
- I chose to create a wishlist because it was something that was mentioned in the first interview and I wanted to see if I could integrate it.
- The checkout button is there purely for fun!

## Things I didn't get around to 🔴

- I had an idea to create a few different styles of the app and had actually started creating a "comic" theme, but decided to focus on other things.
- I also wanted to add more micro animations and transitions on things like the quantity counter, filters, and sorting.
- There are plenty of things, but I'm satisfied with what I have.