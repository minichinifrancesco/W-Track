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
import {
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetCode,
} from '../services/api';
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

const RESET_REQUEST_MESSAGE =
  'Se l’indirizzo è associato a un account, riceverai un codice via email.';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getPasswordValidationError = (value) => {
  const passwordValue = value || '';
  if (passwordValue.length < 8) {
    return 'La password deve contenere almeno 8 caratteri.';
  }
  if (!/[a-z]/.test(passwordValue)) {
    return 'La password deve contenere una lettera minuscola.';
  }
  if (!/[A-Z]/.test(passwordValue)) {
    return 'La password deve contenere una lettera maiuscola.';
  }
  if (!/\d/.test(passwordValue)) {
    return 'La password deve contenere un numero.';
  }
  if (!/[^A-Za-z0-9]/.test(passwordValue)) {
    return 'La password deve contenere un simbolo.';
  }
  return null;
};

function DismissKeyboardWrapper({ children }) {
  if (Platform.OS === 'web') {
    return children;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
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
  const [registerGender, setRegisterGender] = useState('NON_SPECIFICATO');
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetCountdown, setResetCountdown] = useState(0);
  const [resetCodeVerified, setResetCodeVerified] = useState(false);

  useEffect(() => {
    if (!showRegisterModal) return;
    setRegisterEmail(email);
    setRegisterPassword(password);
  }, [showRegisterModal, email, password]);

  useEffect(() => {
    if (!showResetModal) return;
    setResetEmail(email);
  }, [showResetModal, email]);

  useEffect(() => {
    if (!showResetModal || resetCountdown <= 0) return undefined;

    const timeoutId = setTimeout(() => {
      setResetCountdown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [showResetModal, resetCountdown]);

  const closeRegisterModal = () => {
    Keyboard.dismiss();
    setShowRegisterModal(false);
    setShowBirthDatePicker(false);
  };

  const openResetModal = () => {
    Keyboard.dismiss();
    setResetEmail(email);
    setResetCode('');
    setResetNewPassword('');
    setResetConfirmPassword('');
    setResetError('');
    setResetSuccess('');
    setResetCountdown(0);
    setResetCodeVerified(false);
    setShowResetModal(true);
  };

  const closeResetModal = () => {
    Keyboard.dismiss();
    setShowResetModal(false);
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

  const handleResetCodeChange = (value) => {
    setResetCode(String(value || '').replace(/\D/g, '').slice(0, 6));
    setResetCodeVerified(false);
  };

  const submitPasswordResetRequest = async () => {
    Keyboard.dismiss();
    const targetEmail = resetEmail.trim();

    if (!targetEmail) {
      setResetError('Inserisci la tua email');
      return;
    }
    if (!isValidEmail(targetEmail)) {
      setResetError('Formato email non valido');
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetSuccess('');
    try {
      const response = await requestPasswordReset(targetEmail);
      setResetSuccess(response?.message || RESET_REQUEST_MESSAGE);
      setResetCountdown(60);
      setResetCode('');
      setResetNewPassword('');
      setResetConfirmPassword('');
      setResetCodeVerified(false);
    } catch (error) {
      setResetError(error.message || 'Invio codice non riuscito');
    } finally {
      setResetLoading(false);
    }
  };

  const submitVerifyResetCode = async () => {
    Keyboard.dismiss();
    const targetEmail = resetEmail.trim();

    if (!isValidEmail(targetEmail)) {
      setResetError('Formato email non valido');
      return;
    }
    if (resetCode.length !== 6) {
      setResetError('Inserisci il codice di 6 cifre');
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetSuccess('');
    try {
      await verifyPasswordResetCode(targetEmail, resetCode);
      setResetCodeVerified(true);
      setResetSuccess('Codice verificato. Ora puoi impostare una nuova password.');
    } catch (error) {
      setResetCodeVerified(false);
      setResetError(error.message || 'Codice non valido o scaduto');
    } finally {
      setResetLoading(false);
    }
  };

  const submitResetPassword = async () => {
    Keyboard.dismiss();
    const targetEmail = resetEmail.trim();

    if (!isValidEmail(targetEmail)) {
      setResetError('Formato email non valido');
      return;
    }
    if (resetCode.length !== 6) {
      setResetError('Inserisci il codice di 6 cifre');
      return;
    }
    const passwordValidationError = getPasswordValidationError(resetNewPassword);
    if (passwordValidationError) {
      setResetError(passwordValidationError);
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetError('Le password non coincidono');
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetSuccess('');
    try {
      await resetPassword(targetEmail, resetCode, resetNewPassword);
      setEmail(targetEmail);
      setPassword('');
      setResetCode('');
      setResetNewPassword('');
      setResetConfirmPassword('');
      setResetCodeVerified(false);
      setResetSuccess('Password aggiornata con successo. Puoi accedere con la nuova password.');
    } catch (error) {
      setResetError(error.message || 'Reset password non riuscito');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboardWrapper>
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
              style={{ alignSelf: 'flex-end', marginBottom: 12 }}
              onPress={openResetModal}
              disabled={authLoading}>
              <Text style={{ color: C.primary, fontWeight: '700' }}>
                Password dimenticata?
              </Text>
            </TouchableOpacity>

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
      </DismissKeyboardWrapper>

      <Modal visible={showRegisterModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <DismissKeyboardWrapper>
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
          </DismissKeyboardWrapper>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showResetModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <DismissKeyboardWrapper>
            <View style={styles.modalContentLarge}>
              <ScrollView
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={Keyboard.dismiss}>
                <Text style={styles.modalTitle}>Recupera password</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={C.textMuted}
                  value={resetEmail}
                  onChangeText={(value) => {
                    setResetEmail(value);
                    setResetCodeVerified(false);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />

                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    resetLoading || resetCountdown > 0 ? { opacity: 0.65 } : null,
                  ]}
                  onPress={submitPasswordResetRequest}
                  disabled={resetLoading || resetCountdown > 0}>
                  <Text style={styles.secondaryButtonText}>
                    {resetCountdown > 0
                      ? `Reinvia tra ${resetCountdown}s`
                      : 'Invia codice'}
                  </Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder="Codice di 6 cifre"
                  placeholderTextColor={C.textMuted}
                  value={resetCode}
                  onChangeText={handleResetCodeChange}
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />

                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    resetLoading || resetCode.length !== 6 ? { opacity: 0.65 } : null,
                  ]}
                  onPress={submitVerifyResetCode}
                  disabled={resetLoading || resetCode.length !== 6}>
                  <Text style={styles.secondaryButtonText}>
                    {resetCodeVerified ? 'Codice verificato' : 'Verifica codice'}
                  </Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder="Nuova password"
                  placeholderTextColor={C.textMuted}
                  value={resetNewPassword}
                  onChangeText={setResetNewPassword}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Conferma nuova password"
                  placeholderTextColor={C.textMuted}
                  value={resetConfirmPassword}
                  onChangeText={setResetConfirmPassword}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />

                {!!resetError && (
                  <Text style={{ color: '#dc2626', fontSize: 13, marginBottom: 10 }}>
                    {resetError}
                  </Text>
                )}
                {!!resetSuccess && (
                  <Text style={{ color: C.primaryDark, fontSize: 13, marginBottom: 10 }}>
                    {resetSuccess}
                  </Text>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.secondaryButton, styles.modalButtonFlex]}
                    onPress={closeResetModal}
                    disabled={resetLoading}>
                    <Text style={styles.secondaryButtonText}>Torna al login</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      styles.modalButtonFlex,
                      resetLoading ? { opacity: 0.65 } : null,
                    ]}
                    onPress={submitResetPassword}
                    disabled={resetLoading}>
                    <Text style={styles.primaryButtonText}>
                      {resetLoading ? 'Attendi...' : 'Aggiorna password'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </DismissKeyboardWrapper>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
