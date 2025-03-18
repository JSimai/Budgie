/**
 * HapticTab Component
 * Custom tab button that provides haptic feedback when pressed
 * Uses platform-specific haptic patterns for a native feel
 */

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Enhanced tab button with haptic feedback
 * Wraps the default tab button with platform-specific haptic patterns
 * @param props - Standard bottom tab bar button props from React Navigation
 */
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
        // Forward the press event to the original handler
        props.onPressIn?.(ev);
      }}
    />
  );
}
