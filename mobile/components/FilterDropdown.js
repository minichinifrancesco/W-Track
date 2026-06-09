import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { getThemeColors } from '../styles/styles';

/**
 * A horizontal scrollable list of filter chips.
 *
 * Props:
 *  - label:        string   – Filter label/prefix
 *  - options:      string[] – Available options
 *  - selected:     string|null – Currently selected option (null = "all")
 *  - allLabel:     string   – Label for the "all" option (e.g. "Tutti")
 *  - onSelect:     (value: string|null) => void
 *  - icon:         string   – Optional emoji icon
 */
export default function FilterDropdown({
  label,
  options,
  selected,
  allLabel = 'Tutti',
  onSelect,
  icon = '',
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const C = getThemeColors(isDarkMode);

  const styles = StyleSheet.create({
    scrollContainer: {
      paddingVertical: 4,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 8,
    },
    chipActive: {
      backgroundColor: C.primary + '18',
      borderColor: C.primary,
    },
    iconText: {
      fontSize: 14,
      marginRight: 6,
    },
    chipLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: isDarkMode ? '#94a3b8' : '#64748b',
    },
    chipLabelActive: {
      color: C.primary,
    },
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {/* "All" chip */}
      <TouchableOpacity
        style={[styles.chip, !selected && styles.chipActive]}
        onPress={() => onSelect(null)}
        activeOpacity={0.7}
      >
        {icon ? <Text style={styles.iconText}>{icon}</Text> : null}
        <Text style={[styles.chipLabel, !selected && styles.chipLabelActive]}>
          {allLabel}
        </Text>
      </TouchableOpacity>

      {/* Option chips */}
      {options.map((opt) => {
        const isActive = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
