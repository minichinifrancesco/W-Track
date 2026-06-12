import React, { useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { logoCompact } from '../constants';
import { getStyles } from '../styles/styles';
import BottomNav from '../components/BottomNav';
import HelpButton from '../components/HelpModal';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { exportWorkoutAsPdf, exportWorkoutAsText } from '../utils/workoutExport';

const EXPORT_MENU_WIDTH = 170;
const EXPORT_MENU_HEIGHT = 94;
const EXPORT_MENU_MARGIN = 12;

export default function HomeScreen({
  workouts,
  formatDate,
  startWorkout,
  deleteWorkout,
  setSelectedWorkout,
  setShowViewWorkout,
  openTemplateEditor,
  createWorkout,
  currentScreen,
  setCurrentScreen,
  activeWorkout,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const { width: windowWidth } = useWindowDimensions();
  const exportButtonRefs = useRef({});
  const [exportMenu, setExportMenu] = useState({
    workout: null,
    position: null,
  });

  const closeExportMenu = () => {
    setExportMenu({ workout: null, position: null });
  };

  const toggleExportMenu = (workout) => {
    if (exportMenu.workout?.id === workout.id) {
      closeExportMenu();
      return;
    }

    const buttonRef = exportButtonRefs.current[workout.id];
    if (!buttonRef?.measureInWindow) return;

    buttonRef.measureInWindow((x, y, width, height) => {
      const left = Math.min(
        Math.max(EXPORT_MENU_MARGIN, x + width - EXPORT_MENU_WIDTH),
        windowWidth - EXPORT_MENU_WIDTH - EXPORT_MENU_MARGIN
      );

      setExportMenu({
        workout,
        position: {
          top: y + height + 8,
          left,
        },
      });
    });
  };

  const handleExport = async (workout, format) => {
    if (!workout) return;

    try {
      if (format === 'pdf') {
        closeExportMenu();
        await exportWorkoutAsPdf(workout);
        return;
      }

      closeExportMenu();
      await exportWorkoutAsText(workout);
    } catch (error) {
      Alert.alert(
        'Export non riuscito',
        error?.message || 'Non è stato possibile esportare questa scheda.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logoCompact} style={styles.logoSmall} />
          <View>
            <Text style={styles.headerTitle}>W-Note</Text>
            <Text style={styles.headerSubtitle}>{formatDate()}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <HelpButton screen="home" />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Le mie schede</Text>
          <TouchableOpacity
            style={styles.chipOutline}
            onPress={createWorkout}>
            <Text style={styles.chipOutlineText}>+ Nuova scheda</Text>
          </TouchableOpacity>
        </View>

        {workouts.map((workout) => (
            <Swipeable
              key={workout.id}
              containerStyle={{ marginBottom: 14 }}
              renderRightActions={() => (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#ef4444',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: '100%',
                    borderRadius: 16,
                    marginLeft: 10,
                  }}
                  onPress={() => deleteWorkout(workout.id)}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Elimina</Text>
                </TouchableOpacity>
              )}>
              <View style={[styles.workoutCard, { marginBottom: 0 }]}>
                <View style={styles.workoutHeader}>
                  <View>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <Text style={styles.exerciseCount}>
                      {workout.exercises.length} esercizi
                    </Text>
                  </View>

                  <View style={styles.exportMenuWrapper}>
                    <TouchableOpacity
                      ref={(ref) => {
                        exportButtonRefs.current[workout.id] = ref;
                      }}
                      accessibilityLabel="Apri menu export scheda"
                      style={styles.iconSquareButton}
                      onPress={() => toggleExportMenu(workout)}>
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={20}
                        color={isDarkMode ? '#cbd5e1' : '#475569'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.workoutActions}>
                  <TouchableOpacity
                    style={styles.outlinedSmallButton}
                    onPress={() => {
                      closeExportMenu();
                      setSelectedWorkout(workout);
                      setShowViewWorkout(true);
                    }}>
                    <Text style={styles.outlinedSmallButtonText}>Dettagli</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.outlinedSmallButton}
                    onPress={() => {
                      closeExportMenu();
                      openTemplateEditor(workout);
                    }}>
                    <Text style={styles.outlinedSmallButtonText}>Modifica</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.primarySmallButton}
                  onPress={() => {
                    closeExportMenu();
                    startWorkout(workout);
                  }}>
                  <Text style={styles.primarySmallButtonText}>
                    Inizia workout
                  </Text>
                </TouchableOpacity>
              </View>
            </Swipeable>
        ))}
      </ScrollView>

      {exportMenu.workout && exportMenu.position && (
        <View style={styles.exportMenuOverlayRoot} pointerEvents="box-none">
          <Pressable
            style={[
              styles.exportMenuBackdrop,
              {
                left: 0,
                right: 0,
                top: 0,
                height: exportMenu.position.top,
              },
            ]}
            onPress={closeExportMenu}
          />
          <Pressable
            style={[
              styles.exportMenuBackdrop,
              {
                left: 0,
                top: exportMenu.position.top,
                width: exportMenu.position.left,
                height: EXPORT_MENU_HEIGHT,
              },
            ]}
            onPress={closeExportMenu}
          />
          <Pressable
            style={[
              styles.exportMenuBackdrop,
              {
                left: exportMenu.position.left + EXPORT_MENU_WIDTH,
                right: 0,
                top: exportMenu.position.top,
                height: EXPORT_MENU_HEIGHT,
              },
            ]}
            onPress={closeExportMenu}
          />
          <Pressable
            style={[
              styles.exportMenuBackdrop,
              {
                left: 0,
                right: 0,
                top: exportMenu.position.top + EXPORT_MENU_HEIGHT,
                bottom: 0,
              },
            ]}
            onPress={closeExportMenu}
          />

          <View
            style={[
              styles.exportMenu,
              {
                left: exportMenu.position.left,
                top: exportMenu.position.top,
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.exportMenuItem}
              onPress={() => handleExport(exportMenu.workout, 'pdf')}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={isDarkMode ? '#cbd5e1' : '#475569'}
              />
              <Text style={styles.exportMenuText}>PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.exportMenuItem}
              onPress={() => handleExport(exportMenu.workout, 'text')}>
              <Ionicons
                name="reader-outline"
                size={18}
                color={isDarkMode ? '#cbd5e1' : '#475569'}
              />
              <Text style={styles.exportMenuText}>Solo testo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.fab, activeWorkout && { bottom: 185 }]}
        onPress={createWorkout}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </SafeAreaView>
  );
}
