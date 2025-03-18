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
  const [controlsHeight, setControlsHeight] = React.useState(0);

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
      <ProductGrid onProductPress={handleProductPress} bottomOffset={controlsHeight} />
      <BottomControls onHeightChange={setControlsHeight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
