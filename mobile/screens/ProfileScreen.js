import React from 'react';
import { SafeAreaView, View, Image, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { logoCompact } from '../constants';
import { getStyles } from '../styles/styles';
import BottomNav from '../components/BottomNav';
import HelpButton from '../components/HelpModal';

export default function ProfileScreen({
  user,
  profileName,
  profileAge,
  profileHeight,
  profileWeight,
  openProfileEdit,
  history,
  workouts,
  getTotalHours,
  getCompletedSets,
  currentScreen,
  setCurrentScreen,
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logoCompact} style={styles.logoSmall} />
          <View>
            <Text style={styles.headerTitle}>Profilo</Text>
            <Text style={styles.headerSubtitle}>{user?.email || 'Utente'}</Text>
          </View>
        </View>
        <HelpButton screen="profile" />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {(profileName || user?.email || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>
                {profileName || 'Nome non impostato'}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>

            <TouchableOpacity
              style={styles.profileEditButton}
              onPress={openProfileEdit}>
              <Text style={styles.profileEditButtonText}>Modifica</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfoRow}>
            <View style={styles.profileInfoItem}>
              <Text style={styles.profileInfoLabel}>Età</Text>
              <Text style={styles.profileInfoValue}>{profileAge || '-'}</Text>
            </View>

            <View style={styles.profileInfoItem}>
              <Text style={styles.profileInfoLabel}>Altezza</Text>
              <Text style={styles.profileInfoValue}>
                {profileHeight ? `${profileHeight} cm` : '-'}
              </Text>
            </View>

            <View style={styles.profileInfoItem}>
              <Text style={styles.profileInfoLabel}>Peso</Text>
              <Text style={styles.profileInfoValue}>
                {profileWeight ? `${profileWeight} kg` : '-'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.sectionTitle}>Statistiche generali</Text>

          <View style={styles.profileStatsRow}>
            <View style={styles.profileStatBox}>
              <Text style={styles.profileStatLabel}>Sessioni totali</Text>
              <Text style={styles.profileStatValue}>{history.length}</Text>
            </View>

            <View style={styles.profileStatBox}>
              <Text style={styles.profileStatLabel}>Ore totali</Text>
              <Text style={styles.profileStatValue}>{getTotalHours()}h</Text>
            </View>
          </View>

          <View style={styles.profileStatsRow}>
            <View style={styles.profileStatBox}>
              <Text style={styles.profileStatLabel}>Serie completate</Text>
              <Text style={styles.profileStatValue}>{getCompletedSets()}</Text>
            </View>

            <View style={styles.profileStatBox}>
              <Text style={styles.profileStatLabel}>Schede create</Text>
              <Text style={styles.profileStatValue}>{workouts.length}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </SafeAreaView>
  );
}
