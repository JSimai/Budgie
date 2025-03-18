/**
 * BottomControls Component
 * A complex control panel fixed to the bottom of the screen that provides:
 * - Product sorting functionality
 * - Category filtering
 * - Search capabilities
 * Features responsive design and smooth animations with platform-specific styling
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  setCategory,
  setSortBy,
} from '@/app/store/slices/productsSlice';
import { colors, spacing, typography } from '@/styles/theme';
import { SearchBar } from './SearchBar';

/**
 * Defines the current mode of the controls panel
 * - none: Default state, minimal controls shown
 * - filter: Category filters expanded
 * - sort: Sort options expanded
 */
type ControlMode = 'none' | 'filter' | 'sort';

/**
 * Available sorting options for products
 * Each option has an id for Redux state and a user-friendly label
 */
const sortOptions = [
  { id: 'biggestDiscount', label: 'Biggest Discount' },
  { id: 'biggestSaving', label: 'Biggest Saving' },
  { id: 'lowestPrice', label: 'Lowest Price' },
  { id: 'highestPrice', label: 'Highest Price' },
] as const;

/**
 * Props for the BottomControls component
 * @property onHeightChange - Optional callback for when the controls panel height changes
 */
interface BottomControlsProps {
  onHeightChange?: (height: number) => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({ onHeightChange }) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [mode, setMode] = useState<ControlMode>('none');

  // Redux state selectors
  const items = useAppSelector((state) => state.products.items);
  const selectedCategories = useAppSelector((state) => state.products.filters.category);
  const currentSort = useAppSelector((state) => state.products.filters.sortBy);

  /**
   * Memoized derivation of unique categories from products
   * Prevents unnecessary recalculation when products haven't changed
   */
  const categories = useMemo(() => {
    const uniqueCategories = new Set(items.map((p) => p.category));
    return Array.from(uniqueCategories);
  }, [items]);

  /**
   * Toggles category selection in Redux store
   * Same category can be clicked again to deselect
   */
  const handleCategorySelect = (category: string) => {
    dispatch(setCategory(category));
  };

  /**
   * Updates sort order in Redux store and collapses sort panel
   */
  const handleSortSelect = (sort: typeof sortOptions[number]['id']) => {
    dispatch(setSortBy(sort));
    setMode('none');
  };

  /**
   * Toggles between control modes (filter/sort/none)
   * If current mode is selected again, collapses to 'none'
   */
  const toggleMode = (newMode: ControlMode) => {
    setMode(mode === newMode ? 'none' : newMode);
  };

