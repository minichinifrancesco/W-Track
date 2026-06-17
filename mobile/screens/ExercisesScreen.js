import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { Swipeable } from 'react-native-gesture-handler';
import { logoCompact } from '../constants';
import { getStyles, getThemeColors } from '../styles/styles';
import BottomNav from '../components/BottomNav';
import HelpButton from '../components/HelpModal';
import FilterDropdown from '../components/FilterDropdown';

const MUSCLE_OPTIONS = [
  'Cardio', 'Gambe e glutei', 'Petto', 'Schiena', 'Spalle',
  'Bicipiti', 'Tricipiti', 'Addome e core', 'Polpacci',
  'Glutei specifici', 'Full body',
];
const EQUIPMENT_OPTIONS = [
  'Macchinari',
  'Corpo libero',
  'Pesi liberi',
  'Con pesi',
  'Cavi',
  'Cardio machine',
  'Altro',
];

// Memoized list row component for exercises
const ExerciseRow = React.memo(function ExerciseRow({
  exercise,
  onPress,
  onRename,
  onDelete,
  themeColors,
  styles,
}) {
  const item = (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.exerciseListItem}>
      <Text style={styles.exerciseListName}>{exercise.name}</Text>
      {exercise.custom ? (
        <Text style={styles.customBadge}>Custom</Text>
      ) : (
        <Text style={{ fontSize: 11, color: themeColors.textMuted }}>ℹ️</Text>
      )}
    </TouchableOpacity>
  );

  if (exercise.custom) {
    return (
      <Swipeable
        renderRightActions={() => (
          <View style={{ flexDirection: 'row', height: '100%' }}>
            <TouchableOpacity
              style={[styles.deleteSetSwipeButton, { backgroundColor: '#86B749' }]}
              onPress={onRename}>
              <Text style={styles.deleteSetSwipeText}>Rinomina</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteSetSwipeButton}
              onPress={onDelete}>
              <Text style={styles.deleteSetSwipeText}>Elimina</Text>
            </TouchableOpacity>
          </View>
        )}>
        {item}
      </Swipeable>
    );
  }

  return item;
});

export default function ExercisesScreen({
  setShowCustomExercise,
  openRenameCustomExercise,
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
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // closeSignal: ogni volta che incrementa, il FilterDropdown corrispondente si chiude
  const [closeMuscleSignal, setCloseMuscleSignal] = useState(0);
  const [closeEquipmentSignal, setCloseEquipmentSignal] = useState(0);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      if (search.trim() !== '') {
        const query = search.toLowerCase();
        if (!ex.name.toLowerCase().includes(query)) return false;
      }
      if (selectedMuscle && ex.muscleGroup !== selectedMuscle) return false;
      if (selectedEquipment && (ex.equipmentType || 'Altro') !== selectedEquipment) {
        return false;
      }
      return true;
    });
  }, [exercises, search, selectedMuscle, selectedEquipment]);

  // Flatten grouped results for FlatList
  const flatData = useMemo(() => {
    const res = {};
    filteredExercises.forEach((ex) => {
      if (!res[ex.muscleGroup]) res[ex.muscleGroup] = [];
      res[ex.muscleGroup].push(ex);
    });

    const list = [];
    Object.keys(res).forEach((muscle) => {
      list.push({ type: 'header', title: muscle, id: `header-${muscle}` });
      res[muscle].forEach((ex) => {
        list.push({ type: 'item', data: ex, id: ex.id });
      });
    });
    return list;
  }, [filteredExercises]);

  const handleOpenDescription = useCallback((ex) => {
    Keyboard.dismiss();
    openExerciseDescription(ex);
  }, [openExerciseDescription]);

  const handleDeleteCustom = useCallback((exId) => {
    Keyboard.dismiss();
    deleteCustomExercise(exId);
  }, [deleteCustomExercise]);

  const handleRenameCustom = useCallback((exercise) => {
    Keyboard.dismiss();
    openRenameCustomExercise?.(exercise);
  }, [openRenameCustomExercise]);

  const handleMuscleOpen = useCallback(() => {
    Keyboard.dismiss();
    setCloseEquipmentSignal((n) => n + 1);
  }, []);

  const handleEquipmentOpen = useCallback(() => {
    Keyboard.dismiss();
    setCloseMuscleSignal((n) => n + 1);
  }, []);

  const renderFlatItem = useCallback(({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.muscleGroupTitle}>{item.title}</Text>;
    }
    return (
      <ExerciseRow
        exercise={item.data}
        onPress={() => handleOpenDescription(item.data)}
        onRename={() => handleRenameCustom(item.data)}
        onDelete={() => handleDeleteCustom(item.data.id)}
        themeColors={C}
        styles={styles}
      />
    );
  }, [styles, C, handleOpenDescription, handleRenameCustom, handleDeleteCustom]);

  const listHeader = useMemo(() => {
    const borderColor = isDarkMode ? '#1e293b' : '#e5e7eb';
    return (
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
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <FilterDropdown
              label="Gruppo muscolare"
              options={MUSCLE_OPTIONS}
              selected={selectedMuscle}
              onSelect={setSelectedMuscle}
              closeSignal={closeMuscleSignal}
              onOpen={handleMuscleOpen}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FilterDropdown
              label="Tipo attrezzatura"
              options={EQUIPMENT_OPTIONS}
              selected={selectedEquipment}
              onSelect={setSelectedEquipment}
              closeSignal={closeEquipmentSignal}
              onOpen={handleEquipmentOpen}
            />
          </View>
        </View>
      </View>
    );
  }, [isDarkMode, styles, search, selectedMuscle, selectedEquipment, closeMuscleSignal, closeEquipmentSignal, handleMuscleOpen, handleEquipmentOpen]);

  const keyExtractor = useCallback((item) => String(item.id), []);

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
        onPress={() => {
          Keyboard.dismiss();
          setShowCustomExercise(true);
        }}>
        <Text style={styles.primaryButtonText}>+ Nuovo esercizio</Text>
      </TouchableOpacity>

      <FlatList
        data={flatData}
        renderItem={renderFlatItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      />

      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </SafeAreaView>
  );
}
