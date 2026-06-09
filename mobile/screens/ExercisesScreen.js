import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, Image, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, useColorScheme } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { logoCompact } from '../constants';
import { getStyles, getThemeColors } from '../styles/styles';
import BottomNav from '../components/BottomNav';
import HelpButton from '../components/HelpModal';
import FilterDropdown from '../components/FilterDropdown';

export default function ExercisesScreen({
  setShowCustomExercise,
  deleteCustomExercise,
  formatDate,
  currentScreen,
  setCurrentScreen,
  openExerciseDescription,
  exercises = [],
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);

  // Dynamically resolve localStyles inside ExercisesScreen component or compute inline
  const localStyles = {
    filterContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: styles.header.backgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: styles.header.borderBottomColor || C.border,
    },
  };
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // 1. Search Query
      if (search.trim() !== '') {
        const query = search.toLowerCase();
        if (!ex.name.toLowerCase().includes(query)) return false;
      }
      // 2. Muscle Group (Gruppo muscolare)
      if (selectedMuscle && ex.muscleGroup !== selectedMuscle) {
        return false;
      }
      // 3. Category (Categoria: Macchinari, Corpo libero, Pesi)
      if (selectedStyle) {
        if (selectedStyle === 'Macchinari' && ex.subcategory !== 'Macchinari') return false;
        if (selectedStyle === 'Corpo libero' && ex.subcategory !== 'Corpo libero') return false;
        if (selectedStyle === 'Pesi' && ex.subcategory !== 'Pesi liberi' && ex.subcategory !== 'Con pesi') return false;
      }
      return true;
    });
  }, [exercises, search, selectedMuscle, selectedStyle]);

  const grouped = useMemo(() => {
    const res = {};
    filteredExercises.forEach((ex) => {
      if (!res[ex.muscleGroup]) res[ex.muscleGroup] = [];
      res[ex.muscleGroup].push(ex);
    });
    return res;
  }, [filteredExercises]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logoCompact} style={styles.logoSmall} />
          <View>
            <Text style={styles.headerTitle}>Esercizi</Text>
            <Text style={styles.headerSubtitle}>{formatDate()}</Text>
          </View>
        </View>
        <HelpButton screen="exercises" />
      </View>

      <TouchableOpacity
        style={styles.addExerciseButton}
        onPress={() => setShowCustomExercise(true)}>
        <Text style={styles.primaryButtonText}>+ Nuovo esercizio</Text>
      </TouchableOpacity>

      {/* Filtering Section container */}
      <View style={localStyles.filterContainer}>
        {/* Search Input */}
        <TextInput
          style={[styles.inputSmall, { marginBottom: 8 }]}
          placeholder="Cerca esercizio..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94a3b8"
        />

        {/* Filter Lists */}
        <View style={{ gap: 6 }}>
          <FilterDropdown
            label="Gruppo muscolare"
            icon="💪"
            options={['Cardio', 'Gambe e glutei', 'Petto', 'Schiena', 'Spalle', 'Bicipiti', 'Tricipiti', 'Addome e core', 'Polpacci', 'Glutei specifici', 'Full body']}
            selected={selectedMuscle}
            allLabel="Tutti i muscoli"
            onSelect={setSelectedMuscle}
          />
          <FilterDropdown
            label="Categoria"
            icon="🏷️"
            options={['Macchinari', 'Corpo libero', 'Pesi']}
            selected={selectedStyle}
            allLabel="Tutte le categorie"
            onSelect={setSelectedStyle}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {Object.keys(grouped).length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>Nessun esercizio trovato</Text>
        ) : (
          Object.keys(grouped).map((muscle) => (
            <View key={muscle} style={styles.muscleGroupSection}>
              <Text style={styles.muscleGroupTitle}>{muscle}</Text>

              {grouped[muscle].map((ex) => {
                const item = (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => openExerciseDescription(ex)}
                    style={styles.exerciseListItem}
                  >
                    <Text style={styles.exerciseListName}>{ex.name}</Text>
                    {ex.custom ? (
                      <Text style={styles.customBadge}>Custom</Text>
                    ) : (
                      <Text style={{ fontSize: 11, color: C.textMuted }}>ℹ️</Text>
                    )}
                  </TouchableOpacity>
                );

                if (ex.custom) {
                  return (
                    <Swipeable
                      key={ex.id}
                      renderRightActions={() => (
                        <TouchableOpacity
                          style={styles.deleteSetSwipeButton}
                          onPress={() => deleteCustomExercise(ex.id)}>
                          <Text style={styles.deleteSetSwipeText}>Elimina</Text>
                        </TouchableOpacity>
                      )}>
                      {item}
                    </Swipeable>
                  );
                }

                return <View key={ex.id}>{item}</View>;
              })}
            </View>
          ))
        )}
      </ScrollView>

      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </SafeAreaView>
  );
}
