import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { getStyles } from '../styles/styles';
import DraggableExerciseList from '../components/DraggableExerciseList';
import HelpButton from '../components/HelpModal';

const isTimed = (type) => type === 'timed';
const isRepsOnly = (type) => type === 'reps';

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
  const isDarkMode = useColorScheme() === 'dark';
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

        <Text style={styles.headerTitle}>Modifica scheda</Text>

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
        />
      </View>

      {/* EXERCISE LIST — flex:1, scrollable, add button at bottom */}
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
              <TouchableOpacity activeOpacity={1} onLongPress={triggerDrag}>
                <View style={styles.activeExerciseCard}>
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
                        {ex.muscleGroup}{ex.subcategory ? ` • ${ex.subcategory}` : ''} ℹ️
                      </Text>
                    </TouchableOpacity>
                    {timed || repsOnly ? (
                      <Text style={{ fontSize: 18, marginLeft: 8 }}>
                        {timed ? '⏱' : '🔁'}
                      </Text>
                    ) : null}
                  </View>

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
                            <TextInput
                              style={styles.setCellInput}
                              keyboardType="decimal-pad"
                              value={String(sd.duration ?? 0)}
                              onChangeText={(t) =>
                                updateTemplateSetDetail(ex.id, setIndex, 'duration', t)
                              }
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
                            <TextInput
                              style={styles.setCellInput}
                              keyboardType="numeric"
                              value={String(sd.reps ?? 0)}
                              onChangeText={(t) =>
                                updateTemplateSetDetail(ex.id, setIndex, 'reps', t)
                              }
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
                            <TextInput
                              style={styles.setCellInput}
                              keyboardType="decimal-pad"
                              value={String(sd.weight ?? 0)}
                              onChangeText={(t) =>
                                updateTemplateSetDetail(ex.id, setIndex, 'weight', t)
                              }
                            />
                            <TextInput
                              style={styles.setCellInput}
                              keyboardType="numeric"
                              value={String(sd.reps ?? 0)}
                              onChangeText={(t) =>
                                updateTemplateSetDetail(ex.id, setIndex, 'reps', t)
                              }
                            />
                          </View>
                        </Swipeable>
                      ))}
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.addSetRowButton}
                    onPress={() => addSetToTemplateExercise(ex.id)}>
                    <Text style={styles.addSetRowButtonText}>+ Aggiungi serie</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Swipeable>
          );
        }}
      />
      </View>
    </SafeAreaView>
  );
}
