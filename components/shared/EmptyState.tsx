import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { colors, typography } from '@/styles/theme';
import { default as Anim, FadeInDown } from 'react-native-reanimated';

interface EmptyStateProps {
  message: string;
}

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