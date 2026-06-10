import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  useColorScheme,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { logoCompact, COLORS } from '../constants';
import { getStyles } from '../styles/styles';
import DraggableExerciseList from '../components/DraggableExerciseList';
import HelpButton from '../components/HelpModal';

const isTimed = (type) => type === 'timed';
const isRepsOnly = (type) => type === 'reps';

function computeSessionStats(exercises) {
  const stats = {};
  (exercises || []).forEach((ex) => {
    const mg = ex.muscleGroup || 'Altro';
    if (!stats[mg]) stats[mg] = { exercises: new Set(), sets: 0 };
    const completedSets = (ex.setDetails || []).filter((sd) => sd.completed).length;
    if (completedSets > 0) {
      stats[mg].exercises.add(ex.id);
      stats[mg].sets += completedSets;
    }
  });
  return Object.entries(stats)
    .filter(([, v]) => v.sets > 0)
    .map(([muscle, v]) => ({ muscle, exercises: v.exercises.size, sets: v.sets }))
    .sort((a, b) => b.sets - a.sets);
}

export default function ActiveWorkoutScreen({
  activeWorkout,
  setActiveWorkout,
  isPaused,
  setIsPaused,
  workoutSeconds,
  setWorkoutSeconds,
  formatWorkoutTime,
  setSessionSelectedExercise,
  setSessionSets,
  setSessionReps,
  setSessionWeight,
  setSessionRestTime,
  setSessionDuration,
  setShowAddExerciseInSession,
  timerActive,
  setTimerActive,
  timer,
  setTimer,
  adjustTimer,
  skipTimer,
  deleteExerciseFromActiveWorkout,
  openRestTimeModal,
  deleteSetFromExercise,
  updateSetDetail,
  toggleSetComplete,
  addSetToExercise,
  finishWorkout,
  setCurrentScreen,
  openExerciseDescription,
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);
  const [showStats, setShowStats] = useState(false);

  if (!activeWorkout) return null;

  const sessionStats = computeSessionStats(activeWorkout.exercises);
  const totalCompletedSets = sessionStats.reduce((s, x) => s + x.sets, 0);

  const openAddExercise = () => {
    setSessionSelectedExercise(null);
    setSessionSets('');
    setSessionReps('');
    setSessionWeight('');
    setSessionRestTime('60');
    setSessionDuration('');
    setShowAddExerciseInSession(true);
  };

  const handleCancelWorkout = () => {
    Alert.alert(
      'Annulla allenamento',
      'Sei sicuro di voler annullare questo allenamento? Tutti i progressi di questa sessione andranno persi.',
      [
        { text: 'No, continua', style: 'cancel' },
        {
          text: 'Sì, annulla',
          style: 'destructive',
          onPress: () => {
            setActiveWorkout(null);
            setCurrentScreen('home');
            setWorkoutSeconds(0);
            setTimer(0);
            setTimerActive(false);
          },
        },
      ]
    );
  };

  const handleFinishWorkout = () => {
    Alert.alert(
      'Termina allenamento',
      'Sei sicuro di voler terminare e salvare questo allenamento nello storico?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Sì, termina',
          onPress: finishWorkout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logoCompact} style={styles.logoSmall} />
          <View>
            <Text style={styles.headerTitle}>Sessione attiva</Text>
            <Text style={styles.headerSubtitle}>{activeWorkout.name}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <HelpButton screen="active" />
          <TouchableOpacity style={styles.statsButton} onPress={() => setShowStats(true)}>
            <Text style={styles.statsButtonText}>Statistiche</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chipOutline}
            onPress={() => setIsPaused((prev) => !prev)}>
            <Text style={styles.chipOutlineText}>{isPaused ? 'Riprendi' : 'Pausa'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* WORKOUT TIMER */}
      <View style={styles.workoutTimerContainer}>
        <Text style={styles.workoutTimerLabel}>Tempo allenamento</Text>
        <Text style={styles.workoutTimerValue}>{formatWorkoutTime(workoutSeconds)}</Text>
      </View>

      {/* EXERCISE LIST — flex:1 so it fills remaining space and scrolls */}
      <View style={{ flex: 1 }}>
        <DraggableExerciseList
          items={activeWorkout.exercises}
          onReorder={(newExercises) =>
            setActiveWorkout((prev) => ({ ...prev, exercises: newExercises }))
          }
          contentContainerStyle={styles.content}
          ListFooterComponent={
            <View style={{ paddingBottom: 20 }}>
              <TouchableOpacity
                style={[styles.addExerciseButton, { marginBottom: 20, marginTop: 12, marginLeft: 0, marginRight: 0 }]}
                onPress={openAddExercise}>
                <Text style={styles.primaryButtonText}>+ Aggiungi esercizio</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: '#e2e8f0', marginBottom: 20 }} />

              {/* Cancel and Finish buttons */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    styles.footerButtonFlex,
                    {
                      backgroundColor: '#fee2e2',
                      borderColor: '#ef4444',
                      borderWidth: 1,
                      marginBottom: 0,
                    }
                  ]}
                  onPress={handleCancelWorkout}>
                  <Text style={[styles.secondaryButtonText, { color: '#ef4444' }]}>Annulla</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.primaryButton, styles.footerButtonFlex, { marginBottom: 0 }]}
                  onPress={handleFinishWorkout}>
                  <Text style={styles.primaryButtonText}>Termina</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          renderItem={(ex, triggerDrag, isDragging) => {
          const exType = ex.type || 'weight_reps';
          const timed = isTimed(exType);
          const repsOnly = isRepsOnly(exType);
          const hasRestTime = !timed;

          return (
            <Swipeable
              key={ex.id}
              enabled={!isDragging}
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteSetSwipeButton}
                  onPress={() => deleteExerciseFromActiveWorkout(ex.id)}>
                  <Text style={styles.deleteSetSwipeText}>Elimina</Text>
                </TouchableOpacity>
              )}>
              <TouchableOpacity activeOpacity={0.9} onLongPress={triggerDrag}>
                <View style={styles.activeExerciseCard}>
                  <View style={styles.exerciseHeaderRow}>
                    {hasRestTime ? (
                      <TouchableOpacity
                        style={styles.restTimeButton}
                        onPress={() => openRestTimeModal(ex.id, ex.restTime || 60)}>
                        <Text style={styles.restTimeButtonText}>{ex.restTime || 60}s</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={[styles.restTimeButton, styles.restTimeButtonDisabled]}>
                        <Text style={styles.restTimeButtonText}>⏱</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.exerciseTitleContainer}
                      onPress={() => openExerciseDescription(ex)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.activeExerciseName, { color: COLORS.primaryDark, textDecorationLine: 'underline' }]}>
                        {ex.name}
                      </Text>
                      <Text style={styles.muscleGroup}>
                        {ex.muscleGroup}{ex.subcategory ? ` • ${ex.subcategory}` : ''} ℹ️
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {timed ? (
                    <>
                      <View style={styles.setHeaderRow}>
                        <Text style={styles.setHeaderText}>Serie</Text>
                        <Text style={styles.setHeaderText}>Minuti</Text>
                        <Text style={styles.setHeaderText}>✓</Text>
                      </View>
                      {(ex.setDetails || []).map((sd, setIndex) => (
                        <Swipeable
                          key={setIndex}
                          renderRightActions={() => (
                            <TouchableOpacity
                              style={styles.deleteSetSwipeButton}
                              onPress={() => deleteSetFromExercise(ex.id, setIndex)}>
                              <Text style={styles.deleteSetSwipeText}>Elimina</Text>
                            </TouchableOpacity>
                          )}>
                          <View style={styles.setRow}>
                            <Text style={styles.setCellSerie}>{setIndex + 1}</Text>
                            <TextInput
                              style={styles.setCellInput}
                              keyboardType="decimal-pad"
                              value={String(sd.duration ?? 0)}
                              onChangeText={(t) => updateSetDetail(ex.id, setIndex, 'duration', t)}
                            />
                            <TouchableOpacity
                              style={[styles.checkButton, sd.completed && styles.checkButtonComplete]}
                              onPress={() => toggleSetComplete(ex.id, setIndex)}>
                              <Text style={styles.checkText}>{sd.completed ? '✓' : ''}</Text>
                            </TouchableOpacity>
                          </View>
                        </Swipeable>
                      ))}
                    </>
                  ) : repsOnly ? (
                    <>
                      <View style={styles.setHeaderRow}>
                        <Text style={styles.setHeaderText}>Serie</Text>
                        <Text style={styles.setHeaderText}>Reps</Text>
                        <Text style={styles.setHeaderText}>✓</Text>
                      </View>
                      {(ex.setDetails || []).map((sd, setIndex) => (
                        <Swipeable
                          key={setIndex}
                          renderRightActions={() => (
                            <TouchableOpacity
                              style={styles.deleteSetSwipeButton}
                              onPress={() => deleteSetFromExercise(ex.id, setIndex)}>
                              <Text style={styles.deleteSetSwipeText}>Elimina</Text>
                            </TouchableOpacity>
                          )}>
                          <View style={styles.setRow}>
                            <Text style={styles.setCellSerie}>{setIndex + 1}</Text>
                            <TextInput
                              style={styles.setCellInput}
                              keyboardType="numeric"
                              value={String(sd.reps ?? 0)}
                              onChangeText={(t) => updateSetDetail(ex.id, setIndex, 'reps', t)}
                            />
                            <TouchableOpacity
                              style={[styles.checkButton, sd.completed && styles.checkButtonComplete]}
                              onPress={() => toggleSetComplete(ex.id, setIndex)}>
                              <Text style={styles.checkText}>{sd.completed ? '✓' : ''}</Text>
                            </TouchableOpacity>
                          </View>
                        </Swipeable>
                      ))}
                    </>
                  ) : (
                    <>
                      <View style={styles.setHeaderRow}>
                        <Text style={styles.setHeaderText}>Serie</Text>
                        <Text style={styles.setHeaderText}>Kg</Text>
                        <Text style={styles.setHeaderText}>Reps</Text>
                        <Text style={styles.setHeaderText}>✓</Text>
                      </View>
                      {(ex.setDetails || []).map((sd, setIndex) => (
                        <Swipeable
                          key={setIndex}
                          renderRightActions={() => (
                            <TouchableOpacity
                              style={styles.deleteSetSwipeButton}
                              onPress={() => deleteSetFromExercise(ex.id, setIndex)}>
                              <Text style={styles.deleteSetSwipeText}>Elimina</Text>
                            </TouchableOpacity>
                          )}>
                          <View style={styles.setRow}>
                            <Text style={styles.setCellSerie}>{setIndex + 1}</Text>
                            <TextInput
                              style={styles.setCellInput}
                              keyboardType="decimal-pad"
                              value={String(sd.weight ?? 0)}
                              onChangeText={(t) => updateSetDetail(ex.id, setIndex, 'weight', t)}
                            />
                            <TextInput
                              style={styles.setCellInput}
                              keyboardType="numeric"
                              value={String(sd.reps ?? 0)}
                              onChangeText={(t) => updateSetDetail(ex.id, setIndex, 'reps', t)}
                            />
                            <TouchableOpacity
                              style={[styles.checkButton, sd.completed && styles.checkButtonComplete]}
                              onPress={() => toggleSetComplete(ex.id, setIndex)}>
                              <Text style={styles.checkText}>{sd.completed ? '✓' : ''}</Text>
                            </TouchableOpacity>
                          </View>
                        </Swipeable>
                      ))}
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.addSetRowButton}
                    onPress={() => addSetToExercise(ex.id)}>
                    <Text style={styles.addSetRowButtonText}>+ Aggiungi serie</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Swipeable>
          );
        }}
      />
      </View>

      {/* FOOTER RECOVERY TIMER (renders in place of bottom footer buttons when active) */}
      {timerActive || timer > 0 ? (
        <View style={styles.timerBar}>
          <Text style={styles.timerLabel}>Recupero</Text>
          <Text style={styles.timerCountdown}>
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </Text>
          <View style={styles.timerControlsRow}>
            <TouchableOpacity style={styles.timerControlButton} onPress={() => adjustTimer(-15)}>
              <Text style={styles.timerControlText}>−15s</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timerControlButtonSecondary} onPress={skipTimer}>
              <Text style={styles.timerControlTextSecondary}>Salta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timerControlButton} onPress={() => adjustTimer(15)}>
              <Text style={styles.timerControlText}>+15s</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* STATS MODAL */}
      <Modal visible={showStats} transparent animationType="fade">
        <TouchableOpacity
          style={styles.statsOverlayBackdrop}
          activeOpacity={1}
          onPress={() => setShowStats(false)}>
          <View style={styles.statsOverlay}>
            <Text style={styles.statsOverlayTitle}>Statistiche sessione</Text>
            <Text style={styles.statsOverlaySubtitle}>
              Serie completate: {totalCompletedSets}
            </Text>
            {sessionStats.length === 0 ? (
              <Text style={styles.statsEmptyText}>Nessuna serie completata ancora.</Text>
            ) : (
              sessionStats.map((s) => (
                <View key={s.muscle} style={styles.statsRow}>
                  <Text style={styles.statsMuscle}>{s.muscle}</Text>
                  <View style={styles.statsValues}>
                    <View style={styles.statsChip}>
                      <Text style={styles.statsChipText}>{s.exercises} esercizi</Text>
                    </View>
                    <View style={[styles.statsChip, styles.statsChipGreen]}>
                      <Text style={[styles.statsChipText, { color: '#15803d' }]}>
                        {s.sets} serie
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
            <TouchableOpacity
              style={[styles.primaryButton, { marginTop: 16 }]}
              onPress={() => setShowStats(false)}>
              <Text style={styles.primaryButtonText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
