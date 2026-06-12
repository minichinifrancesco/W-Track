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
import { useEffectiveDark } from '../context/SettingsContext';

export default function ExerciseDescriptionModal({
  visible,
  onClose,
  exercise,
}) {
  const isDark = useEffectiveDark();

  if (!exercise) return null;

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textDark = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#475569';
  const headerText = isDark ? '#cbd5e1' : '#334155';
  const badgeBg = isDark ? '#334155' : '#f1f5f9';
  const badgeText = isDark ? '#94a3b8' : '#475569';
  const backdropColor = isDark ? 'rgba(0,0,0,0.65)' : 'rgba(15, 23, 42, 0.45)';
  const categoryColor = isDark ? '#4ade80' : COLORS.primaryDark;

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

  const hasDescription = exercise.description && exercise.description.trim().length > 0;
  const isCustom = exercise.custom === true;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: backdropColor }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.cardWrapper, { backgroundColor: cardBg }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: textDark }]}>{exercise.name}</Text>
              <Text style={[styles.category, { color: categoryColor }]}>
                {exercise.muscleGroup}{exercise.subcategory ? ` • ${exercise.subcategory}` : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.closeBtn, { color: textMuted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Badges row */}
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.badgeText, { color: badgeText }]}>{getTypeText(exercise.type)}</Text>
            </View>
            {isCustom && (
              <View style={[styles.badge, { backgroundColor: COLORS.primary + '20', marginLeft: 6 }]}>
                <Text style={[styles.badgeText, { color: COLORS.primaryDark, fontWeight: '700' }]}>✦ Custom</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {hasDescription ? (
              <>
                <Text style={[styles.descriptionHeader, { color: headerText }]}>
                  {isCustom ? '📝 Note / Istruzioni:' : 'Istruzioni per l\'esecuzione:'}
                </Text>
                <Text style={[styles.descriptionText, { color: textMuted }]}>
                  {exercise.description}
                </Text>
              </>
            ) : (
              <>
                <Text style={[styles.descriptionHeader, { color: headerText }]}>
                  Istruzioni per l'esecuzione:
                </Text>
                <Text style={[styles.descriptionText, { color: textMuted }]}>
                  {isCustom
                    ? 'Nessuna descrizione aggiunta per questo esercizio personalizzato.\n\nPuoi aggiungere note di esecuzione quando crei nuovi esercizi custom.'
                    : 'Nessuna descrizione disponibile per questo esercizio.'}
                </Text>
              </>
            )}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardWrapper: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
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
    marginRight: 12,
  },
  category: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeBtn: {
    fontSize: 18,
    fontWeight: '700',
    padding: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
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
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
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
