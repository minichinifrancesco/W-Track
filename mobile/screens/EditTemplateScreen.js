import React from 'react';
import {
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useEffectiveDark, useSettings } from '../context/SettingsContext';
import { Swipeable } from 'react-native-gesture-handler';
import { getStyles } from '../styles/styles';
import DraggableExerciseList from '../components/DraggableExerciseList';
import DraftTextInput from '../components/DraftTextInput';
import HelpButton from '../components/HelpModal';

const isTimed = (type) => type === 'timed';
const isRepsOnly = (type) => type === 'reps';
const normalizeNumberInput = (value) => (value === '' ? '0' : value);

export default function EditTemplateScreen({
  templateWorkout,
  setTemplateWorkout,
  setCurrentScreen,
  saveTemplateWorkout,
  setTemplateSelectedExercise,
  setTemplateSets,
  setTemplateReps,
  setTemplateWeight,
  setTemplateRestTime,
  setTemplateDuration,
  setShowAddExerciseInTemplate,
  deleteExerciseFromTemplate,
  deleteSetFromTemplateExercise,
  updateTemplateSetDetail,
  addSetToTemplateExercise,
  openExerciseDescription,
}) {
  const isDarkMode = useEffectiveDark();
  const { settings } = useSettings();
  const styles = getStyles(isDarkMode);

  if (!templateWorkout) return null;

  const openAddExercise = () => {
    setTemplateSelectedExercise(null);
    setTemplateSets('');
    setTemplateReps('');
    setTemplateWeight('');
    setTemplateRestTime('60');
    setTemplateDuration('');
    setShowAddExerciseInTemplate(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setTemplateWorkout(null);
            setCurrentScreen('home');
          }}>
          <Text style={styles.backButton}>← Indietro</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {templateWorkout.isNew ? 'Nuova scheda' : 'Modifica scheda'}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <HelpButton screen="edit" />
          <TouchableOpacity
            onPress={saveTemplateWorkout}
            style={{
              backgroundColor: '#86B749',
              paddingHorizontal: 16,
              paddingVertical: 7,
              borderRadius: 999,
            }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Salva</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <View style={[styles.workoutTimerContainer, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={[styles.workoutTimerLabel, { marginRight: 8, minWidth: 52 }]}>Nome:</Text>
          <TextInput
            style={[
              styles.workoutTimerValue,
              {
                flex: 1,
                borderBottomWidth: 1.5,
                borderBottomColor: '#86B749',
                paddingVertical: 2,
                paddingHorizontal: 4,
                fontSize: 18,
              },
            ]}
            value={templateWorkout.name}
            onChangeText={(text) =>
              setTemplateWorkout((prev) => ({ ...prev, name: text }))
            }
            placeholder="Nome scheda"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit
          />
        </View>

        {/* EXERCISE LIST — flex:1, scrollable, add button at bottom */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
          <DraggableExerciseList
            items={templateWorkout.exercises}
            onReorder={(newExercises) =>
              setTemplateWorkout((prev) => ({ ...prev, exercises: newExercises }))
            }
            contentContainerStyle={styles.content}
            ListFooterComponent={
              <TouchableOpacity
                style={[styles.addExerciseButton, { marginBottom: 8 }]}
                onPress={openAddExercise}>
                <Text style={styles.primaryButtonText}>+ Aggiungi esercizio</Text>
              </TouchableOpacity>
            }
            renderItem={(ex, triggerDrag, isDragging) => {
            const exType = ex.type || 'weight_reps';
            const timed = isTimed(exType);
            const repsOnly = isRepsOnly(exType);

          return (
            <Swipeable
              key={ex.id}
              enabled={!isDragging}
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteSetSwipeButton}
                  onPress={() => deleteExerciseFromTemplate(ex.id)}>
                  <Text style={styles.deleteSetSwipeText}>Elimina</Text>
                </TouchableOpacity>
              )}>
              <View style={styles.activeExerciseCard}>
                <TouchableOpacity activeOpacity={1} onLongPress={triggerDrag}>
                  <View style={styles.exerciseHeaderRow}>
                    <TouchableOpacity
                      style={styles.exerciseTitleContainer}
                      onPress={() => openExerciseDescription(ex)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.activeExerciseName, { color: styles.addSetRowButtonText.color, textDecorationLine: 'underline' }]}>
                        {ex.name}
                      </Text>
                      <Text style={styles.muscleGroup}>
                        {ex.muscleGroup}{ex.equipmentType ? ` • ${ex.equipmentType}` : ''} ℹ️
                      </Text>
                    </TouchableOpacity>
                    {timed || repsOnly ? (
                      <Text style={{ fontSize: 18, marginLeft: 8 }}>
                        {timed ? '⏱' : '🔁'}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>

                  {timed ? (
                    <>
                      <View style={styles.setHeaderRow}>
                        <Text style={styles.setHeaderText}>Serie</Text>
                        <Text style={styles.setHeaderText}>Minuti</Text>
                      </View>
                      {(ex.setDetails || []).map((sd, setIndex) => (
                        <Swipeable
                          key={setIndex}
                          renderRightActions={() => (
                            <TouchableOpacity
                              style={styles.deleteSetSwipeButton}
                              onPress={() => deleteSetFromTemplateExercise(ex.id, setIndex)}>
                              <Text style={styles.deleteSetSwipeText}>Elimina</Text>
                            </TouchableOpacity>
                          )}>
                          <View style={styles.setRow}>
                            <Text style={styles.setCellSerie}>{setIndex + 1}</Text>
                            <DraftTextInput
                              style={styles.setCellInput}
                              keyboardType="decimal-pad"
                              returnKeyType="done"
                              value={sd.duration}
                              fallback={0}
                              normalizeOnCommit={normalizeNumberInput}
                              onCommit={(t) =>
                                updateTemplateSetDetail(ex.id, setIndex, 'duration', t)
                              }
                              onSubmitEditing={Keyboard.dismiss}
                            />
                          </View>
                        </Swipeable>
                      ))}
                    </>
                  ) : repsOnly ? (
                    <>
                      <View style={styles.setHeaderRow}>
                        <Text style={styles.setHeaderText}>Serie</Text>
                        <Text style={styles.setHeaderText}>Reps</Text>
                      </View>
                      {(ex.setDetails || []).map((sd, setIndex) => (
                        <Swipeable
                          key={setIndex}
                          renderRightActions={() => (
                            <TouchableOpacity
                              style={styles.deleteSetSwipeButton}
                              onPress={() => deleteSetFromTemplateExercise(ex.id, setIndex)}>
                              <Text style={styles.deleteSetSwipeText}>Elimina</Text>
                            </TouchableOpacity>
                          )}>
                          <View style={styles.setRow}>
                            <Text style={styles.setCellSerie}>{setIndex + 1}</Text>
                            <DraftTextInput
                              style={styles.setCellInput}
                              keyboardType="numeric"
                              returnKeyType="done"
                              value={sd.reps}
                              fallback={0}
                              normalizeOnCommit={normalizeNumberInput}
                              onCommit={(t) =>
                                updateTemplateSetDetail(ex.id, setIndex, 'reps', t)
                              }
                              onSubmitEditing={Keyboard.dismiss}
                            />
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
                      </View>
                      {(ex.setDetails || []).map((sd, setIndex) => (
                        <Swipeable
                          key={setIndex}
                          renderRightActions={() => (
                            <TouchableOpacity
                              style={styles.deleteSetSwipeButton}
                              onPress={() => deleteSetFromTemplateExercise(ex.id, setIndex)}>
                              <Text style={styles.deleteSetSwipeText}>Elimina</Text>
                            </TouchableOpacity>
                          )}>
                          <View style={styles.setRow}>
                            <Text style={styles.setCellSerie}>{setIndex + 1}</Text>
                            <DraftTextInput
                              style={styles.setCellInput}
                              keyboardType="decimal-pad"
                              returnKeyType="done"
                              value={sd.weight}
                              fallback={0}
                              normalizeOnCommit={normalizeNumberInput}
                              onCommit={(t) =>
                                updateTemplateSetDetail(ex.id, setIndex, 'weight', t)
                              }
                              onSubmitEditing={Keyboard.dismiss}
                            />
                            <DraftTextInput
                              style={styles.setCellInput}
                              keyboardType="numeric"
                              returnKeyType="done"
                              value={sd.reps}
                              fallback={0}
                              normalizeOnCommit={normalizeNumberInput}
                              onCommit={(t) =>
                                updateTemplateSetDetail(ex.id, setIndex, 'reps', t)
                              }
                              onSubmitEditing={Keyboard.dismiss}
                            />
                          </View>
                        </Swipeable>
                      ))}
                    </>
                  )}

                  {/* Rest time editor */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 8, paddingHorizontal: 4 }}>
                    <Text style={{ fontSize: 13, color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: '600', marginRight: 6 }}>
                      Timer recupero:
                    </Text>
                    <DraftTextInput
                      style={{
                        borderWidth: 1,
                        borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                        borderRadius: 6,
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                        fontSize: 13,
                        color: isDarkMode ? '#f8fafc' : '#0f172a',
                        width: 55,
                        textAlign: 'center',
                        fontWeight: '600',
                        backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                      }}
                      keyboardType="numeric"
                      returnKeyType="done"
                      value={ex.restTime}
                      fallback={60}
                      normalizeOnCommit={normalizeNumberInput}
                      onCommit={(val) => {
                        setTemplateWorkout((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            exercises: prev.exercises.map((e) =>
                              e.id === ex.id ? { ...e, restTime: val } : e
                            ),
                          };
                        });
                      }}
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <Text style={{ fontSize: 13, color: isDarkMode ? '#94a3b8' : '#64748b', marginLeft: 4 }}>
                      secondi
                    </Text>
                  </View>

                  {/* Note per esercizio */}
                  {settings.showExerciseNotes !== false && (
                    <View style={{ marginTop: 10, marginBottom: 8, paddingHorizontal: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: isDarkMode ? '#cbd5e1' : '#475569', marginBottom: 4 }}>Note esercizio:</Text>
                      <DraftTextInput
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
                        onCommit={(val) => {
                          setTemplateWorkout((prev) => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              exercises: prev.exercises.map((e) =>
                                e.id === ex.id ? { ...e, note: val } : e
                              ),
                            };
                          });
                        }}
                        multiline
                        blurOnSubmit
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.addSetRowButton}
                    onPress={() => addSetToTemplateExercise(ex.id)}>
                    <Text style={styles.addSetRowButtonText}>+ Aggiungi serie</Text>
                  </TouchableOpacity>
              </View>
            </Swipeable>
          );
        }}
        />
          </View>
        </TouchableWithoutFeedback>
      </View>

    </SafeAreaView>
  );
}
