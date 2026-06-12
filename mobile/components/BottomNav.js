import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getStyles, getThemeColors } from '../styles/styles';
import { useEffectiveDark } from '../context/SettingsContext';

export default function BottomNav({ currentScreen, setCurrentScreen }) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[
          styles.navButton,
          currentScreen === 'home' && styles.navButtonActive,
        ]}
        onPress={() => setCurrentScreen('home')}>
        <Ionicons
          name={currentScreen === 'home' ? 'home' : 'home-outline'}
          size={22}
          color={currentScreen === 'home' ? C.textDark : C.textMuted}
          style={{ marginBottom: 2 }}
        />
        <Text
          style={[
            styles.navLabel,
            currentScreen === 'home' && styles.navLabelActive,
          ]}>
          HOME
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navButton,
          currentScreen === 'exercises' && styles.navButtonActive,
        ]}
        onPress={() => setCurrentScreen('exercises')}>
        <MaterialCommunityIcons
          name="dumbbell"
          size={22}
          color={currentScreen === 'exercises' ? C.textDark : C.textMuted}
          style={{ marginBottom: 2 }}
        />
        <Text
          style={[
            styles.navLabel,
            currentScreen === 'exercises' && styles.navLabelActive,
          ]}>
          ESERCIZI
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navButton,
          currentScreen === 'history' && styles.navButtonActive,
        ]}
        onPress={() => setCurrentScreen('history')}>
        <Ionicons
          name="stats-chart"
          size={22}
          color={currentScreen === 'history' ? C.textDark : C.textMuted}
          style={{ marginBottom: 2 }}
        />
        <Text
          style={[
            styles.navLabel,
            currentScreen === 'history' && styles.navLabelActive,
          ]}>
          STORICO
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navButton,
          currentScreen === 'profile' && styles.navButtonActive,
        ]}
        onPress={() => setCurrentScreen('profile')}>
        <Ionicons
          name={currentScreen === 'profile' ? 'person' : 'person-outline'}
          size={22}
          color={currentScreen === 'profile' ? C.textDark : C.textMuted}
          style={{ marginBottom: 2 }}
        />
        <Text
          style={[
            styles.navLabel,
            currentScreen === 'profile' && styles.navLabelActive,
          ]}>
          PROFILO
        </Text>
      </TouchableOpacity>
    </View>
  );
}
