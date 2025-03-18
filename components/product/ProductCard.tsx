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

  // Get cart state for this product
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
      <View style={styles.imageSection}>
        <View style={[
          styles.savingsBadge,
          { backgroundColor: getBadgeColor(discount.percentage) },
        ]}>
          <View style={styles.savingsTextContainer}>
            <Text style={styles.savingsAmount}>{discount.percentage}% OFF</Text>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <View style={[
          styles.dollarSavingsBadge,
          { backgroundColor: getBadgeColor(discount.percentage) },
        ]}>
          <Text style={styles.dollarSavingsAmount}>-${discount.savings.toFixed(2)}</Text>
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
        {/* <View style={styles.priceContainer}> */}
          <View>
            <Text
              style={[
                styles.originalPrice,
                { color: colors.secondaryText[isDark ? 'dark' : 'light'] },
              ]}>
              ${price.toFixed(2)}
            </Text>
            <Text
              style={[
                styles.discountedPrice,
                { color: colors.text[isDark ? 'dark' : 'light'] },
              ]}>
              ${discount.discountedPrice.toFixed(2)}
            </Text>
            {/* <Text style={styles.savings}>Save ${discount.savings.toFixed(2)}</Text> */}
          </View>
        {/* </View> */}
      </View>
      {quantity > 0 && (
        <View style={styles.quantityBadge}>
          <FontAwesome name="shopping-cart" size={12} color="#fff" style={styles.cartIcon} />
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cartIcon: {
    marginRight: spacing.xs,
  },
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
  content: {
    padding: spacing.sm,
  },
  discountedPrice: {
    ...typography.title2,
    color: colors.primary,
  },
  dollarSavingsAmount: {
    ...typography.caption1,
    color: '#fff',
    fontWeight: 'bold',
  },
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
  originalPrice: {
    ...typography.caption1,
    textDecorationLine: 'line-through',
  },
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
    width: 160,
    justifyContent: 'center',
    transform: [{ rotate: '-90deg' }],
  },
  title: {
    ...typography.body,
    marginBottom: spacing.xs,
    minHeight: typography.body.fontSize * 2.4,
    lineHeight: typography.body.fontSize * 1.2,
  },
}); 