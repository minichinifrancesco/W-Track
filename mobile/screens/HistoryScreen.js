import React from 'react';
import { SafeAreaView, View, Image, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { logoCompact } from '../constants';
import { getStyles } from '../styles/styles';
import BottomNav from '../components/BottomNav';
import HelpButton from '../components/HelpModal';

export default function HistoryScreen({
  history,
  openEditHistory,
  deleteHistoryRecord,
  openHistoryDetail,
  formatWorkoutTime,
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
            <Text style={styles.headerTitle}>Storico sessioni</Text>
            <Text style={styles.headerSubtitle}>I tuoi allenamenti salvati</Text>
          </View>
        </View>
        <HelpButton screen="history" />
      </View>

      <ScrollView style={styles.content}>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>Nessun workout completato</Text>
        ) : (
          history.map((record) => (
            <Swipeable
              key={record.id}
              renderLeftActions={() => (
                <TouchableOpacity
                  style={styles.editSwipeButton}
                  onPress={() => openEditHistory(record)}>
                  <Text style={styles.editSwipeText}>Modifica</Text>
                </TouchableOpacity>
              )}
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteSetSwipeButton}
                  onPress={() => deleteHistoryRecord(record.id)}>
                  <Text style={styles.deleteSetSwipeText}>Elimina</Text>
                </TouchableOpacity>
              )}>
              <TouchableOpacity onPress={() => openHistoryDetail(record)}>
                <View style={styles.historyCard}>
                  <Text style={styles.historyName}>{record.name}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(record.date).toLocaleDateString('it-IT')}
                  </Text>
                  <Text style={styles.historyExercises}>
                    {record.exercises.length} esercizi
                  </Text>
                  <Text style={styles.historyDuration}>
                    Durata: {formatWorkoutTime(record.durationSeconds || 0)}
                  </Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))
        )}
      </ScrollView>

      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </SafeAreaView>
  );
}
