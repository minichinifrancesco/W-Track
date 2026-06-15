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
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  useEffect(() => {
    if (!showRegisterModal) return;
    setRegisterEmail(email);
    setRegisterPassword(password);
  }, [showRegisterModal, email, password]);

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setShowBirthDatePicker(false);
  };

  const submitRegister = async () => {
    const didRegister = await handleRegister({
      email: registerEmail,
      password: registerPassword,
      name: registerName,
      surname: registerSurname,
      birthDate: formatDateForApi(registerBirthDate),
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
      <View style={styles.authContainer}>
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
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={C.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[
              styles.primaryButton,
              authLoading ? { opacity: 0.65 } : null,
            ]}
            onPress={handleLogin}
            disabled={authLoading}>
            <Text style={styles.primaryButtonText}>
              {authLoading ? 'Accesso...' : 'Accedi'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowRegisterModal(true)}>
            <Text style={styles.secondaryButtonText}>Registrati</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showRegisterModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <View style={styles.modalContentLarge}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Crea account</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={C.textMuted}
                value={registerEmail}
                onChangeText={setRegisterEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={C.textMuted}
                value={registerPassword}
                onChangeText={setRegisterPassword}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor={C.textMuted}
                value={registerName}
                onChangeText={setRegisterName}
              />

              <TextInput
                style={styles.input}
                placeholder="Cognome"
                placeholderTextColor={C.textMuted}
                value={registerSurname}
                onChangeText={setRegisterSurname}
              />

              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => setShowBirthDatePicker(true)}
                activeOpacity={0.8}>
                <Text style={{ color: C.textDark, fontSize: 15 }}>
                  Data di nascita: {formatDateForDisplay(registerBirthDate)}
                </Text>
              </TouchableOpacity>

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
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
