/**
 * Main shop screen component
 * Displays the product grid with filter/sort controls
 */

import { View, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ProductGrid } from '@/components/product/ProductGrid';
import { BottomControls } from '@/components/shared/BottomControls';
import { colors } from '@/styles/theme';
import React from 'react';

export default function TabOneScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
      {/* Product grid with dynamic bottom padding based on controls height */}
      <ProductGrid onProductPress={handleProductPress} bottomOffset={controlsHeight} />
      {/* Filter and sort controls that slide up from bottom */}
      <BottomControls onHeightChange={setControlsHeight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
