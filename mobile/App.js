import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Alert, StatusBar, TouchableOpacity, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getStyles } from './styles/styles';
import { SettingsProvider, useEffectiveDark, useSettings } from './context/SettingsContext';
import { Ionicons } from '@expo/vector-icons';

// Constants & Helper functions
import { PRESET_EXERCISES } from './constants';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ActiveWorkoutScreen from './screens/ActiveWorkoutScreen';
import EditTemplateScreen from './screens/EditTemplateScreen';
import HistoryScreen from './screens/HistoryScreen';
import ExercisesScreen from './screens/ExercisesScreen';
import ProfileScreen from './screens/ProfileScreen';

// Modals
import CreateWorkoutModal from './modals/CreateWorkoutModal';
import ViewWorkoutModal from './modals/ViewWorkoutModal';
import CustomExerciseModal from './modals/CustomExerciseModal';
import RestTimeModal from './modals/RestTimeModal';
import EditProfileModal from './modals/EditProfileModal';
import HistoryDetailModal from './modals/HistoryDetailModal';
import EditHistoryModal from './modals/EditHistoryModal';
import AddExerciseInSessionModal from './modals/AddExerciseInSessionModal';
import AddExerciseInTemplateModal from './modals/AddExerciseInTemplateModal';

// Components
import ExerciseDescriptionModal from './components/ExerciseDescriptionModal';

