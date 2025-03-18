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

export const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const reduxSearchQuery = useAppSelector((state) => state.products.filters.searchQuery);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(reduxSearchQuery);
  }, [reduxSearchQuery]);

  const handleSearch = useDebouncedCallback((text: string) => {
    dispatch(setSearchQuery(text));
  }, 300);

  const handleChangeText = (text: string) => {
    setInputValue(text);
    handleSearch(text);
  };

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
      <FontAwesome
        name="search"
        size={16}
        color={colors.text[isDark ? 'dark' : 'light']}
        style={styles.searchIcon}
      />
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

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
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