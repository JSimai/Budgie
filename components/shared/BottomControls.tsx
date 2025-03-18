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

type ControlMode = 'none' | 'filter' | 'sort';

const sortOptions = [
  { id: 'biggestDiscount', label: 'Biggest Discount' },
  { id: 'biggestSaving', label: 'Biggest Saving' },
  { id: 'lowestPrice', label: 'Lowest Price' },
  { id: 'highestPrice', label: 'Highest Price' },
] as const;

interface BottomControlsProps {
  onHeightChange?: (height: number) => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({ onHeightChange }) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [mode, setMode] = useState<ControlMode>('none');

  const items = useAppSelector((state) => state.products.items);
  const selectedCategories = useAppSelector((state) => state.products.filters.category);
  const currentSort = useAppSelector((state) => state.products.filters.sortBy);

  // Memoize categories derivation
  const categories = useMemo(() => {
    const uniqueCategories = new Set(items.map((p) => p.category));
    return Array.from(uniqueCategories);
  }, [items]);

  const handleCategorySelect = (category: string) => {
    dispatch(setCategory(category));
  };

  const handleSortSelect = (sort: typeof sortOptions[number]['id']) => {
    dispatch(setSortBy(sort));
    setMode('none');
  };

  const toggleMode = (newMode: ControlMode) => {
    setMode(mode === newMode ? 'none' : newMode);
  };

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
      {/* Sort Section */}
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortOptions}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    // currentSort === option.id && styles.selectedSortOption,
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
            <Text style={[styles.sortText, { color: colors.text[isDark ? 'dark' : 'light'] }]}>
              {sortOptions.find(opt => opt.id === currentSort)?.label}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Filter Section */}
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
            // Grid view of all filters when open
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
            // Horizontal scroll of selected filters when closed
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

      {/* Controls Row */}
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
  },
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
  sortOptions: {
    flexDirection: 'row',
    // borderTopWidth: 1,
    // borderTopColor: colors.border.light,
    // padding: spacing.xs,
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
    // backgroundColor: colors.primary,
    borderColor: colors.primary,
    marginRight: spacing.xs,
  },
  filterPillText: {
    ...typography.caption1,
  },
  pillIcon: {
    marginLeft: spacing.xs,
  },
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