function MainApp() {
  const isDarkMode = useEffectiveDark();
  const { settings } = useSettings();
  const styles = getStyles(isDarkMode);

  const [currentScreen, setCurrentScreen] = useState('login');

  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState(PRESET_EXERCISES);
  const [history, setHistory] = useState([]);

  const [activeWorkout, setActiveWorkout] = useState(null);
  const [templateWorkout, setTemplateWorkout] = useState(null);

  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [focusedMuscle, setFocusedMuscle] = useState(null);

  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showViewWorkout, setShowViewWorkout] = useState(false);
  const [showCustomExercise, setShowCustomExercise] = useState(false);
  const [showRestTimeModal, setShowRestTimeModal] = useState(false);
  const [showAddExerciseInSession, setShowAddExerciseInSession] =
    useState(false);
  const [showAddExerciseInTemplate, setShowAddExerciseInTemplate] =
    useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showHistoryDetailModal, setShowHistoryDetailModal] = useState(false);
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false);
  const [replaceTargetExerciseId, setReplaceTargetExerciseId] = useState(null);

  // Exercise Description Modal states
  const [selectedDescriptionExercise, setSelectedDescriptionExercise] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState(null);
  const [editingHistoryRecord, setEditingHistoryRecord] = useState(null);

  const [editingRestExerciseId, setEditingRestExerciseId] = useState(null);
  const [tempRestTime, setTempRestTime] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workoutName, setWorkoutName] = useState('');

  const [customExerciseName, setCustomExerciseName] = useState('');
  const [customMuscleGroup, setCustomMuscleGroup] = useState('');
  const [customExerciseType, setCustomExerciseType] = useState('weight_reps');
  const [customExerciseDescription, setCustomExerciseDescription] = useState('');

  const [profileName, setProfileName] = useState('');
  const [profileAge, setProfileAge] = useState('');
  const [profileHeight, setProfileHeight] = useState('');
  const [profileWeight, setProfileWeight] = useState('');

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [restTime, setRestTime] = useState('60');
  const [duration, setDuration] = useState('');

  const [sessionSelectedExercise, setSessionSelectedExercise] = useState(null);
  const [sessionSets, setSessionSets] = useState('');
  const [sessionReps, setSessionReps] = useState('');
  const [sessionWeight, setSessionWeight] = useState('');
  const [sessionRestTime, setSessionRestTime] = useState('60');
  const [sessionDuration, setSessionDuration] = useState('');

  const [templateSelectedExercise, setTemplateSelectedExercise] =
    useState(null);
  const [templateSets, setTemplateSets] = useState('');
  const [templateReps, setTemplateReps] = useState('');
  const [templateWeight, setTemplateWeight] = useState('');
  const [templateRestTime, setTemplateRestTime] = useState('60');
  const [templateDuration, setTemplateDuration] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0 && !isPaused) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && timerActive) {
      setTimerActive(false);

      // Play native feedback notifications on timer end based on settings preferences
      const triggerFeedback = async () => {
        try {
          if (settings.restTimerHaptic) {
            const Haptics = require('expo-haptics');
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        } catch (err) {
          console.log('Haptics feedback error:', err);
        }

        try {
          if (settings.restTimerSound) {
            const { Audio } = require('expo-av');
            // Configure Audio to play through the ringtone/speaker channel at maximum system output
            await Audio.setAudioModeAsync({
              playsInSilentModeIOS: true,
              staysActiveInBackground: true,
              shouldRouteThroughEarpieceAndroid: false,
            });
            const { sound } = await Audio.Sound.createAsync(
              require('./assets/ping.ogg'),
              { volume: 1.0 } // Set volume level to 1.0 (maximum output)
            );
            await sound.playAsync();
            // Automatically stop the sound after 3 seconds
            setTimeout(async () => {
              try {
                await sound.stopAsync();
                await sound.unloadAsync();
              } catch (e) {}
            }, 3000);
          }
        } catch (err) {
          console.log('Audio feedback error:', err);
        }
      };

      triggerFeedback();
      Alert.alert('Timer terminato', 'Tempo concluso!');
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, isPaused, settings]);

  useEffect(() => {
    let interval;
    if (activeWorkout && !isPaused) {
      interval = setInterval(() => setWorkoutSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, isPaused]);

  useEffect(() => {
    if (user) saveData();
  }, [user, workouts, exercises, history]);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
      // Safety guard: never overwrite exercises with an empty array.
      // If exercises is empty it means loadData() hasn't resolved yet — skip saving.
      if (exercises && exercises.length > 0) {
        await AsyncStorage.setItem('exercises', JSON.stringify(exercises));
      }
      await AsyncStorage.setItem('history', JSON.stringify(history));
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Errore salvataggio dati:', error);
    }
  };

  const openExerciseDescription = (exercise) => {
    if (!exercise) return;
    const fullExercise = exercises.find(e => 
      e.id === exercise.exerciseId || 
      e.id === exercise.id || 
      (e.name && exercise.name && e.name.toLowerCase().trim() === exercise.name.toLowerCase().trim())
    );
    setSelectedDescriptionExercise(fullExercise || exercise);
    setShowDescriptionModal(true);
  };

  const loadData = async () => {
    try {
      const workoutsData = await AsyncStorage.getItem('workouts');
      const exercisesData = await AsyncStorage.getItem('exercises');
      const historyData = await AsyncStorage.getItem('history');
      const userData = await AsyncStorage.getItem('user');

      if (workoutsData) setWorkouts(JSON.parse(workoutsData));

      if (exercisesData) {
        const parsed = JSON.parse(exercisesData);
        // Reset if parsed is empty, or if it's missing the 'Adductor machine' exercise
        // (which was added in the latest preset update). Allow custom exercises (length > PRESET_EXERCISES.length).
        const presetCount = PRESET_EXERCISES.filter(e => !e.custom).length;
        const needsReset =
          !parsed ||
          !Array.isArray(parsed) ||
          parsed.length === 0 ||
          !parsed.some(ex => ex.name === 'Adductor machine') ||
          parsed.filter(ex => !ex.custom).length < presetCount;
        if (needsReset) {
          // Preserve any custom exercises the user created and merge with fresh presets
          const customExercises = Array.isArray(parsed) ? parsed.filter(ex => ex.custom) : [];
          const merged = [...PRESET_EXERCISES, ...customExercises];
          setExercises(merged);
          await AsyncStorage.setItem('exercises', JSON.stringify(merged));
        } else {
          setExercises(parsed);
        }
      } else {
        setExercises(PRESET_EXERCISES);
        await AsyncStorage.setItem('exercises', JSON.stringify(PRESET_EXERCISES));
      }

      if (historyData) setHistory(JSON.parse(historyData));
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setCurrentScreen('home');
        setProfileName(parsed.name || '');
        setProfileAge(parsed.age ? String(parsed.age) : '');
        setProfileHeight(parsed.height ? String(parsed.height) : '');
        setProfileWeight(parsed.weight ? String(parsed.weight) : '');
      }
    } catch (error) {
      console.error('Errore caricamento dati:', error);
    }
  };

  const formatWorkoutTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return (
      `${hours.toString().padStart(2, '0')}:` +
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}`
    );
  };

  const formatDate = () => {
    const d = new Date();
    return d.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const getCompletedSets = () => {
    let count = 0;
    history.forEach((record) => {
      (record.exercises || []).forEach((ex) => {
        (ex.setDetails || []).forEach((sd) => {
          if (sd.completed) count += 1;
        });
      });
    });
    return count;
  };

  const getTotalHours = () => {
    let totalSeconds = 0;
    history.forEach((record) => {
      if (typeof record.durationSeconds === 'number') {
        totalSeconds += record.durationSeconds;
      }
    });
    return Math.round(totalSeconds / 3600);
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Errore', 'Compila tutti i campi');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Errore', 'Formato email non valido');
      return;
    }
    const loggedUser = { email };
    setUser(loggedUser);
    setCurrentScreen('home');
  };

  const handleRegister = () => {
    if (!email || !password) {
      Alert.alert('Errore', 'Compila tutti i campi');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Errore', 'Formato email non valido');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Errore', 'Password deve essere di almeno 6 caratteri');
      return;
    }
    const newUser = { email };
    setUser(newUser);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
    setEmail('');
    setPassword('');
  };

  const createWorkout = () => {
    // Create a new blank workout and open directly in the template editor
    const newWorkout = {
      id: Date.now(),
      name: '',
      exercises: [],
      createdAt: new Date().toISOString(),
      isNew: true,
    };
    openTemplateEditor(newWorkout);
  };

  const deleteWorkout = (id) => {
    Alert.alert('Conferma', 'Vuoi eliminare questa scheda?', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina',
        style: 'destructive',
        onPress: () =>
          setWorkouts((prev) => prev.filter((w) => w.id !== id)),
      },
    ]);
  };

  const createCustomExercise = () => {
    const cleanedExName = customExerciseName.trim();
    const isOnlySpecialChars = /^[-\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?\/~`]+$/.test(cleanedExName);

    if (!cleanedExName || !customMuscleGroup.trim()) {
      Alert.alert(
        'Errore',
        'Compila nome esercizio e scegli il gruppo muscolare'
      );
      return;
    }
    if (isOnlySpecialChars) {
      Alert.alert(
        'Errore',
        'Il nome dell\'esercizio non può contenere solo caratteri speciali o trattini'
      );
      return;
    }

    const newExercise = {
      id: Date.now(),
      name: customExerciseName.trim(),
      muscleGroup: customMuscleGroup,
      type: customExerciseType || 'weight_reps',
      description: customExerciseDescription.trim() || '',
      custom: true,
    };

    setExercises((prev) => [...prev, newExercise]);
    setCustomExerciseName('');
    setCustomMuscleGroup('');
    setCustomExerciseType('weight_reps');
    setCustomExerciseDescription('');
    setShowCustomExercise(false);
  };

  const deleteCustomExercise = (exerciseId) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  const startWorkout = (workout) => {
    const clonedExercises = workout.exercises.map((ex) => {
      const exType = ex.type || 'weight_reps';
      const timed = exType === 'timed';
      const repsOnly = exType === 'reps';

      const setDetails =
        ex.setDetails && ex.setDetails.length > 0
          ? ex.setDetails.map((sd) => ({
              weight: timed || repsOnly ? 0 : sd.weight ?? ex.weight ?? 0,
              reps: timed ? 0 : sd.reps ?? ex.reps ?? 0,
              duration: timed ? sd.duration ?? ex.duration ?? 0 : 0,
              completed: sd.completed ?? false,
            }))
          : Array.from({ length: ex.sets || 1 }, () => ({
              weight: timed || repsOnly ? 0 : ex.weight || 0,
              reps: timed ? 0 : ex.reps || 0,
              duration: timed ? ex.duration || 0 : 0,
              completed: false,
            }));

      return { ...ex, note: ex.note || '', setDetails };
    });

    setActiveWorkout({
      ...workout,
      exercises: clonedExercises,
      startTime: new Date(),
    });
    setWorkoutSeconds(0);
    setTimer(0);
    setTimerActive(false);
    setIsPaused(false);
    setCurrentScreen('activeWorkout');
  };

  const openTemplateEditor = (workout) => {
    const normalizedExercises = workout.exercises.map((ex) => {
      const exType = ex.type || 'weight_reps';
      const timed = exType === 'timed';
      const repsOnly = exType === 'reps';

      const existingSetDetails =
        ex.setDetails && ex.setDetails.length > 0
          ? ex.setDetails.map((sd) => ({
              weight: timed || repsOnly ? 0 : sd.weight ?? ex.weight ?? 0,
              reps: timed ? 0 : sd.reps ?? ex.reps ?? 0,
              duration: timed ? sd.duration ?? ex.duration ?? 0 : 0,
              completed: false,
            }))
          : [{ weight: 0, reps: 0, duration: 0, completed: false }];

      return { ...ex, note: ex.note || '', setDetails: existingSetDetails };
    });

    setTemplateWorkout({
      ...workout,
      exercises: normalizedExercises,
    });
    setCurrentScreen('editTemplate');
  };

  const saveTemplateWorkout = () => {
    if (!templateWorkout) return;

    const cleanedName = (templateWorkout.name || '').trim();
    // Regex matches strings that are only hyphens, punctuation or special characters
    const isOnlySpecialChars = /^[-\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?\/~`]+$/.test(cleanedName);

    if (!cleanedName) {
      Alert.alert('Errore', 'Inserisci un nome per la scheda prima di salvare');
      return;
    }
    if (isOnlySpecialChars) {
      Alert.alert('Errore', 'Il nome della scheda non può contenere solo caratteri speciali o trattini');
      return;
    }

    const normalizedExercises = templateWorkout.exercises.map((ex) => {
      const exType = ex.type || 'weight_reps';
      const timed = exType === 'timed';
      const repsOnly = exType === 'reps';
      const details = ex.setDetails || [];
      const first = details[0] || {};

      return {
        ...ex,
        sets: details.length,
        reps: timed ? 0 : first.reps || 0,
        weight: timed || repsOnly ? 0 : first.weight || 0,
        duration: timed ? first.duration || 0 : 0,
        setDetails: details,
      };
    });

    const finalWorkout = { ...templateWorkout, exercises: normalizedExercises, isNew: false };

    if (templateWorkout.isNew) {
      // New workout: add to list
      setWorkouts((prev) => [...prev, finalWorkout]);
    } else {
      setWorkouts((prev) =>
        prev.map((w) =>
          w.id === templateWorkout.id ? finalWorkout : w
        )
      );
    }

    setTemplateWorkout(null);
    setCurrentScreen('home');
  };

  const startRestTimer = (seconds) => {
    if (!seconds || seconds <= 0) return;
    setTimer(seconds);
    setTimerActive(true);
  };

  const adjustTimer = (delta) => {
    setTimer((prev) => {
      const next = prev + delta;
      if (next <= 0) {
        setTimerActive(false);
        return 0;
      }
      return next;
    });
  };

  const skipTimer = () => {
    setTimer(0);
    setTimerActive(false);
  };

  const toggleSetComplete = (exerciseId, setIndex) => {
    if (!activeWorkout) return;

    const updatedWorkout = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          setDetails: ex.setDetails.map((sd, idx) =>
            idx === setIndex ? { ...sd, completed: !sd.completed } : sd
          ),
        };
      }),
    };

    setActiveWorkout(updatedWorkout);

    const targetExercise = updatedWorkout.exercises.find(
      (ex) => ex.id === exerciseId
    );
    const targetSet = targetExercise?.setDetails?.[setIndex];
    if (!targetExercise || !targetSet) return;

    if (targetSet.completed) {
      startRestTimer(targetExercise.restTime || 60);
    }
  };

  const updateSetDetail = (exerciseId, setIndex, field, value) => {
    if (!activeWorkout) return;

    const THRESHOLD_FACTOR = 3; 

    const targetExercise = activeWorkout.exercises.find(e => e.id === exerciseId);
    const currentSet = targetExercise?.setDetails?.[setIndex];
    if (targetExercise && currentSet) {
      const parsedVal = field === 'reps' ? (parseInt(value, 10) || 0) : (parseFloat(value) || 0);
      const prevVal = field === 'reps' ? (currentSet.reps || 0) : (currentSet.weight || 0);

      if (prevVal > 0 && parsedVal >= prevVal * THRESHOLD_FACTOR) {
        Alert.alert(
          'Valore anomalo',
          `Il valore inserito (${parsedVal}) è molto più alto rispetto a quello precedente (${prevVal}). Sei sicuro che sia corretto?`,
          [
            {
              text: 'Modifica',
              style: 'cancel',
              onPress: () => {}
            },
            {
              text: 'Conferma',
              onPress: () => {
                applySetUpdate(exerciseId, setIndex, field, parsedVal);
              }
            }
          ]
        );
        return;
      }
    }

    const parsedValue = field === 'reps' ? (parseInt(value || '0', 10) || 0) : (parseFloat(value || '0') || 0);
    applySetUpdate(exerciseId, setIndex, field, parsedValue);
  };

  const applySetUpdate = (exerciseId, setIndex, field, parsedValue) => {
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            setDetails: ex.setDetails.map((sd, idx) => {
              if (idx !== setIndex) return sd;
              return { ...sd, [field]: parsedValue };
            }),
          };
        }),
      };
    });
  };

  const deleteSetFromExercise = (exerciseId, setIndex) => {
    if (!activeWorkout) return;

    setActiveWorkout((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          const newSetDetails = ex.setDetails.filter((_, idx) => idx !== setIndex);
          return {
            ...ex,
            setDetails: newSetDetails,
            sets: newSetDetails.length,
          };
        }),
      };
    });
  };

  const deleteExerciseFromActiveWorkout = (exerciseId) => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) =>
      prev
        ? {
            ...prev,
            exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
          }
        : prev
    );
  };

  const addSetToExercise = (exerciseId) => {
    if (!activeWorkout) return;

    setActiveWorkout((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;

          const exType = ex.type || 'weight_reps';
          const timed = exType === 'timed';
          const repsOnly = exType === 'reps';

          // Copy last set values for convenience
          const lastSet = ex.setDetails?.[ex.setDetails.length - 1];
          const newSet = {
            weight: timed || repsOnly ? 0 : lastSet?.weight ?? 0,
            reps: timed ? 0 : lastSet?.reps ?? 0,
            duration: timed ? lastSet?.duration ?? 0 : 0,
            completed: false,
          };

          const newSetDetails = [...ex.setDetails, newSet];
          return {
            ...ex,
            setDetails: newSetDetails,
            sets: newSetDetails.length,
          };
        }),
      };
    });
  };

  const buildExerciseEntry = (exerciseData, overrideId) => {
    const exType = exerciseData.type || 'weight_reps';
    const timed = exType === 'timed';
    const baseRest = settings.defaultRestTime || 60;
    const newEx = {
      id: overrideId ?? Date.now() + Math.random(),
      exerciseId: exerciseData.id,
      name: exerciseData.name,
      muscleGroup: exerciseData.muscleGroup,
      subcategory: exerciseData.subcategory,
      type: exType,
      sets: 1,
      reps: 0,
      weight: 0,
      duration: 0,
      restTime: baseRest,
      setDetails: [{ weight: 0, reps: 0, duration: 0, completed: false }],
    };
    return newEx;
  };

  const addExerciseToActiveWorkout = () => {
    if (!activeWorkout) return;
    if (!sessionSelectedExercise) {
      Alert.alert('Errore', 'Seleziona un esercizio');
      return;
    }
    const newEx = buildExerciseEntry(sessionSelectedExercise);
    setActiveWorkout((prev) =>
      prev ? { ...prev, exercises: [...prev.exercises, newEx] } : prev
    );
    setShowAddExerciseInSession(false);
    setSessionSelectedExercise(null);
    setSessionSets('');
    setSessionReps('');
    setSessionWeight('');
    setSessionRestTime('60');
    setSessionDuration('');
  };

  const addMultipleExercisesToActiveWorkout = (exerciseList) => {
    if (!activeWorkout || !exerciseList || exerciseList.length === 0) return;
    const newExercises = exerciseList.map((ex) => buildExerciseEntry(ex));
    setActiveWorkout((prev) =>
      prev ? { ...prev, exercises: [...prev.exercises, ...newExercises] } : prev
    );
    setShowAddExerciseInSession(false);
  };

  const replaceExerciseInActiveWorkout = (targetId, newExerciseData) => {
    if (!activeWorkout || !targetId || !newExerciseData) return;
    const replacement = buildExerciseEntry(newExerciseData, targetId);
    setActiveWorkout((prev) =>
      prev
        ? {
            ...prev,
            exercises: prev.exercises.map((ex) =>
              ex.id === targetId ? replacement : ex
            ),
          }
        : prev
    );
    setReplaceTargetExerciseId(null);
    setShowAddExerciseInSession(false);
  };

  const openRestTimeModal = (exerciseId, currentRestTime) => {
    setEditingRestExerciseId(exerciseId);
    setTempRestTime(String(currentRestTime || 60));
    setShowRestTimeModal(true);
  };

  const saveRestTime = () => {
    if (!activeWorkout || !editingRestExerciseId) return;

    const newRestTime = parseInt(tempRestTime || '60', 10) || 60;

    setActiveWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === editingRestExerciseId
            ? { ...ex, restTime: newRestTime }
            : ex
        ),
      };
    });

    setShowRestTimeModal(false);
    setEditingRestExerciseId(null);
    setTempRestTime('');
  };

  const updateTemplateSetDetail = (exerciseId, setIndex, field, value) => {
    if (!templateWorkout) return;

    setTemplateWorkout((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;

          return {
            ...ex,
            setDetails: (ex.setDetails || []).map((sd, idx) => {
              if (idx !== setIndex) return sd;

              let parsedValue = value;
              if (field === 'reps' || field === 'duration') {
                parsedValue = parseInt(value || '0', 10) || 0;
              }
              if (field === 'weight') {
                parsedValue = parseFloat(value || '0') || 0;
              }

              return { ...sd, [field]: parsedValue };
            }),
          };
        }),
      };
    });
  };

  const addSetToTemplateExercise = (exerciseId) => {
    if (!templateWorkout) return;

    setTemplateWorkout((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;

          const isTimeExercise =
            ex.type === 'time' || ex.type === 'plank' || ex.type === 'cardio';

          const newSet = {
            weight: isTimeExercise ? 0 : 0,
            reps: isTimeExercise ? 0 : 0,
            duration: isTimeExercise ? 0 : 0,
            completed: false,
          };

          return {
            ...ex,
            setDetails: [...(ex.setDetails || []), newSet],
          };
        }),
      };
    });
  };

  const deleteSetFromTemplateExercise = (exerciseId, setIndex) => {
    if (!templateWorkout) return;

    setTemplateWorkout((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            setDetails: (ex.setDetails || []).filter(
              (_, idx) => idx !== setIndex
            ),
          };
        }),
      };
    });
  };

  const deleteExerciseFromTemplate = (exerciseId) => {
    if (!templateWorkout) return;
    setTemplateWorkout((prev) =>
      prev
        ? {
            ...prev,
            exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
          }
        : prev
    );
  };

  const addExerciseToTemplate = () => {
    if (!templateWorkout || !templateSelectedExercise) {
      Alert.alert('Errore', 'Seleziona un esercizio');
      return;
    }
    const exType = templateSelectedExercise.type || 'weight_reps';
    const timed = exType === 'timed';
    const repsOnly = exType === 'reps';
    const exercise = {
      id: Date.now(),
      exerciseId: templateSelectedExercise.id,
      name: templateSelectedExercise.name,
      muscleGroup: templateSelectedExercise.muscleGroup,
      subcategory: templateSelectedExercise.subcategory,
      type: exType,
      sets: 1,
      reps: 0,
      weight: 0,
      duration: 0,
      restTime: settings.defaultRestTime || 60,
      setDetails: [{ weight: 0, reps: 0, duration: 0, completed: false }],
    };
    setTemplateWorkout((prev) =>
      prev ? { ...prev, exercises: [...prev.exercises, exercise] } : prev
    );
    setTemplateSelectedExercise(null);
    setTemplateSets('');
    setTemplateReps('');
    setTemplateWeight('');
    setTemplateRestTime('60');
    setTemplateDuration('');
    setShowAddExerciseInTemplate(false);
  };

  const addMultipleExercisesToTemplate = (exerciseList) => {
    if (!templateWorkout || !exerciseList || exerciseList.length === 0) return;
    const newExercises = exerciseList.map((ex) => {
      const exType = ex.type || 'weight_reps';
      const timed = exType === 'timed';
      return {
        id: Date.now() + Math.random(),
        exerciseId: ex.id,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        subcategory: ex.subcategory,
        type: exType,
        sets: 1,
        reps: 0,
        weight: 0,
        duration: 0,
        restTime: settings.defaultRestTime || 60,
        setDetails: [{ weight: 0, reps: 0, duration: 0, completed: false }],
      };
    });
    setTemplateWorkout((prev) =>
      prev ? { ...prev, exercises: [...prev.exercises, ...newExercises] } : prev
    );
    setShowAddExerciseInTemplate(false);
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;

    const normalizedExercises = activeWorkout.exercises.map((ex) => {
      const exType = ex.type || 'weight_reps';
      const timed = exType === 'timed';
      const repsOnly = exType === 'reps';
      const details = ex.setDetails || [];
      const first = details[0] || {};

      return {
        ...ex,
        sets: details.length,
        reps: timed ? 0 : first.reps || 0,
        weight: timed || repsOnly ? 0 : first.weight || 0,
        duration: timed ? first.duration || 0 : 0,
        setDetails: details,
      };
    });

    const workoutRecord = {
      id: Date.now(),
      workoutId: activeWorkout.id,
      name: activeWorkout.name,
      exercises: normalizedExercises,
      startTime: activeWorkout.startTime,
      endTime: new Date(),
      date: new Date().toISOString(),
      durationSeconds: workoutSeconds,
    };

    setHistory((prev) => [workoutRecord, ...prev]);

    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === activeWorkout.id ? { ...w, exercises: normalizedExercises } : w
      )
    );

    setActiveWorkout(null);
    setWorkoutSeconds(0);
    setTimer(0);
    setTimerActive(false);
    setFocusedMuscle(null);
    setCurrentScreen('home');

    Alert.alert('Completato!', 'Workout salvato nello storico');
  };

  const openHistoryDetail = (record) => {
    setSelectedHistoryRecord(record);
    setShowHistoryDetailModal(true);
  };

  const openEditHistory = (record) => {
    const clone = JSON.parse(JSON.stringify(record));
    setEditingHistoryRecord(clone);
    setShowEditHistoryModal(true);
  };

  const deleteHistoryRecord = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const updateHistorySetDetail = (exerciseId, setIndex, field, value) => {
    if (!editingHistoryRecord) return;

    setEditingHistoryRecord((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;

          return {
            ...ex,
            setDetails: ex.setDetails.map((sd, idx) => {
              if (idx !== setIndex) return sd;

              if (field === 'completed') {
                return { ...sd, completed: !sd.completed };
              }

              let parsedValue = value;
              if (field === 'reps' || field === 'duration') {
                parsedValue = parseInt(value || '0', 10) || 0;
              }
              if (field === 'weight') {
                parsedValue = parseFloat(value || '0') || 0;
              }

              return { ...sd, [field]: parsedValue };
            }),
          };
        }),
      };
    });
  };

  const updateHistoryGeneralNote = (recordId, noteText) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === recordId ? { ...item, generalNote: noteText } : item
      )
    );
    if (selectedHistoryRecord && selectedHistoryRecord.id === recordId) {
      setSelectedHistoryRecord((prev) => prev ? { ...prev, generalNote: noteText } : prev);
    }
  };

  const saveEditedHistory = () => {
    if (!editingHistoryRecord) return;
    setHistory((prev) =>
      prev.map((item) =>
        item.id === editingHistoryRecord.id ? editingHistoryRecord : item
      )
    );
    setShowEditHistoryModal(false);
    setEditingHistoryRecord(null);
  };

  const openProfileEdit = () => {
    setProfileName(profileName || user?.name || '');
    setProfileAge(profileAge || (user?.age ? String(user.age) : ''));
    setProfileHeight(profileHeight || (user?.height ? String(user.height) : ''));
    setProfileWeight(profileWeight || (user?.weight ? String(user.weight) : ''));
    setShowEditProfileModal(true);
  };

  const saveProfile = () => {
    const updatedUser = {
      ...(user || {}),
      email: user?.email || email,
      name: profileName.trim(),
      age: profileAge ? parseInt(profileAge, 10) : null,
      height: profileHeight ? parseInt(profileHeight, 10) : null,
      weight: profileWeight ? parseFloat(profileWeight) : null,
    };
    setUser(updatedUser);
    setShowEditProfileModal(false);
  };

  const groupExercisesByMuscle = () => {
    const grouped = {};
    exercises.forEach((ex) => {
      if (!grouped[ex.muscleGroup]) grouped[ex.muscleGroup] = [];
      grouped[ex.muscleGroup].push(ex);
    });
    return grouped;
  };

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={styles.header.backgroundColor} />
      {currentScreen === 'login' && (
        <LoginScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
        />
      )}
      {currentScreen === 'home' && (
        <HomeScreen
          workouts={workouts}
          formatDate={formatDate}
          handleLogout={handleLogout}
          startWorkout={startWorkout}
          deleteWorkout={deleteWorkout}
          setSelectedWorkout={setSelectedWorkout}
          setShowViewWorkout={setShowViewWorkout}
          openTemplateEditor={openTemplateEditor}
          createWorkout={createWorkout}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          activeWorkout={activeWorkout}
        />
      )}
      {currentScreen === 'activeWorkout' && (
        <ActiveWorkoutScreen
          activeWorkout={activeWorkout}
          setActiveWorkout={setActiveWorkout}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          workoutSeconds={workoutSeconds}
          setWorkoutSeconds={setWorkoutSeconds}
          formatWorkoutTime={formatWorkoutTime}
          setSessionSelectedExercise={setSessionSelectedExercise}
          setSessionSets={setSessionSets}
          setSessionReps={setSessionReps}
          setSessionWeight={setSessionWeight}
          setSessionRestTime={setSessionRestTime}
          setSessionDuration={setSessionDuration}
          setShowAddExerciseInSession={setShowAddExerciseInSession}
          timerActive={timerActive}
          setTimerActive={setTimerActive}
          timer={timer}
          setTimer={setTimer}
          adjustTimer={adjustTimer}
          skipTimer={skipTimer}
          deleteExerciseFromActiveWorkout={deleteExerciseFromActiveWorkout}
          openRestTimeModal={openRestTimeModal}
          deleteSetFromExercise={deleteSetFromExercise}
          updateSetDetail={updateSetDetail}
          toggleSetComplete={toggleSetComplete}
          addSetToExercise={addSetToExercise}
          finishWorkout={finishWorkout}
          setCurrentScreen={setCurrentScreen}
          openExerciseDescription={openExerciseDescription}
          setReplaceTargetExerciseId={setReplaceTargetExerciseId}
        />
      )}
      {currentScreen === 'editTemplate' && (
        <EditTemplateScreen
          templateWorkout={templateWorkout}
          setTemplateWorkout={setTemplateWorkout}
          setCurrentScreen={setCurrentScreen}
          saveTemplateWorkout={saveTemplateWorkout}
          setTemplateSelectedExercise={setTemplateSelectedExercise}
          setTemplateSets={setTemplateSets}
          setTemplateReps={setTemplateReps}
          setTemplateWeight={setTemplateWeight}
          setTemplateRestTime={setTemplateRestTime}
          setTemplateDuration={setTemplateDuration}
          setShowAddExerciseInTemplate={setShowAddExerciseInTemplate}
          deleteExerciseFromTemplate={deleteExerciseFromTemplate}
          deleteSetFromTemplateExercise={deleteSetFromTemplateExercise}
          updateTemplateSetDetail={updateTemplateSetDetail}
          addSetToTemplateExercise={addSetToTemplateExercise}
          openExerciseDescription={openExerciseDescription}
        />
      )}
      {currentScreen === 'history' && (
        <HistoryScreen
          history={history}
          openEditHistory={openEditHistory}
          deleteHistoryRecord={deleteHistoryRecord}
          openHistoryDetail={openHistoryDetail}
          formatWorkoutTime={formatWorkoutTime}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
      )}
      {currentScreen === 'exercises' && (
        <ExercisesScreen
          groupExercisesByMuscle={groupExercisesByMuscle}
          setShowCustomExercise={setShowCustomExercise}
          deleteCustomExercise={deleteCustomExercise}
          formatDate={formatDate}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          openExerciseDescription={openExerciseDescription}
          exercises={exercises}
        />
      )}
      {currentScreen === 'profile' && (
        <ProfileScreen
          user={user}
          profileName={profileName}
          profileAge={profileAge}
          profileHeight={profileHeight}
          profileWeight={profileWeight}
          openProfileEdit={openProfileEdit}
          history={history}
          workouts={workouts}
          getTotalHours={getTotalHours}
          getCompletedSets={getCompletedSets}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
      )}

      <CreateWorkoutModal
        showCreateWorkout={showCreateWorkout}
        setShowCreateWorkout={setShowCreateWorkout}
        workoutName={workoutName}
        setWorkoutName={setWorkoutName}
        createWorkout={createWorkout}
      />
      <ViewWorkoutModal
        showViewWorkout={showViewWorkout}
        setShowViewWorkout={setShowViewWorkout}
        selectedWorkout={selectedWorkout}
      />
      <CustomExerciseModal
        showCustomExercise={showCustomExercise}
        setShowCustomExercise={setShowCustomExercise}
        customExerciseName={customExerciseName}
        setCustomExerciseName={setCustomExerciseName}
        customMuscleGroup={customMuscleGroup}
        setCustomMuscleGroup={setCustomMuscleGroup}
        customExerciseType={customExerciseType}
        setCustomExerciseType={setCustomExerciseType}
        customExerciseDescription={customExerciseDescription}
        setCustomExerciseDescription={setCustomExerciseDescription}
        exercises={exercises}
        createCustomExercise={createCustomExercise}
      />
      <RestTimeModal
        showRestTimeModal={showRestTimeModal}
        setShowRestTimeModal={setShowRestTimeModal}
        tempRestTime={tempRestTime}
        setTempRestTime={setTempRestTime}
        setEditingRestExerciseId={setEditingRestExerciseId}
        saveRestTime={saveRestTime}
      />
      <EditProfileModal
        showEditProfileModal={showEditProfileModal}
        setShowEditProfileModal={setShowEditProfileModal}
        profileName={profileName}
        setProfileName={setProfileName}
        profileAge={profileAge}
        setProfileAge={setProfileAge}
        profileHeight={profileHeight}
        setProfileHeight={setProfileHeight}
        profileWeight={profileWeight}
        setProfileWeight={setProfileWeight}
        saveProfile={saveProfile}
      />
      <HistoryDetailModal
        showHistoryDetailModal={showHistoryDetailModal}
        setShowHistoryDetailModal={setShowHistoryDetailModal}
        selectedHistoryRecord={selectedHistoryRecord}
        formatWorkoutTime={formatWorkoutTime}
        updateHistoryGeneralNote={updateHistoryGeneralNote}
      />
      <EditHistoryModal
        showEditHistoryModal={showEditHistoryModal}
        setShowEditHistoryModal={setShowEditHistoryModal}
        editingHistoryRecord={editingHistoryRecord}
        setEditingHistoryRecord={setEditingHistoryRecord}
        updateHistorySetDetail={updateHistorySetDetail}
        saveEditedHistory={saveEditedHistory}
        formatWorkoutTime={formatWorkoutTime}
      />
      <AddExerciseInSessionModal
        showAddExerciseInSession={showAddExerciseInSession}
        setShowAddExerciseInSession={setShowAddExerciseInSession}
        groupExercisesByMuscle={groupExercisesByMuscle}
        sessionSelectedExercise={sessionSelectedExercise}
        setSessionSelectedExercise={setSessionSelectedExercise}
        sessionSets={sessionSets}
        setSessionSets={setSessionSets}
        sessionReps={sessionReps}
        setSessionReps={setSessionReps}
        sessionWeight={sessionWeight}
        setSessionWeight={setSessionWeight}
        sessionRestTime={sessionRestTime}
        setSessionRestTime={setSessionRestTime}
        sessionDuration={sessionDuration}
        setSessionDuration={setSessionDuration}
        addExerciseToActiveWorkout={addExerciseToActiveWorkout}
        addMultipleExercisesToActiveWorkout={addMultipleExercisesToActiveWorkout}
        replaceExerciseInActiveWorkout={replaceExerciseInActiveWorkout}
        replaceTargetExerciseId={replaceTargetExerciseId}
        setReplaceTargetExerciseId={setReplaceTargetExerciseId}
        openExerciseDescription={openExerciseDescription}
        exercises={exercises}
      />
      <AddExerciseInTemplateModal
        showAddExerciseInTemplate={showAddExerciseInTemplate}
        setShowAddExerciseInTemplate={setShowAddExerciseInTemplate}
        groupExercisesByMuscle={groupExercisesByMuscle}
        templateSelectedExercise={templateSelectedExercise}
        setTemplateSelectedExercise={setTemplateSelectedExercise}
        setTemplateSets={setTemplateSets}
        setTemplateReps={setTemplateReps}
        setTemplateWeight={setTemplateWeight}
        setTemplateRestTime={setTemplateRestTime}
        setTemplateDuration={setTemplateDuration}
        addExerciseToTemplate={addExerciseToTemplate}
        addMultipleExercisesToTemplate={addMultipleExercisesToTemplate}
        openExerciseDescription={openExerciseDescription}
        exercises={exercises}
      />

      <ExerciseDescriptionModal
        visible={showDescriptionModal}
        exercise={selectedDescriptionExercise}
        onClose={() => {
          setShowDescriptionModal(false);
          setSelectedDescriptionExercise(null);
        }}
      />

      {/* Floating Active Workout Bar */}
      {activeWorkout && currentScreen !== 'activeWorkout' && currentScreen !== 'login' && currentScreen !== 'editTemplate' && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            position: 'absolute',
            bottom: 110,
            left: 12,
            right: 12,
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: '#86B749',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 8,
          }}
          onPress={() => setCurrentScreen('activeWorkout')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#86B749',
            }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#86B749', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Allenamento Attivo
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '600', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                {activeWorkout.name}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#86B749', fontFamily: 'monospace' }}>
              {formatWorkoutTime(workoutSeconds)}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#86B749" />
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <MainApp />
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}