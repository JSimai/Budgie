/**
 * EmptyState Component
 * Displays a centered message when a list or container has no content
 * Features a fade-in animation for smooth appearance
 */

import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { colors, typography } from '@/styles/theme';
import { default as Anim, FadeInDown } from 'react-native-reanimated';

/**
 * Props for EmptyState component
 * @property message - Text to display in the empty state
 */
interface EmptyStateProps {
  message: string;
}

/**
 * Animated empty state component
 * Used in lists and containers to show a message when no content is available
 * Supports dark/light mode and uses consistent typography
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Anim.View
      entering={FadeInDown}
      style={styles.container}>
      <Text
        style={[
          styles.text,
          { color: colors.text[isDark ? 'dark' : 'light'] },
        ]}>
        {message}
      </Text>
    </Anim.View>
  );
};

// Styles for empty state component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...typography.body,
    textAlign: 'center',
  },
}); 