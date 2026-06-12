import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
} from 'react-native';
import { getThemeColors } from '../styles/styles';
import { useEffectiveDark } from '../context/SettingsContext';

/**
 * FilterDropdown — stato locale, Pressable per massima compatibilità.
 *
 * Props:
 *  - label:       string
 *  - options:     string[]
 *  - selected:    string | null
 *  - onSelect:    (v: string | null) => void
 *  - closeSignal: number   — ogni volta che cambia, chiude il menu
 *  - onOpen:      () => void — chiamato quando si apre, il genitore chiude gli altri
 */
export default function FilterDropdown({
  label,
  options = [],
  selected,
  onSelect,
  closeSignal = 0,
  onOpen,
}) {
  const isDarkMode = useEffectiveDark();
  const C = getThemeColors(isDarkMode);
  const [open, setOpen] = useState(false);

  // Chiudi quando il genitore incrementa il segnale
  useEffect(() => {
    if (closeSignal > 0) setOpen(false);
  }, [closeSignal]);

  const handleToggle = () => {
    if (!open) {
      onOpen?.(); // avvisa il genitore che stiamo aprendo
    }
    setOpen((v) => !v);
  };

  const isActive = selected != null;
  const bg = isDarkMode ? '#1e293b' : '#f9fafb';
  const border = isActive ? C.primary : (isDarkMode ? '#334155' : '#d1d5db');
  const textColor = isActive ? C.primary : (isDarkMode ? '#94a3b8' : '#374151');

  return (
    <View>
      {/* Bottone */}
      <Pressable
        onPress={handleToggle}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 9,
          borderWidth: 1.5,
          borderColor: border,
          backgroundColor: pressed
            ? (isDarkMode ? '#334155' : '#e5e7eb')
            : isActive ? C.primary + '22' : bg,
          paddingHorizontal: 10,
          paddingVertical: 9,
          gap: 4,
        })}>
        <Text numberOfLines={1} style={{ flex: 1, fontSize: 13, fontWeight: '700', color: textColor }}>
          {label}
        </Text>
        {isActive && (
          <Text numberOfLines={1} style={{ fontSize: 11, fontWeight: '600', color: C.primary, flexShrink: 1 }}>
            · {selected}
          </Text>
        )}
        <Text style={{ fontSize: 9, color: textColor }}>{open ? '▲' : '▼'}</Text>
      </Pressable>

      {/* Menu a tendina in-flow */}
      {open && (
        <View
          style={{
            marginTop: 4,
            backgroundColor: isDarkMode ? '#1e293b' : '#fff',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDarkMode ? '#334155' : '#e5e7eb',
            overflow: 'hidden',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
          }}>
          {options.map((opt, i) => {
            const active = selected === opt;
            const last = i === options.length - 1;
            return (
              <Pressable
                key={opt}
                onPress={() => {
                  onSelect(active ? null : opt);
                  setOpen(false);
                }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                  borderBottomWidth: last ? 0 : 1,
                  borderBottomColor: isDarkMode ? '#0f172a' : '#f3f4f6',
                  backgroundColor: pressed
                    ? (isDarkMode ? '#334155' : '#f3f4f6')
                    : active
                    ? C.primary + '14'
                    : 'transparent',
                })}>
                <Text
                  style={{
                    fontSize: 14,
                    color: active ? C.primary : (isDarkMode ? '#cbd5e1' : '#374151'),
                    fontWeight: active ? '700' : '500',
                  }}>
                  {opt}
                </Text>
                {active && <Text style={{ color: C.primary, fontSize: 14 }}>✓</Text>}
              </Pressable>
            );
          })}

          {/* Rimuovi filtro */}
          {isActive && (
            <Pressable
              onPress={() => {
                onSelect(null);
                setOpen(false);
              }}
              style={({ pressed }) => ({
                paddingVertical: 11,
                paddingHorizontal: 14,
                backgroundColor: pressed ? '#fecaca' : (isDarkMode ? '#0f172a' : '#fef2f2'),
              })}>
              <Text style={{ fontSize: 13, color: '#ef4444', fontWeight: '600', textAlign: 'center' }}>
                ✕ Rimuovi filtro
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
