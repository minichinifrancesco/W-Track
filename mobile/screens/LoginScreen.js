import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffectiveDark } from '../context/SettingsContext';
import { logoFull } from '../constants';
import { getStyles, getThemeColors } from '../styles/styles';

function getDefaultBirthDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date;
}

function formatDateForApi(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateForDisplay(date) {
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const GENDER_OPTIONS = [
  { value: 'MASCHIO', label: 'Maschio' },
  { value: 'FEMMINA', label: 'Femmina' },
  { value: 'NON_SPECIFICATO', label: 'Non specificato' },
];

export default function LoginScreen({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleRegister,
  authLoading,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerSurname, setRegisterSurname] = useState('');
  const [registerBirthDate, setRegisterBirthDate] = useState(getDefaultBirthDate);
  const [registerGender, setRegisterGender] = useState('NON_SPECIFICATO');
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  useEffect(() => {
    if (!showRegisterModal) return;
    setRegisterEmail(email);
    setRegisterPassword(password);
  }, [showRegisterModal, email, password]);

  const closeRegisterModal = () => {
    Keyboard.dismiss();
    setShowRegisterModal(false);
    setShowBirthDatePicker(false);
  };

  const submitRegister = async () => {
    Keyboard.dismiss();
    const didRegister = await handleRegister({
      email: registerEmail,
      password: registerPassword,
      name: registerName,
      surname: registerSurname,
      birthDate: formatDateForApi(registerBirthDate),
      gender: registerGender,
    });

    if (didRegister) {
      closeRegisterModal();
    }
  };

  const onBirthDateChange = (event, selectedDate) => {
    if (Platform.OS !== 'ios') {
      setShowBirthDatePicker(false);
    }
    if (event?.type === 'dismissed') return;
    if (selectedDate) {
      setRegisterBirthDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.authContainer}>
          <Image source={logoFull} style={styles.logoFull} />
          <Text style={styles.tagline}>TRACK. PROGRESS. REPEAT.</Text>

          <View style={styles.authCard}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={C.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={C.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                authLoading ? { opacity: 0.65 } : null,
              ]}
              onPress={() => {
                Keyboard.dismiss();
                handleLogin();
              }}
              disabled={authLoading}>
              <Text style={styles.primaryButtonText}>
                {authLoading ? 'Accesso...' : 'Accedi'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                Keyboard.dismiss();
                setShowRegisterModal(true);
              }}>
              <Text style={styles.secondaryButtonText}>Registrati</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <Modal visible={showRegisterModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.modalContentLarge}>
              <ScrollView
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={Keyboard.dismiss}>
                <Text style={styles.modalTitle}>Crea account</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={C.textMuted}
                  value={registerEmail}
                  onChangeText={setRegisterEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={C.textMuted}
                  value={registerPassword}
                  onChangeText={setRegisterPassword}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Nome"
                  placeholderTextColor={C.textMuted}
                  value={registerName}
                  onChangeText={setRegisterName}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Cognome"
                  placeholderTextColor={C.textMuted}
                  value={registerSurname}
                  onChangeText={setRegisterSurname}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />

                <TouchableOpacity
                  style={[styles.input, { justifyContent: 'center' }]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowBirthDatePicker(true);
                  }}
                  activeOpacity={0.8}>
                  <Text style={{ color: C.textDark, fontSize: 15 }}>
                    Data di nascita: {formatDateForDisplay(registerBirthDate)}
                  </Text>
                </TouchableOpacity>

                <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '700', marginBottom: 8 }}>
                  Genere
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                  {GENDER_OPTIONS.map((option) => {
                    const isSelected = registerGender === option.value;
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
                          setRegisterGender(option.value);
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

                {(showBirthDatePicker || Platform.OS === 'ios') && (
                  <DateTimePicker
                    value={registerBirthDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()}
                    onChange={onBirthDateChange}
                  />
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.secondaryButton, styles.modalButtonFlex]}
                    onPress={closeRegisterModal}
                    disabled={authLoading}>
                    <Text style={styles.secondaryButtonText}>Annulla</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      styles.modalButtonFlex,
                      authLoading ? { opacity: 0.65 } : null,
                    ]}
                    onPress={submitRegister}
                    disabled={authLoading}>
                    <Text style={styles.primaryButtonText}>
                      {authLoading ? 'Registrazione...' : 'Crea account'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
