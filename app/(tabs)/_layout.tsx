import { Tabs } from 'expo-router';
import { useColorScheme, View, Text, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '@/styles/theme';
import { HapticTab } from '@/components/HapticTab';
import { useAppSelector } from '@/app/store/hooks';
import { isAlertFulfilled } from '@/components/wishlist/WishlistItem';

function LogoHeader() {
  return (
    <Image
      source={require('@/assets/images/budgie.png')}
      style={{
        width: 100,
        height: 36,
        resizeMode: 'contain',
      }}
    />
  );
}

function CartTabIcon({ color }: { color: string }) {
  const { totalItems } = useAppSelector((state) => state.cart);
  
  return (
    <View>
      <FontAwesome name="shopping-cart" size={24} color={color} />
      {totalItems > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            backgroundColor: colors.primary,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 12 }}>{totalItems}</Text>
        </View>
      )}
    </View>
  );
}

function WishlistTabIcon({ color }: { color: string }) {
  const items = useAppSelector((state) => state.wishlist.items);
  const fulfilledCount = items.filter(isAlertFulfilled).length;
  
  return (
    <View>
      <FontAwesome name="star" size={24} color={color} />
      {fulfilledCount > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            backgroundColor: colors.primary,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 12 }}>{fulfilledCount}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#666' : '#999',
        headerShown: true,
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#333' : '#eee',
          backgroundColor: colorScheme === 'dark' ? '#181818' : '#fff',
          height: 60,
          paddingTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
          headerTitle: () => <LogoHeader />,
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color }) => <WishlistTabIcon color={color} />,
          headerTitle: 'Your Wishlist',
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <CartTabIcon color={color} />,
          headerTitle: 'Your Cart',
        }}
      />
    </Tabs>
  );
}
