import React, { useState, useMemo } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
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
  addMultipleExercisesToActiveWorkout,
  replaceExerciseInActiveWorkout,
  replaceTargetExerciseId,
  setReplaceTargetExerciseId,
  exercises = [],
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  // Multi-select state: array of exercise objects in selection order
  const [selectedExercises, setSelectedExercises] = useState([]);

  // Local state for description modal
  const [localSelectedExercise, setLocalSelectedExercise] = useState(null);
  const [localShowDescription, setLocalShowDescription] = useState(false);

  const isReplaceMode = !!replaceTargetExerciseId;

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

  const handleOpenLocalDescription = (item) => {
    const fullEx = exercises.find(e => e.id === item.id || e.name === item.name);
    setLocalSelectedExercise(fullEx || item);
    setLocalShowDescription(true);
  };

  const toggleExerciseSelection = (e) => {
    if (isReplaceMode) {
      // In replace mode, only single selection
      setSelectedExercises([e]);
      return;
    }
    setSelectedExercises((prev) => {
      const exists = prev.find((x) => x.id === e.id);
      if (exists) {
        return prev.filter((x) => x.id !== e.id);
      } else {
        return [...prev, e];
      }
    });
  };

  const getSelectionIndex = (eId) => {
    const idx = selectedExercises.findIndex((x) => x.id === eId);
    return idx === -1 ? null : idx + 1;
  };

  const handleClose = () => {
    setShowAddExerciseInSession(false);
    setSessionSelectedExercise(null);
    setSelectedExercises([]);
    setReplaceTargetExerciseId && setReplaceTargetExerciseId(null);
    setSearch('');
    setSelectedMuscle(null);
    setSelectedStyle(null);
  };

  const handleConfirm = () => {
    if (selectedExercises.length === 0) return;
    if (isReplaceMode) {
      replaceExerciseInActiveWorkout(replaceTargetExerciseId, selectedExercises[0]);
    } else {
      addMultipleExercisesToActiveWorkout(selectedExercises);
    }
    setSelectedExercises([]);
    setSearch('');
    setSelectedMuscle(null);
    setSelectedStyle(null);
  };

  const isGreen = '#86B749';

  return (
    <Modal
      visible={showAddExerciseInSession}
      animationType="slide"
      transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>
            {isReplaceMode ? 'Sostituisci esercizio' : 'Aggiungi esercizi'}
          </Text>

          {!isReplaceMode && (
            <Text style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 8 }}>
              Tocca gli esercizi per selezionarli. Verranno aggiunti nell'ordine di selezione.
            </Text>
          )}

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
                    const selIdx = getSelectionIndex(e.id);
                    const isSelected = selIdx !== null;

                    return (
                      <View
                        key={e.id}
                        style={[
                          styles.selectableExercise,
                          isSelected && styles.selectedExercise,
                          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 6, paddingVertical: 6 }
                        ]}
                      >
                        <TouchableOpacity
                          style={{ flex: 1, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' }}
                          onPress={() => toggleExerciseSelection(e)}
                        >
                          {/* Selection badge */}
                          <View style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: isSelected ? isGreen : '#cbd5e1',
                            backgroundColor: isSelected ? isGreen : 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 8,
                            flexShrink: 0,
                          }}>
                            {isSelected && (
                              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>
                                {isReplaceMode ? '✓' : selIdx}
                              </Text>
                            )}
                          </View>
                          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
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

          {selectedExercises.length > 0 && (
            <View style={{
              backgroundColor: '#f0fdf4',
              borderRadius: 10,
              padding: 10,
              marginVertical: 8,
              borderWidth: 1,
              borderColor: '#86B749',
            }}>
              <Text style={{ color: '#15803d', fontWeight: '700', fontSize: 13, marginBottom: 4 }}>
                {isReplaceMode
                  ? `Sostituisci con: ${selectedExercises[0].name}`
                  : `${selectedExercises.length} esercizi selezionati:`}
              </Text>
              {!isReplaceMode && selectedExercises.map((ex, i) => (
                <Text key={ex.id} style={{ color: '#166534', fontSize: 12 }}>
                  {i + 1}. {ex.name}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              { marginBottom: 0, opacity: selectedExercises.length === 0 ? 0.4 : 1 }
            ]}
            onPress={handleConfirm}
            disabled={selectedExercises.length === 0}
          >
            <Text style={styles.primaryButtonText}>
              {isReplaceMode
                ? 'Sostituisci'
                : selectedExercises.length > 0
                  ? `Aggiungi ${selectedExercises.length} esercizi`
                  : 'Seleziona esercizi'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleClose}>
            <Text style={styles.secondaryButtonText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>

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
