import React, { useState, useRef, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
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
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);

  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  // closeSignal: ogni volta che incrementa, il FilterDropdown corrispondente si chiude
  const [closeMuscleSignal, setCloseMuscleSignal] = useState(0);
  const [closeCategorySignal, setCloseCategorySignal] = useState(0);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      if (search.trim() !== '') {
        const query = search.toLowerCase();
        if (!ex.name.toLowerCase().includes(query)) return false;
      }
      if (selectedMuscle && ex.muscleGroup !== selectedMuscle) return false;
      if (selectedStyle) {
        if (selectedStyle === 'Macchinari' && ex.subcategory !== 'Macchinari') return false;
        if (selectedStyle === 'Corpo libero' && ex.subcategory !== 'Corpo libero') return false;
        if (
          selectedStyle === 'Pesi' &&
          ex.subcategory !== 'Pesi liberi' &&
          ex.subcategory !== 'Con pesi'
        ) return false;
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

  const borderColor = isDarkMode ? '#1e293b' : '#e5e7eb';

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
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

      {/* ── Bottone nuovo esercizio ── */}
      <TouchableOpacity
        style={styles.addExerciseButton}
        onPress={() => setShowCustomExercise(true)}>
        <Text style={styles.primaryButtonText}>+ Nuovo esercizio</Text>
      </TouchableOpacity>

      {/*
        ScrollView unico: filtri + lista.
        Il menu a tendina cresce in-flow dentro lo scroll → sempre visibile.
      */}
      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ paddingBottom: 20 }}>

        {/* ── Sezione filtri ── */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
            marginBottom: 8,
          }}>
          {/* Campo ricerca */}
          <TextInput
            style={[styles.inputSmall, { marginBottom: 8 }]}
            placeholder="Cerca esercizio..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94a3b8"
          />

          {/* Due bottoni filtro affiancati */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <FilterDropdown
                label="Gruppo muscolare"
                options={[
                  'Cardio', 'Gambe e glutei', 'Petto', 'Schiena', 'Spalle',
                  'Bicipiti', 'Tricipiti', 'Addome e core', 'Polpacci',
                  'Glutei specifici', 'Full body',
                ]}
                selected={selectedMuscle}
                onSelect={setSelectedMuscle}
                closeSignal={closeMuscleSignal}
                onOpen={() => setCloseCategorySignal((n) => n + 1)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FilterDropdown
                label="Categoria"
                options={['Macchinari', 'Corpo libero', 'Pesi']}
                selected={selectedStyle}
                onSelect={setSelectedStyle}
                closeSignal={closeCategorySignal}
                onOpen={() => setCloseMuscleSignal((n) => n + 1)}
              />
            </View>
          </View>
        </View>

        {/* ── Lista esercizi ── */}
        {Object.keys(grouped).length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>
            Nessun esercizio trovato
          </Text>
        ) : (
          Object.keys(grouped).map((muscle) => (
            <View key={muscle} style={styles.muscleGroupSection}>
              <Text style={styles.muscleGroupTitle}>{muscle}</Text>

              {grouped[muscle].map((ex) => {
                const item = (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => openExerciseDescription(ex)}
                    style={styles.exerciseListItem}>
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
