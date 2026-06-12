import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useSettings, useEffectiveDark } from '../context/SettingsContext';
import { COLORS } from '../constants';

const THEME_OPTIONS = [
  { value: 'light', label: '☀️  Chiaro' },
  { value: 'dark', label: '🌙  Scuro' },
  { value: 'auto', label: '⚙️  Automatico (sistema)' },
];

const REST_PRESETS = [30, 45, 60, 90, 120, 180];

export default function SettingsModal({ visible, onClose }) {
  const { settings, updateSetting } = useSettings();
  const effectiveDark = useEffectiveDark();

  const C = effectiveDark ? DARK : LIGHT;

  const [restInput, setRestInput] = useState(String(settings.defaultRestTime));

  const handleRestInputBlur = () => {
    const val = parseInt(restInput, 10);
    if (!isNaN(val) && val >= 5 && val <= 600) {
      updateSetting('defaultRestTime', val);
    } else {
      Alert.alert('Errore', 'Inserisci un valore tra 5 e 600 secondi');
      setRestInput(String(settings.defaultRestTime));
    }
  };

  const handleRestPreset = (sec) => {
    updateSetting('defaultRestTime', sec);
    setRestInput(String(sec));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[s.overlay, { backgroundColor: effectiveDark ? 'rgba(0,0,0,0.7)' : 'rgba(15,23,42,0.45)' }]}>
        <View style={[s.sheet, { backgroundColor: C.card }]}>
          {/* Header */}
          <View style={s.header}>
            <Text style={[s.title, { color: C.textDark }]}>⚙️  Impostazioni</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={{ fontSize: 20, color: C.muted, fontWeight: '600' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* ── SEZIONE 1: Unità di peso ──────────────────────────────── */}
            <View style={[s.section, { borderColor: C.border }]}>
              <Text style={[s.sectionTitle, { color: C.primary }]}>🏋️  Unità di peso</Text>
              <Text style={[s.sectionDesc, { color: C.muted }]}>
                Scegli l'unità di misura per i pesi. La conversione avviene automaticamente (1 kg ≈ 2.205 lbs).
              </Text>
              <View style={s.toggleRow}>
                {[{ v: 'kg', label: 'Chilogrammi (kg)' }, { v: 'lbs', label: 'Libbre (lbs)' }].map((opt) => {
                  const active = settings.weightUnit === opt.v;
                  return (
                    <TouchableOpacity
                      key={opt.v}
                      style={[
                        s.toggleBtn,
                        { borderColor: C.border, backgroundColor: C.inputBg },
                        active && { backgroundColor: C.primary, borderColor: C.primary },
                      ]}
                      onPress={() => updateSetting('weightUnit', opt.v)}
                    >
                      <Text style={[s.toggleBtnText, { color: C.textDark }, active && { color: '#fff', fontWeight: '700' }]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {settings.weightUnit === 'lbs' && (
                <View style={[s.infoBox, { backgroundColor: C.accentBg, borderColor: C.primary }]}>
                  <Text style={{ color: C.primary, fontSize: 12 }}>
                    ℹ️  I pesi inseriti vengono visualizzati in libbre. I dati sono salvati internamente in kg.
                  </Text>
                </View>
              )}
            </View>

            {/* ── SEZIONE 2: Tema ───────────────────────────────────────── */}
            <View style={[s.section, { borderColor: C.border }]}>
              <Text style={[s.sectionTitle, { color: C.primary }]}>🎨  Tema dell'app</Text>
              <Text style={[s.sectionDesc, { color: C.muted }]}>
                "Automatico" segue le impostazioni di sistema del dispositivo.
              </Text>
              {THEME_OPTIONS.map((opt) => {
                const active = settings.themeMode === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      s.radioRow,
                      { borderColor: C.border, backgroundColor: C.inputBg },
                      active && { borderColor: C.primary, backgroundColor: C.accentBg },
                    ]}
                    onPress={() => updateSetting('themeMode', opt.value)}
                  >
                    <View style={[s.radio, { borderColor: C.primary }, active && { backgroundColor: C.primary }]}>
                      {active && <View style={s.radioDot} />}
                    </View>
                    <Text style={[s.radioLabel, { color: C.textDark }, active && { fontWeight: '700' }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── SEZIONE 3: Timer recupero predefinito ────────────────── */}
            <View style={[s.section, { borderColor: C.border }]}>
              <Text style={[s.sectionTitle, { color: C.primary }]}>⏱  Timer recupero predefinito</Text>
              <Text style={[s.sectionDesc, { color: C.muted }]}>
                Tempo di recupero usato automaticamente quando aggiungi un nuovo esercizio. Puoi comunque cambiarlo per ogni esercizio singolarmente.
              </Text>

              {/* Presets */}
              <View style={s.presetsRow}>
                {REST_PRESETS.map((sec) => {
                  const active = settings.defaultRestTime === sec;
                  const label = sec >= 60 ? `${sec / 60}min` : `${sec}s`;
                  return (
                    <TouchableOpacity
                      key={sec}
                      style={[
                        s.presetBtn,
                        { borderColor: C.border, backgroundColor: C.inputBg },
                        active && { backgroundColor: C.primary, borderColor: C.primary },
                      ]}
                      onPress={() => handleRestPreset(sec)}
                    >
                      <Text style={[{ color: C.textDark, fontSize: 13 }, active && { color: '#fff', fontWeight: '700' }]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom input */}
              <View style={s.customRestRow}>
                <Text style={[{ color: C.muted, fontSize: 13, marginRight: 8, flex: 1 }]}>Personalizzato (sec):</Text>
                <TextInput
                  style={[s.restInput, { backgroundColor: C.inputBg, borderColor: C.border, color: C.textDark }]}
                  keyboardType="number-pad"
                  value={restInput}
                  onChangeText={setRestInput}
                  onBlur={handleRestInputBlur}
                  returnKeyType="done"
                  onSubmitEditing={handleRestInputBlur}
                />
              </View>
              <Text style={[s.restCurrentLabel, { color: C.primary }]}>
                Attuale: {settings.defaultRestTime}s ({settings.defaultRestTime >= 60 ? `${Math.floor(settings.defaultRestTime / 60)}min ${settings.defaultRestTime % 60 > 0 ? `${settings.defaultRestTime % 60}s` : ''}` : ''})
              </Text>
            </View>

            {/* ── SEZIONE 4: Note esercizio ──────────────────────────────── */}
            <View style={[s.section, { borderColor: C.border }]}>
              <Text style={[s.sectionTitle, { color: C.primary }]}>📝  Note esercizio</Text>
              <Text style={[s.sectionDesc, { color: C.muted }]}>
                Attiva o disattiva la possibilità di aggiungere note personalizzate per gli esercizi durante l'allenamento e nella modifica della scheda.
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.inputBg, padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border }}>
                <Text style={{ color: C.textDark, fontWeight: '600', fontSize: 13 }}>Abilita note durante workout e modifica</Text>
                <Switch
                  value={settings.showExerciseNotes !== false}
                  onValueChange={(val) => updateSetting('showExerciseNotes', val)}
                  trackColor={{ false: '#767577', true: COLORS.primary }}
                  thumbColor={settings.showExerciseNotes !== false ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* ── SEZIONE 5: Notifiche fine recupero ────────────────────────── */}
            <View style={[s.section, { borderColor: C.border }]}>
              <Text style={[s.sectionTitle, { color: C.primary }]}>🔔  Notifiche fine recupero</Text>
              <Text style={[s.sectionDesc, { color: C.muted }]}>
                Seleziona i metodi di notifica da attivare al termine del conto alla rovescia di recupero.
              </Text>
              
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.inputBg, padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border }}>
                  <Text style={{ color: C.textDark, fontWeight: '600', fontSize: 13 }}>Vibrazione (Feedback Aptico)</Text>
                  <Switch
                    value={!!settings.restTimerHaptic}
                    onValueChange={(val) => updateSetting('restTimerHaptic', val)}
                    trackColor={{ false: '#767577', true: COLORS.primary }}
                    thumbColor={settings.restTimerHaptic ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.inputBg, padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border }}>
                  <Text style={{ color: C.textDark, fontWeight: '600', fontSize: 13 }}>Segnale acustico (Suono)</Text>
                  <Switch
                    value={!!settings.restTimerSound}
                    onValueChange={(val) => updateSetting('restTimerSound', val)}
                    trackColor={{ false: '#767577', true: COLORS.primary }}
                    thumbColor={settings.restTimerSound ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>
            </View>

          </ScrollView>

          <TouchableOpacity
            style={[s.closeBtn, { backgroundColor: C.primary }]}
            onPress={onClose}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Local theme tokens ───────────────────────────────────────────────────────
const LIGHT = {
  card: '#ffffff',
  textDark: '#1e293b',
  muted: '#64748b',
  border: '#e2e8f0',
  inputBg: '#f8fafc',
  primary: '#86B749',
  accentBg: '#f0fdf4',
};
const DARK = {
  card: '#1e293b',
  textDark: '#f1f5f9',
  muted: '#94a3b8',
  border: '#334155',
  inputBg: '#0f172a',
  primary: '#22c55e',
  accentBg: '#052e16',
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
  },
  section: {
    borderBottomWidth: 1,
    paddingBottom: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  toggleBtnText: {
    fontSize: 13,
  },
  infoBox: {
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  radioLabel: {
    fontSize: 14,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  presetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  customRestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  restInput: {
    width: 80,
    borderWidth: 1.5,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 6,
  },
  restCurrentLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  closeBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
