import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { AppConfig, hasBackend } from '@/constants/config';
import { useAuth } from '@/contexts/auth-context';

export default function RequestAccessScreen() {
  const router = useRouter();
  const { requestAccess, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit() {
    if (!fullName.trim() || !email.trim() || !companyName.trim()) {
      Alert.alert('Missing information', 'Please provide your full name, email, and company name.');
      return;
    }

    try {
      await requestAccess({ fullName, email, companyName, role, message });

      if (hasBackend) {
        Alert.alert(
          'Request submitted',
          'Your request has been submitted. Our team will contact you after review.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      // No backend yet: fall back to a contact email and tell the user clearly.
      const subject = encodeURIComponent(`Access request — ${companyName}`);
      const body = encodeURIComponent(
        `Full name: ${fullName}\nEmail: ${email}\nCompany: ${companyName}\nRole: ${role || '-'}\n\n${message || ''}`
      );
      const mailto = `mailto:${AppConfig.salesEmail}?subject=${subject}&body=${body}`;
      const canOpen = await Linking.canOpenURL(mailto).catch(() => false);

      Alert.alert(
        'Almost done',
        canOpen
          ? `We don't have automated provisioning yet, so we'll open your email app to send this request to ${AppConfig.salesEmail}. Our team will contact you after review.`
          : `Please email your request to ${AppConfig.salesEmail}. Our team will contact you after review.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: canOpen ? 'Open email' : 'OK',
            onPress: () => {
              if (canOpen) Linking.openURL(mailto);
              router.back();
            },
          },
        ]
      );
    } catch (e) {
      Alert.alert('Could not submit', e instanceof Error ? e.message : 'Please try again.');
    }
  }

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <ThemedText type="title">Request access</ThemedText>
            <ThemedText style={styles.subtitle}>
              Tell us about your organization and our team will get you set up after review.
            </ThemedText>
          </View>

          <View style={styles.form}>
            <FormField label="Full name" value={fullName} onChangeText={setFullName} placeholder="Jane Driver" />
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
            <FormField label="Company name" value={companyName} onChangeText={setCompanyName} placeholder="Your company" />
            <FormField label="Role" value={role} onChangeText={setRole} placeholder="Fleet manager, owner, driver..." optional />
            <FormField
              label="Message"
              value={message}
              onChangeText={setMessage}
              placeholder="Anything we should know?"
              multiline
              numberOfLines={4}
              style={styles.multiline}
              optional
            />
            <Button title="Submit Request" loading={isLoading} onPress={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24, gap: 24 },
  header: { gap: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, opacity: 0.8 },
  form: { gap: 16 },
  multiline: { minHeight: 100, paddingTop: 12, textAlignVertical: 'top' },
});
