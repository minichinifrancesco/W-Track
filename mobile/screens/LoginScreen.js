import React from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { logoFull } from '../constants';
import { getStyles, getThemeColors } from '../styles/styles';

export default function LoginScreen({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleRegister,
  authLoading,
}) {
  const isDarkMode = useColorScheme() === 'dark';
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

          <TouchableOpacity
            style={[styles.primaryButton, authLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={authLoading}>
            <Text style={styles.primaryButtonText}>
              {authLoading ? 'Attendi...' : 'Accedi'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, authLoading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={authLoading}>
            <Text style={styles.secondaryButtonText}>
              {authLoading ? 'Attendi...' : 'Registrati'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
