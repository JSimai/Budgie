/**
 * CartItem Component
 * Displays a single item in the shopping cart with:
 * - Product image and details
 * - Price information (original and discounted)
 * - Quantity controls
 * - Total savings badge
 * Features responsive layout and smooth interactions
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useColorScheme,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/styles/theme';
import { useAppDispatch } from '@/app/store/hooks';
import { removeFromCart, updateQuantity } from '@/app/store/slices/cartSlice';

/**
 * Props for CartItem component
 * @property id - Unique identifier for the product
 * @property title - Product name
 * @property price - Original price before discount
 * @property image - URL of product image
 * @property quantity - Current quantity in cart
 * @property discount - Discount information including calculated values
 */
interface CartItemProps {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  discount: {
    percentage: number;
    discountedPrice: number;
    savings: number;
  };
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  title,
  price,
  image,
  quantity,
  discount,
}) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  /**
   * Increment quantity of item in cart
   */
  const handleIncrement = () => {
    dispatch(updateQuantity({ id, quantity: quantity + 1 }));
  };

  /**
   * Decrement quantity of item in cart
   * Removes item if quantity would become 0
   */
  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ id, quantity: quantity - 1 }));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background[isDark ? 'dark' : 'light'],
          borderColor: colors.border[isDark ? 'dark' : 'light'],
        },
      ]}>
      {/* Product image section with savings badge */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        {/* Total savings badge */}
        <View style={styles.dollarSavingsBadge}>
          <Text style={styles.dollarSavingsAmount}>Saved ${(discount.savings * quantity).toFixed(2)}</Text>
        </View>
      </View>
      {/* Product details section */}
      <View style={styles.content}>
        {/* Product title */}
        <Text
          style={[
            styles.title,
            { color: colors.text[isDark ? 'dark' : 'light'] },
          ]}
          numberOfLines={2}>
          {title}
        </Text>
        {/* Price and quantity controls */}
        <View style={styles.priceContainer}>
          {/* Price information */}
          <View>
            <Text
              style={[
                styles.originalPrice,
                { color: colors.secondaryText[isDark ? 'dark' : 'light'] },
              ]}>
              ${price.toFixed(2)}
            </Text>
            <Text style={[
              styles.discountedPrice,
              { color: colors.text[isDark ? 'dark' : 'light'] },
            ]}>
              ${discount.discountedPrice.toFixed(2)}
            </Text>
          </View>
          {/* Quantity controls */}
          <View style={styles.quantityContainer}>
            <Pressable
              onPress={handleDecrement}
              style={[styles.quantityButton, styles.decrementButton]}>
              <FontAwesome
                name={quantity === 1 ? 'trash' : 'minus'}
                size={16}
                color={colors.danger}
              />
            </Pressable>
            <Text
              style={[
                styles.quantity,
                { color: colors.text[isDark ? 'dark' : 'light'] },
              ]}>
              {quantity}
            </Text>
            <Pressable
              onPress={handleIncrement}
              style={[styles.quantityButton, styles.incrementButton]}>
              <FontAwesome name="plus" size={16} color={colors.success} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * Styles for CartItem component
 * Features responsive layout and platform-specific shadows
 */
const styles = StyleSheet.create({
  // Main container with platform-specific shadow
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.sm,
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
  // Image container styles
  imageContainer: {
    flex: 1,
    padding: spacing.sm,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  // Content section styles
  content: {
    flex: 2,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  title: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  // Price section styles
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  originalPrice: {
    ...typography.caption1,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  discountedPrice: {
    ...typography.title3,
  },
  // Quantity controls styles
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: spacing.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementButton: {
    backgroundColor: colors.danger + '20', // 20% opacity
  },
  incrementButton: {
    backgroundColor: colors.success + '20', // 20% opacity
  },
  quantity: {
    ...typography.body,
    marginHorizontal: spacing.sm+4,
  },
  savings: {
    ...typography.caption1,
    color: colors.success,
  },
  // Savings badge styles
  dollarSavingsBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    borderRadius: 8,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
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
  dollarSavingsAmount: {
    ...typography.caption1,
    color: '#fff',
    fontWeight: 'bold',
  },
}); 