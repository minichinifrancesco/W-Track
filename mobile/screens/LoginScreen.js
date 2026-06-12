import React from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { useEffectiveDark } from '../context/SettingsContext';
import { logoFull } from '../constants';
import { getStyles, getThemeColors } from '../styles/styles';

export default function LoginScreen({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleRegister,
}) {
  const isDarkMode = useEffectiveDark();
  const styles = getStyles(isDarkMode);
  const C = getThemeColors(isDarkMode);

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

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Accedi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRegister}>
            <Text style={styles.secondaryButtonText}>Registrati</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
