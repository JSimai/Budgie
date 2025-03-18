import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity, Platform } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { CartItem } from '@/components/cart/CartItem';
import { default as Anim, FadeInDown, useAnimatedStyle, useSharedValue, withTiming, withSequence, withDelay } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { clearCart } from '@/app/store/slices/cartSlice';

interface CartItemType {
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

const AnimatedFlatList = Anim.createAnimatedComponent(FlatList<CartItemType>);

export default function TabThreeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showCelebration, setShowCelebration] = useState(false);
  const fadeAnim = useSharedValue(0);
  const isFocused = useIsFocused();
  const [key, setKey] = useState(0); // Key to force animation reset
  const dispatch = useAppDispatch();
  const router = useRouter();

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const { items, totalItems, totalPrice, totalDiscount } = useAppSelector(
    (state) => state.cart
  );

  // Reset animations when tab is focused
  useEffect(() => {
    if (isFocused) {
      setKey(prev => prev + 1);
    }
  }, [isFocused]);

  const finalTotal = totalPrice - totalDiscount;

  const handleCheckout = () => {
    setShowCelebration(true);
    fadeAnim.value = withSequence(
      withTiming(1, { duration: 500 }),
      withDelay(2000, withTiming(0, { duration: 500 }))
    );
    
    // After the celebration animation, clear cart and navigate
    setTimeout(() => {
      setShowCelebration(false);
      dispatch(clearCart());
      router.replace('/(tabs)');
    }, 3000);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background[isDark ? 'dark' : 'light'] },
      ]}>
      {totalItems === 0 ? (
        <Anim.View 
          key={`empty-${key}`}
          entering={FadeInDown}
          style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              { color: colors.text[isDark ? 'dark' : 'light'] },
            ]}>
            Your cart is empty
          </Text>
        </Anim.View>
      ) : (
        <>
          <AnimatedFlatList
            key={`list-${key}`}
            data={items as CartItemType[]}
            renderItem={({ item, index }) => (
              <Anim.View
                entering={FadeInDown.delay(index * 100).springify()}>
                <CartItem {...item} />
              </Anim.View>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
          <Anim.View
            key={`summary-${key}`}
            entering={FadeInDown.delay(items.length * 100)}>
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.text[isDark ? 'dark' : 'light'] },
                  ]}>
                  Subtotal:
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.text[isDark ? 'dark' : 'light'] },
                  ]}>
                  ${totalPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.primary },
                  ]}>
                  Total Savings:
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.primary },
                  ]}>
                  -${totalDiscount.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text
                  style={[
                    styles.totalLabel,
                    { color: colors.text[isDark ? 'dark' : 'light'] },
                  ]}>
                  Total:
                </Text>
                <Text
                  style={[
                    styles.totalValue,
                    { color: colors.text[isDark ? 'dark' : 'light'] },
                  ]}>
                  ${finalTotal.toFixed(2)}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <FontAwesome name="credit-card" size={22} color={colors.primary} />
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </Anim.View>
        </>
      )}
      {showCelebration && (
        <Anim.View 
          style={[
            styles.celebrationPopup,
            animatedStyles,
          ]}
        >
          <Text style={[
            styles.celebrationText,
            { color: colors.text[isDark ? 'dark' : 'light'] }
          ]}>
            Order Complete! 🎉
          </Text>
        </Anim.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
  },
  list: {
    padding: spacing.md,
  },
  summary: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
  },
  summaryValue: {
    ...typography.body,
  },
  totalRow: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  totalLabel: {
    ...typography.title3,
  },
  totalValue: {
    ...typography.title2,
  },
  checkoutButton: {
    borderColor: colors.primary,
    borderWidth: 2,
    padding: spacing.md,
    borderRadius: 8,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    ...typography.title3,
    color: colors.primary,
    textAlign: 'center',
    marginLeft: spacing.sm,
  },
  celebrationPopup: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  celebrationText: {
    ...typography.title1,
    textAlign: 'center',
  },
});
