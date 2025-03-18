/**
 * Main shop screen component
 * Displays the product grid with filter/sort controls
 * Features smooth fade-in animations and responsive layout
 */

import { View, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ProductGrid } from '@/components/product/ProductGrid';
import { BottomControls } from '@/components/shared/BottomControls';
import { colors } from '@/styles/theme';
import React from 'react';
import { default as Anim, FadeInDown } from 'react-native-reanimated';

// Custom hook to track first render
const useIsFirstRender = () => {
  const isFirst = React.useRef(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }

  return false;
};

export default function TabOneScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isFirstRender = useIsFirstRender();
  // Track bottom controls height to adjust product grid padding
  const [controlsHeight, setControlsHeight] = React.useState(0);

  /**
   * Navigate to product details modal when a product is pressed
   */
  const handleProductPress = (productId: number) => {
    router.push({
      pathname: '/modals/product/[id]',
      params: { id: productId },
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background[isDark ? 'dark' : 'light'] },
      ]}>
      {/* Animated product grid with dynamic bottom padding based on controls height */}
      <Anim.View 
        entering={isFirstRender ? FadeInDown.springify() : undefined}
        style={styles.gridContainer}>
        <ProductGrid onProductPress={handleProductPress} bottomOffset={controlsHeight} />
      </Anim.View>
      {/* Filter and sort controls that slide up from bottom */}
      <Anim.View
        entering={isFirstRender ? FadeInDown.delay(300).springify() : undefined}>
        <BottomControls onHeightChange={setControlsHeight} />
      </Anim.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flex: 1,
  },
});
