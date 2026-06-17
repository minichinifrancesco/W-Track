import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useEffectiveDark, useSettings } from '../context/SettingsContext';
import { getStyles, getThemeColors } from '../styles/styles';
import DraftTextInput from '../components/DraftTextInput';

const GENDER_OPTIONS = [
  { value: 'MASCHIO', label: 'Maschio' },
  { value: 'FEMMINA', label: 'Femmina' },
  { value: 'NON_SPECIFICATO', label: 'Non specificato' },
];

export default function EditProfileModal({
  showEditProfileModal,
  setShowEditProfileModal,
  profileName,
  setProfileName,
  profileGender,
  setProfileGender,
  profileHeight,
  setProfileHeight,
  profileWeight,
  setProfileWeight,
  saveProfile,
}) {
  const isDarkMode = useEffectiveDark();
  const { settings, convertWeight, toKg } = useSettings();
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);

  return (
    <Modal visible={showEditProfileModal} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifica dati personali</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor={C.textMuted}
              value={profileName}
              onChangeText={setProfileName}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '700', marginBottom: 8 }}>
              Genere
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {GENDER_OPTIONS.map((option) => {
                const isSelected = profileGender === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      paddingHorizontal: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: isSelected ? '#86B749' : C.border,
                      backgroundColor: isSelected ? '#86B749' : C.card,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      Keyboard.dismiss();
                      setProfileGender(option.value);
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? '#ffffff' : C.textDark,
                        fontSize: 12,
                        fontWeight: '700',
                        textAlign: 'center',
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Altezza (cm)"
              placeholderTextColor={C.textMuted}
              value={profileHeight}
              onChangeText={setProfileHeight}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <DraftTextInput
              style={styles.input}
              placeholder={`Peso (${settings.weightUnit})`}
              placeholderTextColor={C.textMuted}
              value={convertWeight(profileWeight)}
              fallback=""
              normalizeOnCommit={(value) => (value === '' ? '' : value)}
              onCommit={(value) => setProfileWeight(value === '' ? '' : String(toKg(value)))}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.modalButtonFlex]}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowEditProfileModal(false);
                }}>
                <Text style={styles.secondaryButtonText}>Annulla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, styles.modalButtonFlex]}
                onPress={() => {
                  Keyboard.dismiss();
                  saveProfile();
                }}>
                <Text style={styles.primaryButtonText}>Salva</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
