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

  const handleIncrement = () => {
    dispatch(updateQuantity({ id, quantity: quantity + 1 }));
  };

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
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.dollarSavingsBadge}>
          <Text style={styles.dollarSavingsAmount}>Saved ${(discount.savings * quantity).toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text[isDark ? 'dark' : 'light'] },
          ]}
          numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.priceContainer}>
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

const styles = StyleSheet.create({
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
  content: {
    flex: 2,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  title: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
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
    backgroundColor: colors.discount + '20',
  },
  incrementButton: {
    backgroundColor: colors.success + '20',
  },
  quantity: {
    ...typography.body,
    marginHorizontal: spacing.sm+4,
  },
  savings: {
    ...typography.caption1,
    color: colors.success,
  },
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