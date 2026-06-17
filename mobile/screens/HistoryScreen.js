import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { Swipeable } from 'react-native-gesture-handler';
import { logoCompact } from '../constants';
import { getStyles } from '../styles/styles';
import BottomNav from '../components/BottomNav';
import HelpButton from '../components/HelpModal';

const DATE_PICKER_MIN_DATE = new Date(2000, 0, 1);
const DATE_PICKER_MAX_DATE = new Date(2100, 11, 31);
const WEEKDAY_LABELS = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
const MONTH_LABELS = [
  'Gen',
  'Feb',
  'Mar',
  'Apr',
  'Mag',
  'Giu',
  'Lug',
  'Ago',
  'Set',
  'Ott',
  'Nov',
  'Dic',
];
const YEAR_PAGE_SIZE = 12;

const isValidDate = (value) =>
  value instanceof Date && !Number.isNaN(value.getTime());

const parseDateValue = (value) => {
  if (value instanceof Date) return isValidDate(value) ? value : null;
  if (!value) return null;

  const dateOnlyMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const date = new Date(value);
  return isValidDate(date) ? date : null;
};

const toLocalDateKey = (value) => {
  const date = parseDateValue(value);
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizePickerDate = (value) => {
  const date = parseDateValue(value);
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const formatDateLabel = (value) => {
  const date = parseDateValue(value);
  return date ? date.toLocaleDateString('it-IT') : '-';
};

const startOfMonth = (value) => {
  const date = normalizePickerDate(value) || normalizePickerDate(new Date());
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const addMonths = (value, amount) => {
  const date = startOfMonth(value);
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
};

const buildCalendarDays = (monthDate) => {
  const monthStart = startOfMonth(monthDate);
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

const isSameLocalDay = (left, right) =>
  toLocalDateKey(left) !== '' && toLocalDateKey(left) === toLocalDateKey(right);

const isDateInPickerRange = (value) => {
  const date = normalizePickerDate(value);
  return (
    date &&
    date >= normalizePickerDate(DATE_PICKER_MIN_DATE) &&
    date <= normalizePickerDate(DATE_PICKER_MAX_DATE)
  );
};

const getYearPageStart = (year) => {
  const minYear = DATE_PICKER_MIN_DATE.getFullYear();
  const maxYear = DATE_PICKER_MAX_DATE.getFullYear();
  const clampedYear = Math.max(minYear, Math.min(year, maxYear));
  const pageOffset = Math.floor((clampedYear - minYear) / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE;
  const maxPageStart = maxYear - YEAR_PAGE_SIZE + 1;
  return Math.min(minYear + pageOffset, maxPageStart);
};

const buildYearOptions = (pageStart) => {
  const maxYear = DATE_PICKER_MAX_DATE.getFullYear();
  return Array.from({ length: YEAR_PAGE_SIZE }, (_, index) => pageStart + index).filter(
    (year) => year <= maxYear
  );
};

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
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [calendarMode, setCalendarMode] = useState('days');
  const [yearPageStart, setYearPageStart] = useState(() =>
    getYearPageStart(new Date().getFullYear())
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredHistory = useMemo(() => {
    const selectedDateKey = toLocalDateKey(selectedDate);

    return history.filter((record) => {
      // 1. Search filter (workout name or exercise name)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = record.name.toLowerCase().includes(query);
        const matchesExercise = record.exercises && record.exercises.some(ex => ex.name.toLowerCase().includes(query));
        if (!matchesName && !matchesExercise) return false;
      }

      // 2. Date filter (exact day match)
      if (selectedDateKey) {
        const recordDateKey = toLocalDateKey(record.date || record.startTime);
        if (recordDateKey !== selectedDateKey) return false;
      }

      return true;
    });
  }, [history, searchQuery, selectedDate]);

  const openDatePicker = () => {
    Keyboard.dismiss();
    const monthToShow = startOfMonth(selectedDate || new Date());
    setCalendarMonth(monthToShow);
    setCalendarMode('days');
    setYearPageStart(getYearPageStart(monthToShow.getFullYear()));
    setShowDatePicker((currentValue) => !currentValue);
  };

  const selectCalendarDate = (date) => {
    if (!isDateInPickerRange(date)) return;
    Keyboard.dismiss();
    setSelectedDate(normalizePickerDate(date));
    setShowDatePicker(false);
  };

  const selectCalendarYear = (year) => {
    setCalendarMonth((currentMonth) => new Date(year, currentMonth.getMonth(), 1));
  };

  const selectCalendarMonth = (monthIndex) => {
    setCalendarMonth((currentMonth) => new Date(currentMonth.getFullYear(), monthIndex, 1));
    setCalendarMode('days');
  };

  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);
  const yearOptions = useMemo(() => buildYearOptions(yearPageStart), [yearPageStart]);
  const minMonth = startOfMonth(DATE_PICKER_MIN_DATE);
  const maxMonth = startOfMonth(DATE_PICKER_MAX_DATE);
  const canGoToPreviousMonth = calendarMonth > minMonth;
  const canGoToNextMonth = calendarMonth < maxMonth;
  const canGoToPreviousYearPage = yearPageStart > DATE_PICKER_MIN_DATE.getFullYear();
  const canGoToNextYearPage =
    yearPageStart + YEAR_PAGE_SIZE - 1 < DATE_PICKER_MAX_DATE.getFullYear();
  const today = normalizePickerDate(new Date());
  const monthLabel = calendarMonth.toLocaleDateString('it-IT', {
    month: 'long',
    year: 'numeric',
  });
  const selectedCalendarYear = calendarMonth.getFullYear();
  const selectedCalendarMonth = calendarMonth.getMonth();

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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          {/* Barra di ricerca e calendario custom */}
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
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
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
                onPress={openDatePicker}
              >
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
                  {selectedDate
                    ? `Filtro: ${formatDateLabel(selectedDate)}`
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
                  onPress={() => {
                    Keyboard.dismiss();
                    setSelectedDate(null);
                  }}
                >
                  <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '700' }}>Reset Data</Text>
                </TouchableOpacity>
              )}
            </View>

            {showDatePicker && (
              <View
                style={{
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                  borderWidth: 1,
                  borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                  borderRadius: 12,
                  padding: 12,
                  gap: 10,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: canGoToPreviousMonth ? 1 : 0.35,
                    }}
                    disabled={!canGoToPreviousMonth}
                    onPress={() => setCalendarMonth((currentMonth) => addMonths(currentMonth, -1))}
                  >
                    <Text style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontSize: 22, fontWeight: '800' }}>‹</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      backgroundColor: calendarMode === 'monthYear'
                        ? isDarkMode ? '#1e293b' : '#eef6e6'
                        : 'transparent',
                    }}
                    onPress={() => {
                      setYearPageStart(getYearPageStart(calendarMonth.getFullYear()));
                      setCalendarMode((currentMode) =>
                        currentMode === 'days' ? 'monthYear' : 'days'
                      );
                    }}
                  >
                    <Text style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontSize: 16, fontWeight: '800', textTransform: 'capitalize' }}>
                      {monthLabel}
                    </Text>
                    <Text style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: '700', textAlign: 'center' }}>
                      Cambia mese/anno
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: canGoToNextMonth ? 1 : 0.35,
                    }}
                    disabled={!canGoToNextMonth}
                    onPress={() => setCalendarMonth((currentMonth) => addMonths(currentMonth, 1))}
                  >
                    <Text style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontSize: 22, fontWeight: '800' }}>›</Text>
                  </TouchableOpacity>
                </View>

                {calendarMode === 'monthYear' ? (
                  <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <TouchableOpacity
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: canGoToPreviousYearPage ? 1 : 0.35,
                        }}
                        disabled={!canGoToPreviousYearPage}
                        onPress={() =>
                          setYearPageStart((currentStart) =>
                            Math.max(
                              DATE_PICKER_MIN_DATE.getFullYear(),
                              currentStart - YEAR_PAGE_SIZE
                            )
                          )
                        }
                      >
                        <Text style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontSize: 20, fontWeight: '800' }}>‹</Text>
                      </TouchableOpacity>
                      <Text style={{ color: isDarkMode ? '#cbd5e1' : '#475569', fontSize: 13, fontWeight: '800' }}>
                        {yearPageStart} - {Math.min(yearPageStart + YEAR_PAGE_SIZE - 1, DATE_PICKER_MAX_DATE.getFullYear())}
                      </Text>
                      <TouchableOpacity
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: canGoToNextYearPage ? 1 : 0.35,
                        }}
                        disabled={!canGoToNextYearPage}
                        onPress={() =>
                          setYearPageStart((currentStart) =>
                            Math.min(
                              getYearPageStart(DATE_PICKER_MAX_DATE.getFullYear()),
                              currentStart + YEAR_PAGE_SIZE
                            )
                          )
                        }
                      >
                        <Text style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontSize: 20, fontWeight: '800' }}>›</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {yearOptions.map((year) => {
                        const isSelectedYear = year === selectedCalendarYear;

                        return (
                          <TouchableOpacity
                            key={year}
                            style={{
                              width: '22.8%',
                              paddingVertical: 9,
                              borderRadius: 8,
                              alignItems: 'center',
                              backgroundColor: isSelectedYear
                                ? '#86B749'
                                : isDarkMode
                                  ? '#1e293b'
                                  : '#f8fafc',
                              borderWidth: 1,
                              borderColor: isSelectedYear
                                ? '#86B749'
                                : isDarkMode
                                  ? '#334155'
                                  : '#e2e8f0',
                            }}
                            onPress={() => selectCalendarYear(year)}
                          >
                            <Text
                              style={{
                                color: isSelectedYear ? '#ffffff' : isDarkMode ? '#f8fafc' : '#0f172a',
                                fontSize: 13,
                                fontWeight: '800',
                              }}
                            >
                              {year}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {MONTH_LABELS.map((label, monthIndex) => {
                        const isSelectedMonth = monthIndex === selectedCalendarMonth;

                        return (
                          <TouchableOpacity
                            key={label}
                            style={{
                              width: '30.9%',
                              paddingVertical: 10,
                              borderRadius: 8,
                              alignItems: 'center',
                              backgroundColor: isSelectedMonth
                                ? '#86B749'
                                : isDarkMode
                                  ? '#1e293b'
                                  : '#f8fafc',
                              borderWidth: 1,
                              borderColor: isSelectedMonth
                                ? '#86B749'
                                : isDarkMode
                                  ? '#334155'
                                  : '#e2e8f0',
                            }}
                            onPress={() => selectCalendarMonth(monthIndex)}
                          >
                            <Text
                              style={{
                                color: isSelectedMonth ? '#ffffff' : isDarkMode ? '#f8fafc' : '#0f172a',
                                fontSize: 14,
                                fontWeight: '800',
                              }}
                            >
                              {label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={{ flexDirection: 'row' }}>
                      {WEEKDAY_LABELS.map((label, index) => (
                        <Text
                          key={`${label}-${index}`}
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            color: isDarkMode ? '#94a3b8' : '#64748b',
                            fontSize: 12,
                            fontWeight: '800',
                          }}
                        >
                          {label}
                        </Text>
                      ))}
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 6 }}>
                      {calendarDays.map((date, index) => {
                        const dateKey = date ? toLocalDateKey(date) : `empty-${index}`;
                        const isSelected = date && isSameLocalDay(date, selectedDate);
                        const isToday = date && isSameLocalDay(date, today);

                        return (
                          <View key={dateKey} style={{ width: `${100 / 7}%`, alignItems: 'center' }}>
                            {date ? (
                              <TouchableOpacity
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 17,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: isSelected ? '#86B749' : 'transparent',
                                  borderWidth: isToday && !isSelected ? 1 : 0,
                                  borderColor: '#86B749',
                                }}
                                onPress={() => selectCalendarDate(date)}
                              >
                                <Text
                                  style={{
                                    color: isSelected
                                      ? '#ffffff'
                                      : isDarkMode
                                        ? '#f8fafc'
                                        : '#0f172a',
                                    fontSize: 14,
                                    fontWeight: isSelected || isToday ? '800' : '600',
                                  }}
                                >
                                  {date.getDate()}
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <View style={{ width: 34, height: 34 }} />
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            )}
          </View>

          <ScrollView
            style={styles.content}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}>
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
                        {formatDateLabel(record.date || record.startTime)}
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
        </View>
      </TouchableWithoutFeedback>

      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </SafeAreaView>
  );
}