  /**
   * Notifies parent component of height changes
   * Useful for adjusting scroll views or other layout elements
   */
  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    onHeightChange?.(height);
  };

  return (
    <View 
      style={[styles.container, { 
        backgroundColor: colors.background[isDark ? 'dark' : 'light'] + 'F7',
        borderTopColor: colors.border[isDark ? 'dark' : 'light'],
      }]}
      onLayout={handleLayout}>
      {/* Sort Section - Expandable sort options with current selection display */}
      <TouchableOpacity
        style={[
          styles.sortButton,
          mode === 'sort' && styles.sortButtonExpanded,
          {
            backgroundColor: colors.background[isDark ? 'dark' : 'light'],
            borderColor: colors.border[isDark ? 'dark' : 'light'],
          }
        ]}
        onPress={() => toggleMode('sort')}>
        <View style={styles.sortButtonContent}>
          <FontAwesome
            name="sort"
            size={14}
            color={colors.text[isDark ? 'dark' : 'light']}
          />
          
          {mode === 'sort' ? (
            // Expanded view showing all sort options
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortOptions}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                  ]}
                  onPress={() => handleSortSelect(option.id)}>
                  <Text style={[
                    styles.sortOptionText,
                    { color: currentSort === option.id ? colors.primary : colors.text[isDark ? 'dark' : 'light'] }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )
          :
          (
            // Collapsed view showing current sort selection
            <Text style={[styles.sortText, { color: colors.text[isDark ? 'dark' : 'light'] }]}>
              {sortOptions.find(opt => opt.id === currentSort)?.label}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Filter Section - Shows when filter mode is active or categories are selected */}
      {(mode === 'filter' || selectedCategories.length > 0) && (
        <View style={styles.filterSection}>
          <View style={[styles.filterIcon,
            {
              backgroundColor: colors.background[isDark ? 'dark' : 'light'],
              borderColor: colors.border[isDark ? 'dark' : 'light'],
            }
          ]}>
            <FontAwesome
              name={'filter'}
              size={14}
              color={colors.text[isDark ? 'dark' : 'light']}
            />
          </View>
          {mode === 'filter' ? (
            // Grid view of all available category filters
            <View style={styles.filterGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterPill,
                    {
                      borderColor: colors.border[isDark ? 'dark' : 'light'],
                      backgroundColor: colors.background[isDark ? 'dark' : 'light'],
                    },
                    selectedCategories.includes(category) && styles.selectedFilterPill,
                  ]}
                  onPress={() => handleCategorySelect(category)}>
                  <Text style={[
                    styles.filterPillText,
                    { color: selectedCategories.includes(category) ? '#fff' : colors.text[isDark ? 'dark' : 'light'] }
                  ]}>
                    {category}
                  </Text>
                  {selectedCategories.includes(category) && (
                    <FontAwesome name="check" size={12} color="#fff" style={styles.pillIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            // Horizontal scroll of only selected category filters
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectedFiltersScroll}>
              {selectedCategories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterPill, 
                    styles.selectedFilterPill,
                    {
                      backgroundColor: colors.background[isDark ? 'dark' : 'light'],
                    }
                  ]}
                  onPress={() => handleCategorySelect(category)}>
                  <Text style={[styles.filterPillText, { color: '#fff' }]}>{category}</Text>
                  <FontAwesome name="times" size={12} color="#fff" style={styles.pillIcon} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Controls Row - Search bar and filter toggle button */}
      <View style={styles.controlsRow}>
        <View style={styles.searchContainer}>
          <SearchBar />
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: mode === 'filter' ? colors.primary : colors.background[isDark ? 'dark' : 'light'],
              borderColor: colors.border[isDark ? 'dark' : 'light'],
            }
          ]}
          onPress={() => toggleMode('filter')}>
          <FontAwesome
            name={mode === 'filter' ? 'times' : 'filter'}
            size={16}
            color={mode === 'filter' ? '#fff' : colors.text[isDark ? 'dark' : 'light']}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Styles for the BottomControls component
 * Features platform-specific shadows and animations
 */
const styles = StyleSheet.create({
  // Container styles - Fixed position at bottom with semi-transparent background
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
  },
  // Sort button styles - Expandable button with shadow
  sortButton: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    alignSelf: 'flex-start',
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
  sortButtonExpanded: {
    alignSelf: 'stretch',
  },
  sortButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  sortText: {
    ...typography.caption1,
    fontWeight: '500',
  },
  // Sort options styles - Horizontal scrollable list
  sortOptions: {
    flexDirection: 'row',
  },
  sortOption: {
    paddingHorizontal: spacing.sm,
    borderRightWidth: 1,
    borderRightColor: colors.border.light,
  },
  selectedSortOption: {
    backgroundColor: colors.primary,
  },
  sortOptionText: {
    ...typography.caption1,
  },
  // Filter section styles - Grid or horizontal scroll of category pills
  filterSection: {
    marginVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  selectedFiltersScroll: {
    flexGrow: 0,
  },
  // Filter pill styles - Interactive category buttons with states
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.xs,
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
  selectedFilterPill: {
    borderColor: colors.primary,
    marginRight: spacing.xs,
  },
  filterPillText: {
    ...typography.caption1,
  },
  pillIcon: {
    marginLeft: spacing.xs,
  },
  // Controls row styles - Search bar and filter button container
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchContainer: {
    flex: 1,
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
  // Filter button styles - Circular toggle button
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
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
  // Filter icon styles - Small circular icon container
  filterIcon: {
    width: 27,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.xs,
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
}); 