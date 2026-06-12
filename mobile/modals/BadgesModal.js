import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffectiveDark } from '../context/SettingsContext';
import { getStyles } from '../styles/styles';
import { getBadgeDefinition } from '../utils/progress';

export default function BadgesModal({ visible, onClose, badges = [] }) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);

  const colors = {
    text: isDarkMode ? '#f8fafc' : '#0f172a',
    muted: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#334155' : '#e2e8f0',
    card: isDarkMode ? '#1e293b' : '#ffffff',
    soft: isDarkMode ? '#0f172a' : '#f8fafc',
  };


  const sortedBadges = [...badges].sort(
    (a, b) => new Date(b.earnedAt || 0) - new Date(a.earnedAt || 0)
  );

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderBadge = (badge, locked = false) => {
    const definition = getBadgeDefinition(badge.definitionId || badge.id) || badge;
    const iconName = definition.icon || 'trophy';
    return (
      <View
        key={badge.id}
        style={[
          localStyles.badgeCard,
          {
            backgroundColor: colors.card,
            borderColor: locked ? colors.border : '#86B749',
            opacity: locked ? 0.62 : 1,
          },
        ]}
      >
        <View
          style={[
            localStyles.iconWrap,
            { backgroundColor: locked ? colors.soft : '#f0fdf4' },
          ]}
        >
          <Ionicons
            name={locked ? 'lock-closed' : iconName}
            size={20}
            color={locked ? colors.muted : '#15803d'}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[localStyles.badgeName, { color: colors.text }]}>
            {definition.name || badge.name}
          </Text>
          <Text style={[localStyles.badgeDescription, { color: colors.muted }]}>
            {definition.description || badge.description}
          </Text>
          {!locked && (
            <Text style={[localStyles.badgeMeta, { color: '#15803d' }]}>
              {formatDate(badge.earnedAt)}
              {badge.exerciseName ? ` • ${badge.exerciseName}` : ''}
              {badge.value !== undefined && badge.value !== null ? (
                ` • ${
                  badge.definitionId === 'PR_WEIGHT'
                    ? `${badge.value} kg`
                    : badge.definitionId === 'PR_REPS'
                    ? `${badge.value} rep`
                    : badge.definitionId === 'PR_VOLUME'
                    ? `${badge.value} kg (Volume)`
                    : badge.value
                }`
              ) : ''}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <View style={localStyles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>Badge e obiettivi</Text>
              <Text style={[localStyles.subtitle, { color: colors.muted }]}>
                {badges.length} ottenuti
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={localStyles.closeButton}>
              <Ionicons name="close" size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.exerciseList} contentContainerStyle={{ paddingBottom: 8 }}>
            <Text style={[localStyles.sectionTitle, { color: colors.text }]}>
              Ottenuti
            </Text>
            {sortedBadges.length === 0 ? (
              <View style={[localStyles.emptyBox, { borderColor: colors.border }]}>
                <Ionicons name="trophy-outline" size={22} color={colors.muted} />
                <Text style={[localStyles.emptyText, { color: colors.muted }]}>
                  Completa un workout e supera un tuo record per ottenere il primo badge.
                </Text>
              </View>
            ) : (
              sortedBadges.map((badge) => renderBadge(badge))
            )}


          </ScrollView>

          <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
            <Text style={styles.primaryButtonText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: -6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  badgeCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '800',
  },
  badgeDescription: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  badgeMeta: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },
  emptyBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
