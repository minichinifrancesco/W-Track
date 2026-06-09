import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles';

export default function MuscleMan({ activeMuscleGroup }) {
  return (
    <View style={styles.muscleManWrapper}>
      <Text style={styles.muscleManLabel}>
        {activeMuscleGroup
          ? `Gruppo attivo: ${activeMuscleGroup}`
          : 'Tocca un esercizio per evidenziare il gruppo muscolare'}
      </Text>
      <View style={styles.musclePlaceholder}>
        <Text style={styles.musclePlaceholderText}>💪</Text>
      </View>
    </View>
  );
}
