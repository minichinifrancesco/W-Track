import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Alert, useColorScheme, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getStyles } from './styles/styles';

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
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
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
      Alert.alert('Timer terminato', 'Tempo concluso!');
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, isPaused]);

  useEffect(() => {
    let interval;
    if (currentScreen === 'activeWorkout' && !isPaused) {
      interval = setInterval(() => setWorkoutSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [currentScreen, isPaused]);

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
    if (!workoutName.trim()) {
      Alert.alert('Errore', 'Inserisci un nome per la scheda');
      return;
    }

    const newWorkout = {
      id: Date.now(),
      name: workoutName.trim(),
      exercises: [],
      createdAt: new Date().toISOString(),
    };

    setWorkouts((prev) => [...prev, newWorkout]);
    setWorkoutName('');
    setShowCreateWorkout(false);
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
    if (!customExerciseName.trim() || !customMuscleGroup.trim()) {
      Alert.alert(
        'Errore',
        'Compila nome esercizio e scegli il gruppo muscolare'
      );
      return;
    }

    const newExercise = {
      id: Date.now(),
      name: customExerciseName.trim(),
      muscleGroup: customMuscleGroup,
      type: customExerciseType || 'weight_reps',
      custom: true,
    };

    setExercises((prev) => [...prev, newExercise]);
    setCustomExerciseName('');
    setCustomMuscleGroup('');
    setCustomExerciseType('weight_reps');
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

      return { ...ex, setDetails };
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

      return { ...ex, setDetails: existingSetDetails };
    });

    setTemplateWorkout({
      ...workout,
      exercises: normalizedExercises,
    });
    setCurrentScreen('editTemplate');
  };

  const saveTemplateWorkout = () => {
    if (!templateWorkout) return;

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

    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === templateWorkout.id
          ? { ...templateWorkout, exercises: normalizedExercises }
          : w
      )
    );

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

    const exType = targetExercise.type || 'weight_reps';
    // For timed exercises: convert minutes to seconds for rest timer
    if (exType === 'timed' && targetSet.completed && targetSet.duration > 0) {
      startRestTimer(Math.round(parseFloat(targetSet.duration) * 60));
      return;
    }
    // For weight/reps exercises: start rest timer
    if (exType !== 'timed' && targetSet.completed) {
      startRestTimer(targetExercise.restTime || 60);
    }
  };

  const updateSetDetail = (exerciseId, setIndex, field, value) => {
    if (!activeWorkout) return;

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

              let parsedValue = value;
              if (field === 'reps') {
                parsedValue = parseInt(value || '0', 10) || 0;
              }
              if (field === 'duration' || field === 'weight') {
                parsedValue = parseFloat(value || '0') || 0;
              }

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

  const addExerciseToActiveWorkout = () => {
    if (!activeWorkout) return;
    if (!sessionSelectedExercise) {
      Alert.alert('Errore', 'Seleziona un esercizio');
      return;
    }

    const exType = sessionSelectedExercise.type || 'weight_reps';
    const timed = exType === 'timed';
    const repsOnly = exType === 'reps';

    const baseSets = parseInt(sessionSets || '1', 10) || 1;
    const baseDuration = timed ? (parseFloat(sessionDuration || '0') || 0) : 0;
    const baseReps = timed ? 0 : (parseInt(sessionReps || '0', 10) || 0);
    const baseWeight = (timed || repsOnly) ? 0 : (parseFloat(sessionWeight || '0') || 0);
    const baseRest = timed ? 0 : (parseInt(sessionRestTime || '60', 10) || 60);

    const newEx = {
      id: Date.now(),
      exerciseId: sessionSelectedExercise.id,
      name: sessionSelectedExercise.name,
      muscleGroup: sessionSelectedExercise.muscleGroup,
      type: exType,
      sets: baseSets,
      reps: baseReps,
      weight: baseWeight,
      duration: baseDuration,
      restTime: baseRest,
      setDetails: [],
    };

    for (let i = 0; i < baseSets; i++) {
      newEx.setDetails.push({
        weight: newEx.weight,
        reps: newEx.reps,
        duration: newEx.duration,
        completed: false,
      });
    }

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
      type: exType,
      sets: 1,
      reps: timed ? 0 : 0,
      weight: timed || repsOnly ? 0 : 0,
      duration: timed ? 0 : 0,
      restTime: timed ? 0 : 60,
      setDetails: [
        { weight: 0, reps: 0, duration: 0, completed: false },
      ],
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
          setShowCreateWorkout={setShowCreateWorkout}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
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
      />
      <EditHistoryModal
        showEditHistoryModal={showEditHistoryModal}
        setShowEditHistoryModal={setShowEditHistoryModal}
        editingHistoryRecord={editingHistoryRecord}
        setEditingHistoryRecord={setEditingHistoryRecord}
        updateHistorySetDetail={updateHistorySetDetail}
        saveEditedHistory={saveEditedHistory}
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
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainApp />
    </GestureHandlerRootView>
  );
}