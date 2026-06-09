import React, { useState, useMemo } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, useColorScheme } from 'react-native';
import { getStyles } from '../styles/styles';
import ExerciseDescriptionModal from '../components/ExerciseDescriptionModal';
import FilterDropdown from '../components/FilterDropdown';

export default function AddExerciseInSessionModal({
  showAddExerciseInSession,
  setShowAddExerciseInSession,
  groupExercisesByMuscle,
  sessionSelectedExercise,
  setSessionSelectedExercise,
  sessionSets,
  setSessionSets,
  sessionReps,
  setSessionReps,
  sessionWeight,
  setSessionWeight,
  sessionRestTime,
  setSessionRestTime,
  sessionDuration,
  setSessionDuration,
  addExerciseToActiveWorkout,
  exercises = [],
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  // Local state for description modal to avoid nested modal overlapping issues on mobile
  const [localSelectedExercise, setLocalSelectedExercise] = useState(null);
  const [localShowDescription, setLocalShowDescription] = useState(false);

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

  const ex = sessionSelectedExercise;
  const exType = ex?.type || 'weight_reps';
  const isTimed = exType === 'timed';
  const isRepsOnly = exType === 'reps';

  const handleOpenLocalDescription = (item) => {
    const fullEx = exercises.find(e => e.id === item.id || e.name === item.name);
    setLocalSelectedExercise(fullEx || item);
    setLocalShowDescription(true);
  };

  return (
    <Modal
      visible={showAddExerciseInSession}
      animationType="slide"
      transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>Aggiungi esercizio</Text>

          {/* Search bar */}
          <TextInput
            style={styles.inputSmall}
            placeholder="Cerca esercizio..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94a3b8"
          />

          {/* Filter Lists */}
          <View style={{ gap: 6, marginBottom: 12 }}>
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

          <ScrollView style={styles.exerciseList}>
            {Object.keys(grouped).length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 20 }}>Nessun esercizio trovato</Text>
            ) : (
              Object.keys(grouped).map((muscle) => (
                <View key={muscle}>
                  <Text style={styles.muscleGroupTitle}>{muscle}</Text>

                  {grouped[muscle].map((e) => {
                    const typeLabel = e.type === 'timed' ? '⏱' : e.type === 'reps' ? '🔁' : '🏋️‍♂️';
                    return (
                      <View
                        key={e.id}
                        style={[
                          styles.selectableExercise,
                          sessionSelectedExercise?.id === e.id && styles.selectedExercise,
                          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 6, paddingVertical: 6 }
                        ]}
                      >
                        <TouchableOpacity
                          style={{ flex: 1, paddingVertical: 4 }}
                          onPress={() => {
                            setSessionSelectedExercise(e);
                            setSessionSets('');
                            setSessionReps('');
                            setSessionWeight('');
                            setSessionRestTime('60');
                            setSessionDuration('');
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.exerciseListName, { flex: 1 }]}>{e.name}</Text>
                            <Text style={{ fontSize: 12, marginRight: 8 }}>{typeLabel}</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 13,
                            backgroundColor: '#f1f5f9',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1.5,
                            borderColor: '#cbd5e1'
                          }}
                          onPress={() => handleOpenLocalDescription(e)}
                        >
                          <Text style={{ fontSize: 13, fontWeight: '800', color: '#475569' }}>?</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              ))
            )}
          </ScrollView>

          {ex ? (
            <View style={styles.exerciseForm}>
              <Text style={styles.selectedExerciseText}>{ex.name}</Text>
              <Text style={[styles.viewExerciseDetails, { marginBottom: 12, textAlign: 'center' }]}>
                {isTimed
                  ? 'Verrà aggiunto con una serie a 0 min.'
                  : isRepsOnly
                  ? 'Verrà aggiunto con una serie a 0 reps.'
                  : 'Verrà aggiunto con una serie a 0 kg / 0 reps.'}
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={addExerciseToActiveWorkout}>
                <Text style={styles.primaryButtonText}>Aggiungi</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setShowAddExerciseInSession(false);
              setSessionSelectedExercise(null);
              setSearch('');
              setSelectedMuscle(null);
              setSelectedStyle(null);
            }}>
            <Text style={styles.secondaryButtonText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rendered inside this modal so it displays on top of it on both iOS and Android */}
      <ExerciseDescriptionModal
        visible={localShowDescription}
        exercise={localSelectedExercise}
        onClose={() => {
          setLocalShowDescription(false);
          setLocalSelectedExercise(null);
        }}
      />
    </Modal>
  );
}
