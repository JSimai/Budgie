/**
 * WishlistItem Component
 * Displays a single item in the wishlist with:
 * - Product image and details
 * - Price information and discount badge
 * - Price alert configuration
 * - Remove from wishlist option
 * Features alert status indicators and notification modal
 */

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Platform, Image } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { useAppDispatch } from '@/app/store/hooks';
import { FontAwesome } from '@expo/vector-icons';
import { removeFromWishlist, setWishlistAlert } from '@/app/store/slices/wishlistSlice';
import { NotificationModal } from '@/components/wishlist/NotificationModal';

/**
 * Interface for wishlist item data
 * @property id - Unique identifier for the product
 * @property title - Product name
 * @property price - Original price before discount
 * @property image - URL of product image
 * @property discount - Discount information including calculated values
 * @property alert - Optional price alert configuration
 */
export interface WishlistItemData {
  id: number;
  title: string;
  price: number;
  image: string;
  discount: {
    percentage: number;
    discountedPrice: number;
    savings: number;
  };
  alert?: {
    type: 'percentage' | 'price';
    value: number;
  };
}

/**
 * Props for WishlistItem component
 * Extends WishlistItemData with onPress handler
 */
interface WishlistItemProps extends WishlistItemData {
  onPress: () => void;
}

/**
 * Checks if a price alert has been fulfilled
 * @param item - Wishlist item to check
 * @returns true if alert conditions are met
 */
export const isAlertFulfilled = (item: WishlistItemData): boolean => {
  if (!item.alert) return false;
  
  if (item.alert.type === 'price') {
    return item.discount.discountedPrice <= item.alert.value;
  } else {
    return item.discount.percentage >= item.alert.value;
  }
};

export const WishlistItem: React.FC<WishlistItemProps> = ({
  id,
  title,
  price,
  image,
  discount,
  alert,
  onPress,
}) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  /**
   * Memoized check if alert conditions are met
   * Prevents unnecessary recalculation on re-renders
   */
  const isFulfilled = useMemo(() => {
    return isAlertFulfilled({ id, title, price, image, discount, alert });
  }, [id, price, discount, alert]);

  /**
   * Remove item from wishlist
   */
  const handleRemove = () => {
    dispatch(removeFromWishlist(id));
  };

  /**
   * Update price alert settings for item
   */
  const handleSetAlert = (newAlert: { type: 'percentage' | 'price'; value: number }) => {
    dispatch(setWishlistAlert({ productId: id, alert: newAlert }));
  };

  /**
   * Show notification modal for alert configuration
   */
  const handleToggleAlert = () => {
    setShowNotificationModal(true);
  };

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.itemContainer,
          {
            backgroundColor: colors.background[isDark ? 'dark' : 'light'],
            borderColor: isFulfilled ? colors.success : colors.border[isDark ? 'dark' : 'light'],
            borderWidth: isFulfilled ? 2 : 1,
          },
        ]}>
        {/* Product image section with discount badge */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          {/* Discount percentage badge */}
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount.percentage}% OFF</Text>
          </View>
        </View>
        {/* Product details section */}
        <View style={styles.contentContainer}>
          {/* Product title */}
          <Text
            style={[
              styles.title,
              { color: colors.text[isDark ? 'dark' : 'light'] },
            ]}
            numberOfLines={2}>
            {title}
          </Text>
          {/* Price and controls section */}
          <View style={styles.priceContainer}>
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
              {/* Alert status indicator */}
              {alert && (
                <View style={styles.alertContainer}>
                  <FontAwesome 
                    name={isFulfilled ? "check" : "bell"} 
                    size={12} 
                    color={isFulfilled ? colors.success : colors.primary}
                    style={styles.alertCheck}
                  />
                  <Text
                    style={[
                      styles.alertText,
                      { color: colors.text[isDark ? 'dark' : 'light'] },
                    ]}>
                    Alert: {alert.type === 'percentage' ? `${alert.value}% off` : `$${alert.value.toFixed(2)}`}
                  </Text>
                </View>
              )}
            </View>
            {/* Control buttons */}
            <View style={styles.buttonContainer}>
              {/* Alert toggle button */}
              <TouchableOpacity
                onPress={handleToggleAlert}
                style={styles.notificationButton}>
                <FontAwesome 
                  name={alert ? "bell" : "bell-o"} 
                  size={18} 
                  color={isFulfilled ? colors.success : (alert ? colors.primary : colors.secondaryText[isDark ? 'dark' : 'light'])} 
                />
              </TouchableOpacity>
              {/* Remove from wishlist button */}
              <TouchableOpacity
                onPress={handleRemove}
                style={styles.removeButton}>
                <FontAwesome name="trash" size={18} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/* Alert configuration modal */}
      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        productTitle={title}
        currentPrice={price}
        onSetAlert={handleSetAlert}
        existingAlert={alert}
      />
    </>
  );
};

/**
 * Styles for WishlistItem component
 * Features responsive layout and platform-specific shadows
 */
const styles = StyleSheet.create({
  // Main container with platform-specific shadow
  itemContainer: {
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
  // Image section styles
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
  // Discount badge styles
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
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
  discountText: {
    ...typography.caption1,
    color: '#fff',
    fontWeight: 'bold',
  },
  // Content section styles
  contentContainer: {
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
  },
  discountedPrice: {
    ...typography.title3,
  },
  // Control buttons styles
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: spacing.sm,
    marginRight: spacing.xs,
  },
  removeButton: {
    padding: spacing.sm,
  },
  // Alert indicator styles
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  alertText: {
    ...typography.caption1,
  },
  alertCheck: {
    marginRight: spacing.xs,
  },
}); 