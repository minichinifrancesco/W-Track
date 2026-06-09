import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants';

export default function ExerciseDescriptionModal({
  visible,
  onClose,
  exercise,
}) {
  if (!exercise) return null;

  const getTypeText = (type) => {
    switch (type) {
      case 'timed':
        return '⏱ A Tempo (Minuti)';
      case 'reps':
        return '🔁 Solo Ripetizioni';
      case 'weight_reps':
      default:
        return '🏋️‍♂️ Peso + Ripetizioni';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        />
        {/* Outer wrapper constrains the max height in the scene */}
        <View style={styles.cardWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{exercise.name}</Text>
              <Text style={styles.category}>
                {exercise.muscleGroup}{exercise.subcategory ? ` • ${exercise.subcategory}` : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Type Badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getTypeText(exercise.type)}</Text>
            </View>
          </View>

          {/* Description — uses flexShrink:1 so it expands to fill available space */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.descriptionHeader}>Istruzioni per l'esecuzione:</Text>
            <Text style={styles.descriptionText}>
              {exercise.description || 'Nessuna descrizione disponibile per questo esercizio.'}
            </Text>
          </ScrollView>

          {/* Action Button */}
          <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
            <Text style={styles.actionBtnText}>Ho capito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  // cardWrapper has a max height limit and uses flex column so children can flex properly
  cardWrapper: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    // flex column so children can use flex
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginRight: 12,
  },
  category: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeBtn: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: '700',
    padding: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  // flexShrink:1 allows ScrollView to shrink if content is short, grow if long
  scrollArea: {
    flexShrink: 1,
    minHeight: 60,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  descriptionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
