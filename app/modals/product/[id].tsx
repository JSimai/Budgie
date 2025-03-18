/**
 * Product details modal component
 * Displays detailed product information, price, discounts, and purchase options
 */

import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { colors, spacing, typography } from '@/styles/theme';
import { AddToCartButton } from '@/components/shared/AddToCartButton';
import { addToWishlist, removeFromWishlist } from '@/app/store/slices/wishlistSlice';

export default function ProductModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Get product details from Redux store
  const product = useAppSelector((state) =>
    state.products.items.find((p) => p.id === Number(id))
  );

  // Check if product is in wishlist
  const isInWishlist = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === Number(id))
  );

  /**
   * Toggle product in wishlist
   * Adds or removes the product based on current state
   */
  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product.id));
      } else {
        dispatch(addToWishlist({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          discount: product.discount!,
        }));
      }
    }
  };

  /**
   * Get badge color based on discount percentage
   * Higher discounts get more prominent colors
   */
  const getBadgeColor = (percentage: number) => {
    if (percentage >= 50) return colors.primary5;
    if (percentage >= 40) return colors.primary4;
    if (percentage >= 30) return colors.primary3;
    if (percentage >= 20) return colors.primary2;
    return colors.primary;
  };

  // Show error state if product not found
  if (!product) {
    return (
      <View style={styles.centered}>
        <Text
          style={[
            styles.errorText,
            { color: colors.text[isDark ? 'dark' : 'light'] },
          ]}>
          Product not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      <View style={[
        styles.container,
        { backgroundColor: colors.background[isDark ? 'dark' : 'light'] },
      ]}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}>
          {/* Header with back and wishlist buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text[isDark ? 'dark' : 'light']}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleWishlistToggle}
              style={styles.wishlistButton}>
              <FontAwesome
                name={isInWishlist ? "heart" : "heart-o"}
                size={24}
                color={isInWishlist ? colors.primary : colors.text[isDark ? 'dark' : 'light']}
              />
            </TouchableOpacity>
          </View>
          {/* Product image with discount badges */}
          <View style={styles.imageSection}>
            <View style={[
              styles.savingsBadge,
              { backgroundColor: getBadgeColor(product.discount!.percentage) },
            ]}>
              <View style={styles.savingsTextContainer}>
                <Text style={styles.savingsAmount}>{product.discount!.percentage}% OFF</Text>
              </View>
            </View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: product.image }} style={styles.image} />
            </View>
            <View style={[
              styles.dollarSavingsBadge,
              { backgroundColor: getBadgeColor(product.discount!.percentage) },
            ]}>
              <Text style={styles.dollarSavingsAmount}>-${product.discount!.savings.toFixed(2)}</Text>
            </View>
          </View>
          {/* Product details section */}
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                { color: colors.text[isDark ? 'dark' : 'light'] },
              ]}>
              {product.title}
            </Text>
            <Text
              style={[
                styles.description,
                { color: colors.text[isDark ? 'dark' : 'light'] },
              ]}>
              {product.description}
            </Text>
            {/* Price display */}
            <View>
              <Text
                style={[
                  styles.originalPrice,
                  { color: colors.secondaryText[isDark ? 'dark' : 'light'] },
                ]}>
                ${product.price.toFixed(2)}
              </Text>
              <Text style={[
                styles.discountedPrice,
                { color: colors.text[isDark ? 'dark' : 'light'] },
              ]}>
                ${product.discount!.discountedPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Add to cart button container */}
        <View style={[
          styles.buttonContainer,
          { 
            backgroundColor: colors.background[isDark ? 'dark' : 'light'],
            borderTopColor: colors.border[isDark ? 'dark' : 'light'],
          }
        ]}>
          <AddToCartButton
            productId={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            discount={product.discount!}
          />
        </View>
      </View>
    </>
  );
}

// Styles for product modal components
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 120,  // Space for fixed button container
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Fixed button container at bottom
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  errorText: {
    ...typography.body,
    textAlign: 'center',
    marginHorizontal: spacing.lg,
  },
  // Image section styles
  imageSection: {
    flexDirection: 'row',
    position: 'relative',
  },
  savingsBadge: {
    backgroundColor: colors.primary,
    width: 60,
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
    width: 240,
    justifyContent: 'center',
    transform: [{ rotate: '-90deg' }],
  },
  savingsAmount: {
    ...typography.title1,
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 240,
    resizeMode: 'contain',
  },
  dollarSavingsBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
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
    ...typography.body,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.title2,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  originalPrice: {
    ...typography.title3,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  discountedPrice: {
    ...typography.title1,
  },
  savings: {
    ...typography.body,
    color: colors.success,
    marginBottom: spacing.xl,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: spacing.md,
    marginTop: Platform.OS === 'ios' ? 60 : 50,
    marginBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.md,
  },
  wishlistButton: {
    padding: spacing.md,
  },
}); 