import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useEffectiveDark, useSettings } from '../context/SettingsContext';
import { Swipeable } from 'react-native-gesture-handler';
import { logoCompact, COLORS } from '../constants';
import { Ionicons } from '@expo/vector-icons';
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
  setReplaceTargetExerciseId,
}) {
  const isDarkMode = useEffectiveDark();
  const { settings } = useSettings();
  const styles = getStyles(isDarkMode);
  const [showStats, setShowStats] = useState(false);

  // Editable workout timer state
  const [editingWorkoutTime, setEditingWorkoutTime] = useState(false);
  const [workoutTimeInput, setWorkoutTimeInput] = useState('');

  if (!activeWorkout) return null;

  const sessionStats = useMemo(() => computeSessionStats(activeWorkout.exercises), [activeWorkout.exercises]);
  const totalCompletedSets = useMemo(() => sessionStats.reduce((s, x) => s + x.sets, 0), [sessionStats]);

  const openAddExercise = useCallback(() => {
    setSessionSelectedExercise(null);
    setSessionSets('');
    setSessionReps('');
    setSessionWeight('');
    setSessionRestTime('60');
    setSessionDuration('');
    if (setReplaceTargetExerciseId) setReplaceTargetExerciseId(null);
    setShowAddExerciseInSession(true);
  }, [setSessionSelectedExercise, setSessionSets, setSessionReps, setSessionWeight, setSessionRestTime, setSessionDuration, setReplaceTargetExerciseId, setShowAddExerciseInSession]);

  const openReplaceExercise = useCallback((exerciseId) => {
    if (setReplaceTargetExerciseId) setReplaceTargetExerciseId(exerciseId);
    setShowAddExerciseInSession(true);
  }, [setReplaceTargetExerciseId, setShowAddExerciseInSession]);

  // Parse HH:MM:SS or MM:SS to seconds
  const parseHMStoSeconds = useCallback((str) => {
    const parts = str.trim().split(':').map((p) => parseInt(p, 10) || 0);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  }, []);

  const handleStartTimeEdit = useCallback(() => {
    setWorkoutTimeInput(formatWorkoutTime(workoutSeconds));
    setEditingWorkoutTime(true);
  }, [formatWorkoutTime, workoutSeconds]);

  const handleSaveTime = useCallback(() => {
    const newSeconds = parseHMStoSeconds(workoutTimeInput);
    setWorkoutSeconds(newSeconds);
    setEditingWorkoutTime(false);
  }, [parseHMStoSeconds, workoutTimeInput, setWorkoutSeconds]);

  const handleCancelWorkout = useCallback(() => {
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
  }, [setActiveWorkout, setCurrentScreen, setWorkoutSeconds, setTimer, setTimerActive]);

  const handleFinishWorkout = useCallback(() => {
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
  }, [finishWorkout]);

  const handleNoteChange = useCallback((exerciseId, val) => {
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === exerciseId ? { ...e, note: val } : e
        ),
      };
    });
  }, [setActiveWorkout]);

  const ListFooter = useMemo(() => (
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
  ), [styles, openAddExercise, handleCancelWorkout, handleFinishWorkout]);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => setCurrentScreen('home')}
            style={{ marginRight: 10, paddingVertical: 4 }}
          >
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#ffffff' : '#1e293b'} />
          </TouchableOpacity>
          <Image source={logoCompact} style={styles.logoSmall} />
          <View>
            <Text style={styles.headerTitle}>Sessione attiva</Text>
            <Text style={styles.headerSubtitle}>{activeWorkout.name}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <HelpButton screen="active" />
          <TouchableOpacity style={styles.statsButton} onPress={() => setShowStats(true)}>
            <Text style={styles.statsButtonText}>Stats 📊</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chipOutline}
            onPress={() => setIsPaused((prev) => !prev)}>
            <Text style={styles.chipOutlineText}>{isPaused ? 'Riprendi' : 'Pausa'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* WORKOUT TIMER — now editable */}
      <View style={styles.workoutTimerContainer}>
        <Text style={styles.workoutTimerLabel}>Tempo allenamento</Text>
        {editingWorkoutTime ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
            <TextInput
              style={{
                borderBottomWidth: 2,
                borderBottomColor: '#86B749',
                fontSize: 22,
                fontWeight: '700',
                color: isDarkMode ? '#ffffff' : '#1e293b',
                minWidth: 110,
                textAlign: 'center',
                paddingVertical: 2,
              }}
              value={workoutTimeInput}
              onChangeText={setWorkoutTimeInput}
              keyboardType="numbers-and-punctuation"
              autoFocus
              placeholder="HH:MM:SS"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
            />
            <TouchableOpacity
              onPress={handleSaveTime}
              style={{ backgroundColor: '#86B749', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingWorkoutTime(false)}>
              <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleStartTimeEdit} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Text style={styles.workoutTimerValue}>{formatWorkoutTime(workoutSeconds)}</Text>
            <Ionicons name="create-outline" size={14} color="#86B749" style={{ marginTop: 2 }} />
          </TouchableOpacity>
        )}
      </View>

      {/* EXERCISE LIST — flex:1 so it fills remaining space and scrolls */}
      <View style={{ flex: 1 }}>
        <DraggableExerciseList
          items={activeWorkout.exercises}
          onReorder={(newExercises) =>
            setActiveWorkout((prev) => ({ ...prev, exercises: newExercises }))
          }
          contentContainerStyle={styles.content}
          ListFooterComponent={ListFooter}
          renderItem={(ex, triggerDrag, isDragging) => {
          const exType = ex.type || 'weight_reps';
          const timed = isTimed(exType);
          const repsOnly = isRepsOnly(exType);
          const hasRestTime = true;

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

                    {/* Replace exercise button */}
                    <TouchableOpacity
                      onPress={() => openReplaceExercise(ex.id)}
                      style={{
                        paddingHorizontal: 7,
                        paddingVertical: 3,
                        borderRadius: 6,
                        borderWidth: 1.5,
                        borderColor: '#86B749',
                        backgroundColor: '#f0fdf4',
                        marginLeft: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Ionicons name="swap-horizontal" size={14} color="#15803d" />
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
                            <View style={{ flex: 0.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                              <Text style={[styles.setCellSerie, { flex: 0, textAlign: 'center' }]}>{setIndex + 1}</Text>
                              {sd.isPr && (
                                <Ionicons name="medal" size={13} color="#eab308" />
                              )}
                            </View>
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
                            <View style={{ flex: 0.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                              <Text style={[styles.setCellSerie, { flex: 0, textAlign: 'center' }]}>{setIndex + 1}</Text>
                              {sd.isPr && (
                                <Ionicons name="medal" size={13} color="#eab308" />
                              )}
                            </View>
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
                            <View style={{ flex: 0.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                              <Text style={[styles.setCellSerie, { flex: 0, textAlign: 'center' }]}>{setIndex + 1}</Text>
                              {sd.isPr && (
                                <Ionicons name="medal" size={13} color="#eab308" />
                              )}
                            </View>
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

                  {/* Note per esercizio */}
                  {settings.showExerciseNotes !== false && (
                    <View style={{ marginTop: 10, marginBottom: 4, paddingHorizontal: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: isDarkMode ? '#cbd5e1' : '#475569', marginBottom: 4 }}>Note esercizio:</Text>
                      <TextInput
                        style={{
                          backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                          borderWidth: 1,
                          borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                          borderRadius: 8,
                          padding: 8,
                          fontSize: 13,
                          color: isDarkMode ? '#f8fafc' : '#0f172a',
                          minHeight: 40,
                        }}
                        placeholder="Aggiungi una nota (es. impugnatura, altezza sedile...)"
                        placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
                        value={ex.note || ''}
                        onChangeText={(val) => handleNoteChange(ex.id, val)}
                        multiline
                      />
                    </View>
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

      {/* FOOTER RECOVERY TIMER */}
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
