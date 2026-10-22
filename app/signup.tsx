import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { AppConfig } from '@/constants/config';
import { useAuth } from '@/contexts/auth-context';

export default function SignUpScreen() {
  const { signUp, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    if (!email.trim() || password.length < 6) {
      Alert.alert('Check your details', 'Enter a valid email and a password of at least 6 characters.');
      return;
    }
    try {
      await signUp({ email, password, fullName, companyName });
    } catch (e) {
      Alert.alert('Sign up failed', e instanceof Error ? e.message : 'Please try again.');
    }
  }

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <ThemedText type="title">Create account</ThemedText>
            <ThemedText style={styles.subtitle}>
              Open to any qualifying taxi or transport organization. No phone number required.
            </ThemedText>
          </View>

          <View style={styles.form}>
            <FormField label="Full name" value={fullName} onChangeText={setFullName} placeholder="Jane Driver" optional />
            <FormField
              label="Company name"
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Your company"
              optional
            />
            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />
            <FormField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              secureTextEntry
              autoComplete="password-new"
              textContentType="newPassword"
            />
            <Button title="Create Account" loading={isLoading} onPress={handleSignUp} />
          </View>

          <View style={styles.footer}>
            <Link href="/login" style={styles.link}>
              <ThemedText type="link">Already have an account? Sign in</ThemedText>
            </Link>
            <Link href="/about" style={styles.link}>
              <ThemedText type="link">About {AppConfig.appName}</ThemedText>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24, gap: 28, flexGrow: 1, justifyContent: 'center' },
  header: { gap: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, opacity: 0.8 },
  form: { gap: 16 },
  footer: { gap: 14, alignItems: 'center' },
  link: { paddingVertical: 2 },
});
