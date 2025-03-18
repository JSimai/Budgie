/**
 * ProductCard Component
 * A card component that displays product information with:
 * - Discount badges (percentage and dollar savings)
 * - Product image
 * - Title and pricing information
 * - Cart quantity indicator
 * Features responsive design and platform-specific styling
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useColorScheme,
  Pressable,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '@/app/store/hooks';
import { colors, spacing, typography } from '@/styles/theme';

/**
 * Props for ProductCard component
 * @property id - Unique identifier for the product
 * @property title - Product name
 * @property price - Original price before discount
 * @property image - URL of product image
 * @property discount - Discount information including calculated values
 * @property onPress - Callback when card is pressed
 */
interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  discount: {
    percentage: number;
    discountedPrice: number;
    savings: number;
  };
  onPress: () => void;
}

/**
 * Determines badge color based on discount percentage
 * Higher discounts get more prominent colors
 * @param percentage - Discount percentage
 * @returns Color from theme palette
 */
const getBadgeColor = (percentage: number) => {
  if (percentage >= 50) return colors.primary5;
  if (percentage >= 40) return colors.primary4;
  if (percentage >= 30) return colors.primary3;
  if (percentage >= 20) return colors.primary2;
  return colors.primary;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  discount,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Get cart state for this product to show quantity badge
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.id === id)
  );
  const quantity = cartItem?.quantity || 0;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.background[isDark ? 'dark' : 'light'],
          borderColor: colors.border[isDark ? 'dark' : 'light'],
        },
      ]}>
      {/* Image section with discount badges */}
      <View style={styles.imageSection}>
        {/* Percentage discount badge */}
        <View style={[
          styles.savingsBadge,
          { backgroundColor: getBadgeColor(discount.percentage) },
        ]}>
          <View style={styles.savingsTextContainer}>
            <Text style={styles.savingsAmount}>{discount.percentage}% OFF</Text>
          </View>
        </View>
        {/* Product image container */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        {/* Dollar savings badge */}
        <View style={[
          styles.dollarSavingsBadge,
          { backgroundColor: getBadgeColor(discount.percentage) },
        ]}>
          <Text style={styles.dollarSavingsAmount}>-${discount.savings.toFixed(2)}</Text>
        </View>
      </View>
      {/* Product details section */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text[isDark ? 'dark' : 'light'] },
          ]}
          numberOfLines={2}>
          {title}
        </Text>
        <View>
          {/* Original price (struck through) */}
          <Text
            style={[
              styles.originalPrice,
              { color: colors.secondaryText[isDark ? 'dark' : 'light'] },
            ]}>
            ${price.toFixed(2)}
          </Text>
          {/* Discounted price */}
          <Text
            style={[
              styles.discountedPrice,
              { color: colors.text[isDark ? 'dark' : 'light'] },
            ]}>
            ${discount.discountedPrice.toFixed(2)}
          </Text>
        </View>
      </View>
      {/* Cart quantity badge - only shown when product is in cart */}
      {quantity > 0 && (
        <View style={styles.quantityBadge}>
          <FontAwesome name="shopping-cart" size={12} color="#fff" style={styles.cartIcon} />
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
      )}
    </Pressable>
  );
};

/**
 * Styles for ProductCard component
 * Features platform-specific shadows and consistent spacing
 */
const styles = StyleSheet.create({
  // Cart icon in quantity badge
  cartIcon: {
    marginRight: spacing.xs,
  },
  // Main container with platform-specific shadow
  container: {
    flex: 1,
    margin: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  // Content section containing title and prices
  content: {
    padding: spacing.sm,
  },
  // Discounted price text style
  discountedPrice: {
    ...typography.title2,
    color: colors.primary,
  },
  // Dollar savings badge text
  dollarSavingsAmount: {
    ...typography.caption1,
    color: '#fff',
    fontWeight: 'bold',
  },
  // Dollar savings badge container
  dollarSavingsBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    borderRadius: 8,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  // Product image styles
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
    flexDirection: 'row',
    position: 'relative',
  },
  // Original price text (struck through)
  originalPrice: {
    ...typography.caption1,
    textDecorationLine: 'line-through',
  },
  // Cart quantity badge styles
  quantityBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.success,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  quantityText: {
    ...typography.caption1,
    color: '#fff',
    fontWeight: 'bold',
  },
  // Savings text styles
  savings: {
    ...typography.caption1,
    color: colors.primary,
    fontWeight: 'bold',
  },
  savingsAmount: {
    ...typography.title1,
    color: '#fff',
    fontWeight: 'bold',
  },
  // Percentage savings badge styles
  savingsBadge: {
    backgroundColor: colors.primary,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
    zIndex: 1,
  },
  savingsTextContainer: {
    transform: [{ rotate: '-90deg' }],
    width: 160,
    alignItems: 'center',
  },
  // Product title text
  title: {
    ...typography.body,
    marginBottom: spacing.xs,
    minHeight: typography.body.fontSize * 2.4,
    lineHeight: typography.body.fontSize * 1.2,
  },
}); 