/**
 * ProductGrid Component
 * Displays a responsive grid of product cards with filtering, sorting, and search capabilities
 * Features pull-to-refresh, loading states, and error handling
 */

import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  useColorScheme,
  ListRenderItem,
} from 'react-native';
import { ProductCard } from './ProductCard';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { fetchProducts } from '@/app/store/slices/productsSlice';
import { colors, spacing, typography } from '@/styles/theme';

/**
 * Product interface defining the shape of product data
 * @property id - Unique identifier for the product
 * @property title - Product name
 * @property price - Original price before discount
 * @property description - Product description
 * @property category - Product category for filtering
 * @property image - URL of product image
 * @property discount - Discount information including calculated values
 */
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  discount: {
    percentage: number;
    discountedPrice: number;
    savings: number;
  };
}

/**
 * Props for ProductGrid component
 * @property onProductPress - Callback when a product is selected
 * @property bottomOffset - Space to add at bottom of grid (for bottom controls)
 */
interface ProductGridProps {
  onProductPress: (id: number) => void;
  bottomOffset: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onProductPress, bottomOffset }) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get products state from Redux store
  const { items, status, error, filters } = useAppSelector((state) => state.products);

  /**
   * Handle pull-to-refresh action
   * Dispatches action to fetch fresh products data
   */
  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  /**
   * Memoized computation of filtered and sorted products
   * Applies search, category filters, and sorting in sequence
   */
  const filteredAndSortedItems = React.useMemo(() => {
    let result = [...items] as Product[];

    // Apply search filter across title, description, and category
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by selected categories if any
    if (filters.category.length > 0) {
      result = result.filter((item) => filters.category.includes(item.category));
    }

    // Apply selected sort order
    switch (filters.sortBy) {
      case 'biggestDiscount':
        result.sort((a, b) => b.discount.percentage - a.discount.percentage);
        break;
      case 'biggestSaving':
        result.sort((a, b) => b.discount.savings - a.discount.savings);
        break;
      case 'lowestPrice':
        result.sort((a, b) => a.discount.discountedPrice - b.discount.discountedPrice);
        break;
      case 'highestPrice':
        result.sort((a, b) => b.discount.discountedPrice - a.discount.discountedPrice);
        break;
    }

    return result;
  }, [items, filters]);

  // Show loading spinner when initially loading products
  if (status === 'loading' && items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Show error state if products fetch failed
  if (status === 'failed') {
    return (
      <View style={styles.centered}>
        <Text
          style={[
            styles.errorText,
            { color: colors.text[isDark ? 'dark' : 'light'] },
          ]}>
          {error}
        </Text>
      </View>
    );
  }

  /**
   * Render individual product card
   * Wraps ProductCard with necessary container and press handler
   */
  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <View style={styles.productContainer}>
      <ProductCard {...item} onPress={() => onProductPress(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAndSortedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: bottomOffset + spacing.md },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text
              style={[
                styles.emptyText,
                { color: colors.text[isDark ? 'dark' : 'light'] },
              ]}>
              {filters.searchQuery
                ? 'No products match your search'
                : 'No products found'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

/**
 * Styles for ProductGrid component
 * Features responsive grid layout and centered states
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  grid: {
    padding: spacing.sm,
  },
  productContainer: {
    flex: 1,
  },
  errorText: {
    ...typography.body,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
  },
}); 