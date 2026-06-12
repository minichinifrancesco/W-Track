import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { useEffectiveDark } from '../context/SettingsContext';
import ExerciseProgressChart from './ExerciseProgressChart';

export default function ExerciseDescriptionModal({
  visible,
  onClose,
  exercise,
  history = [],
}) {
  const isDark = useEffectiveDark();
  const [showTutorial, setShowTutorial] = useState(false);

  if (!exercise) return null;

  const containerBg = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textDark = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#475569';
  const headerText = isDark ? '#cbd5e1' : '#334155';
  const badgeBg = isDark ? '#334155' : '#f1f5f9';
  const badgeText = isDark ? '#94a3b8' : '#475569';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
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
      transparent={false}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>
        {/* Navigation Bar */}
        <View style={[styles.navBar, { borderBottomColor: borderColor }]}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onClose}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color={textDark} />
          </TouchableOpacity>
          
          <Text style={[styles.navTitle, { color: textDark }]} numberOfLines={1}>
            Dettagli Esercizio
          </Text>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setShowTutorial(true)}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="help-circle-outline" size={26} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
        >
          {/* Exercise Meta Information */}
          <View style={[styles.metaCard, { backgroundColor: cardBg, borderColor: borderColor }]}>
            <Text style={[styles.title, { color: textDark }]}>{exercise.name}</Text>
            <Text style={[styles.category, { color: categoryColor }]}>
              {exercise.muscleGroup}{exercise.subcategory ? ` • ${exercise.subcategory}` : ''}
            </Text>

            {/* Badges row */}
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                <Text style={[styles.badgeText, { color: badgeText }]}>{getTypeText(exercise.type)}</Text>
              </View>
              {isCustom && (
                <View style={[styles.badge, { backgroundColor: COLORS.primary + '20' }]}>
                  <Text style={[styles.badgeText, { color: COLORS.primaryDark, fontWeight: '700' }]}>✦ Custom</Text>
                </View>
              )}
            </View>
          </View>

          {/* Description Section */}
          <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderColor }]}>
            <Text style={[styles.sectionHeader, { color: headerText }]}>
              {isCustom ? '📝 Note / Istruzioni:' : 'Istruzioni per l\'esecuzione:'}
            </Text>
            <Text style={[styles.descriptionText, { color: textMuted }]}>
              {hasDescription
                ? exercise.description
                : isCustom
                ? 'Nessuna descrizione aggiunta per questo esercizio personalizzato. Puoi aggiungere note di esecuzione quando crei o modifichi esercizi custom.'
                : 'Nessuna descrizione disponibile per questo esercizio.'}
            </Text>
          </View>

          {/* Progress Section / Chart */}
          <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderColor, paddingBottom: 16 }]}>
            <Text style={[styles.sectionHeader, { color: headerText, marginBottom: 16 }]}>
              📈 Statistiche & Progresso
            </Text>
            <ExerciseProgressChart exercise={exercise} history={history} />
          </View>
        </ScrollView>

        {/* Tutorial sub-modal */}
        <Modal
          visible={showTutorial}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTutorial(false)}
        >
          <View style={styles.tutOverlay}>
            <View style={[styles.tutCard, { backgroundColor: cardBg }]}>
              <View style={styles.tutHeader}>
                <Ionicons name="information-circle" size={24} color={COLORS.primary} />
                <Text style={[styles.tutTitle, { color: textDark }]}>Guida alle Statistiche</Text>
              </View>
              <ScrollView style={{ maxHeight: 300, marginVertical: 12 }} showsVerticalScrollIndicator={true}>
                <Text style={[styles.tutIntro, { color: textMuted }]}>
                  Questa schermata raccoglie i tuoi progressi per l'esercizio selezionato. Ecco cosa significano le metriche:
                </Text>
                
                <Text style={[styles.tutSubtitle, { color: textDark }]}>📈 Grafico di Progresso</Text>
                <Text style={[styles.tutText, { color: textMuted }]}>
                  Mostra l'andamento delle tue prestazioni nel tempo. Per gli esercizi con pesi, traccia il peso massimo; per gli esercizi a tempo, la durata massima; per quelli a corpo libero, le ripetizioni.
                </Text>

                <Text style={[styles.tutSubtitle, { color: textDark }]}>🏋️‍♂️ Volume Totale</Text>
                <Text style={[styles.tutText, { color: textMuted }]}>
                  È il carico totale sollevato (peso × rep × serie). Monitorare il volume ti aiuta ad applicare un sovraccarico progressivo nel tempo.
                </Text>

                <Text style={[styles.tutSubtitle, { color: textDark }]}>🎯 1RM (Massimale Stimato)</Text>
                <Text style={[styles.tutText, { color: textMuted }]}>
                  Una stima teorica del peso massimo che saresti in grado di sollevare per una singola ripetizione, calcolato in base alle tue serie migliori.
                </Text>
              </ScrollView>
              <TouchableOpacity style={styles.tutActionBtn} onPress={() => setShowTutorial(false)}>
                <Text style={styles.tutActionBtnText}>Ho capito</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  navButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  metaCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  sectionCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  tutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tutCard: {
    width: '100%',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  tutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#33415530',
    paddingBottom: 10,
  },
  tutTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  tutIntro: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  tutSubtitle: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 4,
  },
  tutText: {
    fontSize: 12,
    lineHeight: 18,
  },
  tutActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  tutActionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
