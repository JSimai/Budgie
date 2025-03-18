import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity, Platform, Image, Modal, TextInput } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { default as Anim, FadeInDown } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { removeFromWishlist, setWishlistAlert, clearWishlistAlert } from '@/app/store/slices/wishlistSlice';
import { WishlistItem, isAlertFulfilled, WishlistItemData } from '@/components/wishlist/WishlistItem';
import { EmptyState } from '@/components/shared/EmptyState';

const AnimatedFlatList = Anim.createAnimatedComponent(FlatList<WishlistItemData>);

export default function TabTwoScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const items = useAppSelector((state) => state.wishlist.items);
  
  // Sort items: fulfilled alerts first, then rest of items
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aFulfilled = isAlertFulfilled(a);
      const bFulfilled = isAlertFulfilled(b);
      if (aFulfilled && !bFulfilled) return -1;
      if (!aFulfilled && bFulfilled) return 1;
      return 0;
    });
  }, [items]);

  const handleItemPress = (productId: number) => {
    router.push({
      pathname: '/modals/product/[id]',
      params: { id: productId },
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background[isDark ? 'dark' : 'light'] },
      ]}>
      {items.length === 0 ? (
        <EmptyState message="Your wishlist is empty" />
      ) : (
        <AnimatedFlatList
          data={sortedItems}
          renderItem={({ item, index }) => (
            <Anim.View
              entering={FadeInDown.delay(index * 100).springify()}>
              <WishlistItem
                {...item}
                onPress={() => handleItemPress(item.id)}
              />
            </Anim.View>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: spacing.lg,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.title2,
    textAlign: 'left',
  },
  productTitle: {
    ...typography.body,
    marginBottom: spacing.lg,
    textAlign: 'left',
  },
  alertTypeContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  alertTypeButton: {
    flex: 1,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: spacing.xs,
    borderRadius: 8,
  },
  alertTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  alertTypeText: {
    ...typography.body,
    color: colors.primary,
  },
  alertTypeTextActive: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
  },
  input: {
    ...typography.body,
    flex: 1,
    padding: spacing.sm,
  },
  inputPrefix: {
    ...typography.body,
    marginRight: spacing.xs,
  },
  inputSuffix: {
    ...typography.body,
    marginLeft: spacing.xs,
  },
  setAlertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  setAlertButtonText: {
    ...typography.body,
    color: '#fff',
    marginLeft: spacing.sm,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: spacing.xs,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
