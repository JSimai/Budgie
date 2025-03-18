/**
 * Root layout component that sets up the app's core providers and initialization
 * Handles theme setup, font loading, and initial data fetching
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchProducts } from './store/slices/productsSlice';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

/**
 * Inner layout component that handles theme, fonts, and data initialization
 * Separated from RootLayout to allow proper Redux hook usage
 */
function RootLayoutContent() {
  const colorScheme = useColorScheme();
  // Load custom fonts
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const dispatch = useAppDispatch();
  const productsStatus = useAppSelector((state) => state.products.status);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Initialize product data on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Wait for fonts to load before rendering
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={styles.container}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

/**
 * Root layout wrapper that provides Redux store to the app
 * Wraps the content component with necessary providers
 */
export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
