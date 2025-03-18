import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Platform, Image } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { useAppDispatch } from '@/app/store/hooks';
import { FontAwesome } from '@expo/vector-icons';
import { removeFromWishlist, setWishlistAlert } from '@/app/store/slices/wishlistSlice';
import { NotificationModal } from '@/components/wishlist/NotificationModal';

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

interface WishlistItemProps extends WishlistItemData {
  onPress: () => void;
}

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

  const isFulfilled = useMemo(() => {
    return isAlertFulfilled({ id, title, price, image, discount, alert });
  }, [id, price, discount, alert]);

  const handleRemove = () => {
    dispatch(removeFromWishlist(id));
  };

  const handleSetAlert = (newAlert: { type: 'percentage' | 'price'; value: number }) => {
    dispatch(setWishlistAlert({ productId: id, alert: newAlert }));
  };

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
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount.percentage}% OFF</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
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
              <Text
                style={[
                  styles.discountedPrice,
                  { color: colors.text[isDark ? 'dark' : 'light'] },
                ]}>
                ${discount.discountedPrice.toFixed(2)}
              </Text>
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleToggleAlert}
                style={styles.notificationButton}>
                <FontAwesome 
                  name={alert ? "bell" : "bell-o"} 
                  size={18} 
                  color={isFulfilled ? colors.success : (alert ? colors.primary : colors.secondaryText[isDark ? 'dark' : 'light'])} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRemove}
                style={styles.removeButton}>
                <FontAwesome name="trash" size={18} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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

const styles = StyleSheet.create({
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
  contentContainer: {
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
  },
  discountedPrice: {
    ...typography.title3,
  },
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