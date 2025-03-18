import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Use different haptic patterns for iOS and Android
        if (Platform.OS === 'ios') {
          // Light impact for iOS - feels more native
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (Platform.OS === 'android') {
          // Selection feedback for Android - more consistent with Material Design
          Haptics.selectionAsync();
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
