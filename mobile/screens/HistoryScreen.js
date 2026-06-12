import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, Image, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { Swipeable } from 'react-native-gesture-handler';
import { logoCompact } from '../constants';
import { getStyles } from '../styles/styles';
import BottomNav from '../components/BottomNav';
import HelpButton from '../components/HelpModal';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HistoryScreen({
  history,
  openEditHistory,
  deleteHistoryRecord,
  openHistoryDetail,
  formatWorkoutTime,
  currentScreen,
  setCurrentScreen,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredHistory = useMemo(() => {
    return history.filter((record) => {
      // 1. Search filter (workout name or exercise name)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = record.name.toLowerCase().includes(query);
        const matchesExercise = record.exercises && record.exercises.some(ex => ex.name.toLowerCase().includes(query));
        if (!matchesName && !matchesExercise) return false;
      }

      // 2. Date filter (exact day match)
      if (selectedDate) {
        const recordDate = new Date(record.date);
        const isSameDay =
          recordDate.getDate() === selectedDate.getDate() &&
          recordDate.getMonth() === selectedDate.getMonth() &&
          recordDate.getFullYear() === selectedDate.getFullYear();
        if (!isSameDay) return false;
      }

      return true;
    });
  }, [history, searchQuery, selectedDate]);

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
  };

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

      {/* Barra di ricerca e bottone data native */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, gap: 10, backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#334155' : '#e2e8f0' }}>
        <TextInput
          style={{
            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
            borderWidth: 1,
            borderColor: isDarkMode ? '#334155' : '#cbd5e1',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
            fontSize: 14,
            color: isDarkMode ? '#f8fafc' : '#0f172a',
          }}
          placeholder="Cerca per nome scheda o esercizio..."
          placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#86B749',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 8,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
              {selectedDate
                ? `Filtro: ${selectedDate.toLocaleDateString('it-IT')}`
                : 'Filtra per Data (Seleziona)'}
            </Text>
          </TouchableOpacity>

          {selectedDate && (
            <TouchableOpacity
              style={{
                backgroundColor: '#fee2e2',
                borderWidth: 1,
                borderColor: '#ef4444',
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setSelectedDate(null)}
            >
              <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '700' }}>Reset Data</Text>
            </TouchableOpacity>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <ScrollView style={styles.content}>
        {filteredHistory.length === 0 ? (
          <Text style={styles.emptyText}>Nessun workout trovato con questi filtri</Text>
        ) : (
          filteredHistory.map((record) => (
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
