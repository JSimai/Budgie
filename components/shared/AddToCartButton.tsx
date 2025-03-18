/**
 * AddToCartButton Component
 * Provides add to cart functionality with quantity controls
 * Changes appearance and behavior based on cart state
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addToCart, updateQuantity } from '@/app/store/slices/cartSlice';
import { colors, spacing, typography } from '@/styles/theme';
import { useRouter } from 'expo-router';

/**
 * Props for AddToCartButton component
 * @property productId - Unique identifier for the product
 * @property title - Product name
 * @property price - Original product price
 * @property image - Product image URL
 * @property discount - Discount information including percentage and calculated values
 */
interface AddToCartButtonProps {
  productId: number;
  title: string;
  price: number;
  image: string;
  discount: {
    percentage: number;
    discountedPrice: number;
    savings: number;
  };
}

/**
 * Button component for adding products to cart
 * Transforms into quantity controls once product is in cart
 */
export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  title,
  price,
  image,
  discount,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Get cart state for this product
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.id === productId)
  );
  const quantity = cartItem?.quantity || 0;
  const [isAdded, setIsAdded] = useState(quantity > 0);

  // Update local state when cart quantity changes
  useEffect(() => {
    setIsAdded(quantity > 0);
  }, [quantity]);

  /**
   * Handle add to cart button press
   * Either adds item to cart or navigates to cart if already added
   */
  const handleAddToCart = () => {
    if (isAdded) {
      // Navigate to cart tab if item is already in cart
      router.push('/(tabs)/three');
    } else {
      dispatch(
        addToCart({
          id: productId,
          title,
          price,
          image,
          discount,
        })
      );
    }
  };

  /**
   * Increment quantity of item in cart
   */
  const handleIncrement = () => {
    dispatch(
      updateQuantity({
        id: productId,
        quantity: (quantity || 0) + 1,
      })
    );
  };

  /**
   * Decrement quantity of item in cart
   * Removes item if quantity becomes 0
   */
  const handleDecrement = () => {
    if (quantity > 0) {
      dispatch(
        updateQuantity({
          id: productId,
          quantity: quantity - 1,
        })
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Main add to cart button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderColor: isAdded ? colors.success : colors.primary,
            backgroundColor: isAdded ? colors.success : colors.background[isDark ? 'dark' : 'light'],
          },
        ]}
        onPress={handleAddToCart}>
        <View style={styles.buttonContent}>
          {isAdded ? (
            <FontAwesome name="shopping-cart" size={22} color={"#fff"} style={styles.icon} />
          ) : (
            <FontAwesome name="cart-plus" size={22} color={colors.primary} style={styles.icon} />
          )}
          <Text style={[
            styles.buttonText,
            { color: isAdded ? "#fff" : colors.primary },
          ]}>
            {isAdded ? 'View in Cart' : 'Add to Cart'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Quantity controls - only shown when item is in cart */}
      {isAdded && (
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={handleDecrement}
            style={[styles.quantityButton, styles.decrementButton]}>
            <FontAwesome
              name={quantity === 1 ? 'trash' : 'minus'}
              size={16}
              color={colors.danger}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.quantity,
              { color: colors.text[isDark ? 'dark' : 'light'] },
            ]}>
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={handleIncrement}
            style={[styles.quantityButton, styles.incrementButton]}>
            <FontAwesome name="plus" size={16} color={colors.success} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Styles for add to cart button and quantity controls
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Main button styles
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 2,
    // Platform-specific shadow styles
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.xs,
  },
  buttonText: {
    ...typography.title3,
    color: '#fff',
    textAlign: 'center',
    marginLeft: spacing.sm,
  },
  // Quantity control styles
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: spacing.xs,
    marginLeft: spacing.md,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementButton: {
    backgroundColor: colors.discount + '20',  // 20% opacity
  },
  incrementButton: {
    backgroundColor: colors.success + '20',  // 20% opacity
  },
  quantity: {
    ...typography.body,
    marginHorizontal: spacing.sm+4,
  },
}); 