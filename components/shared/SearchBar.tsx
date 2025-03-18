/**
 * SearchBar Component
 * Provides a debounced search input for filtering products
 * Features a clear button and platform-specific styling
 */

import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  useColorScheme,
  Keyboard,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setSearchQuery } from '@/app/store/slices/productsSlice';
import { colors, spacing, typography } from '@/styles/theme';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';

/**
 * Search input component with debounced updates
 * Syncs with Redux store and provides immediate visual feedback
 */
export const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // Get search query from Redux store
  const reduxSearchQuery = useAppSelector((state) => state.products.filters.searchQuery);
  // Local state for immediate input feedback
  const [inputValue, setInputValue] = useState('');

  // Sync local state with Redux store
  useEffect(() => {
    setInputValue(reduxSearchQuery);
  }, [reduxSearchQuery]);

  /**
   * Debounced search handler to prevent excessive Redux updates
   * Waits 300ms after typing stops before updating store
   */
  const handleSearch = useDebouncedCallback((text: string) => {
    dispatch(setSearchQuery(text));
  }, 300);

  /**
   * Handle text input changes
   * Updates local state immediately and triggers debounced store update
   */
  const handleChangeText = (text: string) => {
    setInputValue(text);
    handleSearch(text);
  };

  /**
   * Clear search input and dismiss keyboard
   * Updates both local state and Redux store
   */
  const handleClear = useCallback(() => {
    setInputValue('');
    dispatch(setSearchQuery(''));
    Keyboard.dismiss();
  }, [dispatch]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background[isDark ? 'dark' : 'light'],
          borderColor: colors.border[isDark ? 'dark' : 'light'],
          borderWidth: 1,
        },
      ]}>
      {/* Search icon */}
      <FontAwesome
        name="search"
        size={16}
        color={colors.text[isDark ? 'dark' : 'light']}
        style={styles.searchIcon}
      />
      {/* Search input field */}
      <TextInput
        style={[
          styles.input,
          { color: colors.text[isDark ? 'dark' : 'light'] },
        ]}
        placeholder="Search products..."
        placeholderTextColor={colors.secondaryText[isDark ? 'dark' : 'light']}
        value={inputValue}
        selectionColor={colors.primary}
        onChangeText={handleChangeText}
      />
      {/* Clear button - only shown when input has text */}
      {inputValue ? (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <FontAwesome
            name="times-circle"
            size={16}
            color={colors.text[isDark ? 'dark' : 'light']}
          />
        </Pressable>
      ) : null}
    </View>
  );
};

// Styles for search bar components
const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    // Platform-specific shadow styles
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
  searchIcon: {
    padding: spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: spacing.xs,
    ...typography.body,
  },
  clearButton: {
    padding: spacing.xs,
  },
}); 