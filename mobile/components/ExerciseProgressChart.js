import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffectiveDark } from '../context/SettingsContext';
import {
  PROGRESS_METRICS,
  PROGRESS_RANGES,
  buildExerciseProgressData,
  getExerciseKey,
} from '../utils/progress';

const CHART_HEIGHT = 190;
const LEFT_PAD = 38;
const RIGHT_PAD = 14;
const TOP_PAD = 16;
const BOTTOM_PAD = 28;

export default function ExerciseProgressChart({ exercise, history = [] }) {
  const isDark = useEffectiveDark();
  const [rangeId, setRangeId] = useState('6m');
  const [selectedMetricIds, setSelectedMetricIds] = useState(
    exercise?.type === 'reps' ? ['maxReps'] : ['maxWeight']
  );
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [chartWidth, setChartWidth] = useState(320);
  const exerciseKey = getExerciseKey(exercise);

  const colors = useMemo(() => ({
    text: isDark ? '#f8fafc' : '#0f172a',
    muted: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    surface: isDark ? '#0f172a' : '#f8fafc',
    chip: isDark ? '#1e293b' : '#ffffff',
    grid: isDark ? '#334155' : '#cbd5e1',
  }), [isDark]);

  const data = useMemo(
    () => buildExerciseProgressData(history, exercise, rangeId),
    [history, exercise, rangeId]
  );

  useEffect(() => {
    setSelectedMetricIds(exercise?.type === 'reps' ? ['maxReps'] : ['maxWeight']);
    setSelectedPoint(null);
  }, [exercise?.type, exercise?.name, exerciseKey]);

  const selectedMetrics = useMemo(() => PROGRESS_METRICS.filter((metric) =>
    selectedMetricIds.includes(metric.id)
  ), [selectedMetricIds]);

  const toggleMetric = useCallback((metricId) => {
    setSelectedPoint(null);
    setSelectedMetricIds((prev) => {
      if (prev.includes(metricId)) {
        return prev.length === 1 ? prev : prev.filter((id) => id !== metricId);
      }
      return [...prev, metricId];
    });
  }, []);

  const plotWidth = Math.max(220, chartWidth - LEFT_PAD - RIGHT_PAD);
  const plotHeight = CHART_HEIGHT - TOP_PAD - BOTTOM_PAD;

  const { yMin, yMax, hasEnoughData } = useMemo(() => {
    const values = data.flatMap((item) =>
      selectedMetrics.map((metric) => Number(item[metric.id]) || 0)
    );
    const maxValue = Math.max(...values, 0);
    const minValue = Math.min(...values.filter((value) => value > 0), 0);
    const calculatedYMin = minValue > 0 && minValue !== maxValue ? minValue : 0;
    const calculatedYMax = maxValue === calculatedYMin ? maxValue + 1 : maxValue;
    const enoughData = data.length >= 2 && maxValue > 0;
    return { yMin: calculatedYMin, yMax: calculatedYMax, hasEnoughData: enoughData };
  }, [data, selectedMetrics]);

  const getPoint = useCallback((item, index, metricId) => {
    const value = Number(item[metricId]) || 0;
    const x = LEFT_PAD + (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
    const ratio = yMax === yMin ? 0.5 : (value - yMin) / (yMax - yMin);
    const y = TOP_PAD + plotHeight - ratio * plotHeight;
    return { x, y, value };
  }, [data.length, plotWidth, plotHeight, yMin, yMax]);

  const formatValue = useCallback((value, metric) => {
    const rounded = Math.round(value * 10) / 10;
    return `${rounded}${metric.unit ? ` ${metric.unit}` : ''}`;
  }, []);

  const formatDate = useCallback((date) =>
    new Date(date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }), []);

  const formatLongDate = useCallback((date) =>
    new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }), []);

  return (
    <View style={[styles.wrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="analytics-outline" size={18} color="#86B749" />
          <Text style={[styles.title, { color: colors.text }]}>Andamento Carichi</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Storico completato
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {PROGRESS_METRICS.map((metric) => {
          const active = selectedMetricIds.includes(metric.id);
          return (
            <TouchableOpacity
              key={metric.id}
              onPress={() => toggleMetric(metric.id)}
              style={[
                styles.metricChip,
                {
                  backgroundColor: active ? metric.color : colors.chip,
                  borderColor: active ? metric.color : colors.border,
                },
              ]}
            >
              <Text style={[styles.metricChipText, { color: active ? '#ffffff' : colors.text }]}>
                {metric.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {PROGRESS_RANGES.map((range) => {
          const active = range.id === rangeId;
          return (
            <TouchableOpacity
              key={range.id}
              onPress={() => {
                setRangeId(range.id);
                setSelectedPoint(null);
              }}
              style={[
                styles.rangeChip,
                {
                  backgroundColor: active ? '#86B749' : colors.chip,
                  borderColor: active ? '#86B749' : colors.border,
                },
              ]}
            >
              <Text style={[styles.rangeChipText, { color: active ? '#ffffff' : colors.muted }]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {!hasEnoughData ? (
        <View style={[styles.emptyBox, { borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={22} color={colors.muted} />
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            Servono almeno due allenamenti completati con dati validi per mostrare l'andamento.
          </Text>
        </View>
      ) : (
        <>
          <View
            style={styles.chartArea}
            onLayout={(event) => setChartWidth(Math.max(300, event.nativeEvent.layout.width))}
          >
            <Text style={[styles.yLabelTop, { color: colors.muted }]}>
              {Math.round(yMax * 10) / 10}
            </Text>
            <Text style={[styles.yLabelBottom, { color: colors.muted }]}>
              {Math.round(yMin * 10) / 10}
            </Text>

            {[0, 0.5, 1].map((ratio) => (
              <View
                key={ratio}
                style={[
                  styles.gridLine,
                  {
                    left: LEFT_PAD,
                    right: RIGHT_PAD,
                    top: TOP_PAD + plotHeight * ratio,
                    backgroundColor: colors.grid,
                  },
                ]}
              />
            ))}

            {selectedMetrics.map((metric) =>
              data.slice(0, -1).map((item, index) => {
                const start = getPoint(item, index, metric.id);
                const end = getPoint(data[index + 1], index + 1, metric.id);
                const length = Math.hypot(end.x - start.x, end.y - start.y);
                const angle = Math.atan2(end.y - start.y, end.x - start.x);
                return (
                  <View
                    key={`${metric.id}-${item.id}-${data[index + 1].id}`}
                    style={[
                      styles.segment,
                      {
                        width: length,
                        left: (start.x + end.x) / 2 - length / 2,
                        top: (start.y + end.y) / 2,
                        backgroundColor: metric.color,
                        transform: [{ rotateZ: `${angle}rad` }],
                      },
                    ]}
                  />
                );
              })
            )}

            {selectedMetrics.map((metric) =>
              data.map((item, index) => {
                const point = getPoint(item, index, metric.id);
                const isSelected =
                  selectedPoint?.id === item.id && selectedPoint?.metricId === metric.id;
                return (
                  <TouchableOpacity
                    key={`${metric.id}-${item.id}`}
                    onPress={() => setSelectedPoint({ ...item, metricId: metric.id })}
                    activeOpacity={0.8}
                    style={[
                      styles.point,
                      {
                        left: point.x - 7,
                        top: point.y - 7,
                        backgroundColor: metric.color,
                        borderColor: isSelected ? '#ffffff' : colors.surface,
                        transform: [{ scale: isSelected ? 1.25 : 1 }],
                      },
                    ]}
                  />
                );
              })
            )}

            <Text style={[styles.xLabelLeft, { color: colors.muted }]}>
              {formatDate(data[0].date)}
            </Text>
            <Text style={[styles.xLabelRight, { color: colors.muted }]}>
              {formatDate(data[data.length - 1].date)}
            </Text>
          </View>

          <View style={styles.legendRow}>
            {selectedMetrics.map((metric) => (
              <View key={metric.id} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: metric.color }]} />
                <Text style={[styles.legendText, { color: colors.muted }]}>{metric.label}</Text>
              </View>
            ))}
          </View>

          {selectedPoint ? (
            <View style={[styles.detailBox, { borderColor: colors.border, backgroundColor: colors.chip }]}>
              <Text style={[styles.detailTitle, { color: colors.text }]}>
                {selectedPoint.workoutName}
              </Text>
              <Text style={[styles.detailDate, { color: colors.muted }]}>
                {formatLongDate(selectedPoint.date)}
              </Text>
              <View style={styles.detailMetricGrid}>
                {selectedMetrics.map((metric) => (
                  <View key={metric.id} style={styles.detailMetric}>
                    <Text style={[styles.detailMetricLabel, { color: colors.muted }]}>
                      {metric.label}
                    </Text>
                    <Text style={[styles.detailMetricValue, { color: metric.color }]}>
                      {formatValue(selectedPoint[metric.id], metric)}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.detailSets, { color: colors.muted }]}>
                Serie completate: {selectedPoint.completedSets}
              </Text>
            </View>
          ) : (
            <Text style={[styles.tapHint, { color: colors.muted }]}>
              Tocca un punto per vedere i dettagli della sessione.
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  headerRow: {
    marginBottom: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  chipScroll: {
    marginBottom: 8,
  },
  metricChip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginRight: 6,
  },
  metricChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rangeChip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
  },
  rangeChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyBox: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
  },
  chartArea: {
    height: CHART_HEIGHT,
    width: '100%',
    marginTop: 4,
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    opacity: 0.45,
  },
  segment: {
    position: 'absolute',
    height: 2,
    borderRadius: 2,
  },
  point: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  yLabelTop: {
    position: 'absolute',
    left: 0,
    top: TOP_PAD - 7,
    fontSize: 10,
    width: LEFT_PAD - 4,
    textAlign: 'right',
  },
  yLabelBottom: {
    position: 'absolute',
    left: 0,
    top: TOP_PAD + CHART_HEIGHT - TOP_PAD - BOTTOM_PAD - 7,
    fontSize: 10,
    width: LEFT_PAD - 4,
    textAlign: 'right',
  },
  xLabelLeft: {
    position: 'absolute',
    left: LEFT_PAD,
    bottom: 2,
    fontSize: 10,
  },
  xLabelRight: {
    position: 'absolute',
    right: RIGHT_PAD,
    bottom: 2,
    fontSize: 10,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  detailDate: {
    fontSize: 11,
    marginTop: 2,
  },
  detailMetricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  detailMetric: {
    minWidth: '45%',
  },
  detailMetricLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  detailMetricValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 1,
  },
  detailSets: {
    fontSize: 11,
    marginTop: 8,
  },
  tapHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
