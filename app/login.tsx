import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { AppConfig, isDemoAvailable } from '@/constants/config';
import { useAuth } from '@/contexts/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInDemo, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn() {
    if (!email.trim() || !password) {
      Alert.alert('Missing information', 'Please enter your email and password.');
      return;
    }
    try {
      await signIn({ email, password });
    } catch (e) {
      Alert.alert('Sign in failed', e instanceof Error ? e.message : 'Please try again.');
    }
  }

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <ThemedText type="title">Sign in</ThemedText>
            <ThemedText style={styles.subtitle}>
              Use the credentials issued to your organization.
            </ThemedText>
          </View>

          <View style={styles.form}>
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
              placeholder="Your password"
              secureTextEntry
              autoComplete="password"
              textContentType="password"
            />
            <Button title="Sign In" loading={isLoading} onPress={handleSignIn} />
            {isDemoAvailable ? (
              <Button title="Try Demo" variant="ghost" loading={isLoading} onPress={signInDemo} />
            ) : null}
          </View>

          <View style={styles.footer}>
            {AppConfig.registrationEnabled ? (
              <Link href="/signup" style={styles.link}>
                <ThemedText type="link">New organization? Create an account</ThemedText>
              </Link>
            ) : (
              <Link href="/request-access" style={styles.link}>
                <ThemedText type="link">Don&apos;t have access yet? Request access</ThemedText>
              </Link>
            )}
            <ThemedText type="link" style={styles.link} onPress={() => router.push('/about')}>
              About {AppConfig.appName}
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: 24,
    gap: 28,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: { gap: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, opacity: 0.8 },
  form: { gap: 16 },
  footer: { gap: 14, alignItems: 'center' },
  link: { paddingVertical: 2 },
});
