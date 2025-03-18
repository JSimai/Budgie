/**
 * AddToCartButton Component
 * Provides add to cart functionality with quantity controls
 * Features smooth animations for state transitions
 */

import React, { useEffect } from 'react';
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
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';

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

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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
  const isAdded = quantity > 0;

  // Animated styles for the main button
  const buttonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring(
        isAdded ? colors.success : colors.background[isDark ? 'dark' : 'light']
      ),
      borderColor: withSpring(
        isAdded ? colors.success : colors.primary
      ),
      transform: [
        {
          scale: withSpring(isAdded ? 1 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  }, [isAdded, isDark]);

  // Animated styles for the button text
  const textStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(
        isAdded ? '#fff' : colors.primary,
        { duration: 200 }
      ),
    };
  }, [isAdded]);

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
      <AnimatedTouchable
        style={[styles.button, buttonStyle]}
        onPress={handleAddToCart}>
        <View style={styles.buttonContent}>
          <Animated.View>
            <FontAwesome 
              name={isAdded ? "shopping-cart" : "cart-plus"} 
              size={22} 
              color={isAdded ? "#fff" : colors.primary} 
              style={styles.icon} 
            />
          </Animated.View>
          <Animated.Text style={[styles.buttonText, textStyle]}>
            {isAdded ? 'View in Cart' : 'Add to Cart'}
          </Animated.Text>
        </View>
      </AnimatedTouchable>

      {/* Quantity controls with enter/exit animations */}
      {isAdded && (
        <Animated.View 
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={handleDecrement}
            style={[styles.quantityButton, styles.decrementButton]}>
            <FontAwesome
              name={quantity === 1 ? 'trash' : 'minus'}
              size={16}
              color={colors.danger}
            />
          </TouchableOpacity>
          <Animated.Text
            style={[
              styles.quantity,
              { color: colors.text[isDark ? 'dark' : 'light'] },
            ]}>
            {quantity}
          </Animated.Text>
          <TouchableOpacity
            onPress={handleIncrement}
            style={[styles.quantityButton, styles.incrementButton]}>
            <FontAwesome name="plus" size={16} color={colors.success} />
          </TouchableOpacity>
        </Animated.View>
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
    backgroundColor: colors.danger + '20',  // 20% opacity
  },
  incrementButton: {
    backgroundColor: colors.success + '20',  // 20% opacity
  },
  quantity: {
    ...typography.body,
    marginHorizontal: spacing.sm+4,
  },
}); 