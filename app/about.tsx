import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppConfig } from '@/constants/config';

export default function AboutScreen() {
  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">{AppConfig.appName}</ThemedText>
        <ThemedText style={styles.tagline}>{AppConfig.tagline}</ThemedText>

        <Section title="Who is it for?">
          <ThemedText style={styles.body}>
            {AppConfig.appName} is a B2B platform that is not limited to one company. Taxi companies,
            fleet managers, drivers, and transport service providers can all use it to manage their
            operations.
          </ThemedText>
        </Section>

        <Section title="How do I get an account?">
          <ThemedText style={styles.body}>
            {AppConfig.registrationEnabled
              ? 'Any qualifying organization can create an account directly from the sign-up screen. Existing users sign in with the credentials issued to their organization.'
              : 'New organizations can request access from the “Request Access” screen. After review, our team sets up the account, and users can then sign in with their credentials.'}
          </ThemedText>
        </Section>

        <Section title="What can I do without an account?">
          <ThemedText style={styles.body}>
            Anyone can read about the platform, see who can use it, request access, create an account
            (when registration is enabled), try the demo, and contact our team — all without signing
            in.
          </ThemedText>
        </Section>

        <Section title="What needs an account?">
          <ThemedText style={styles.body}>
            Core operational features require an approved account because they manage company fleet,
            trip, and driver data that is private to each organization.
          </ThemedText>
        </Section>

        <Section title="Contact">
          <ThemedText
            type="link"
            style={styles.body}
            onPress={() => Linking.openURL(`mailto:${AppConfig.salesEmail}`)}>
            Sales: {AppConfig.salesEmail}
          </ThemedText>
          <ThemedText
            type="link"
            style={styles.body}
            onPress={() => Linking.openURL(`mailto:${AppConfig.supportEmail}`)}>
            Support: {AppConfig.supportEmail}
          </ThemedText>
          <ThemedText
            type="link"
            style={styles.body}
            onPress={() => Linking.openURL(AppConfig.website)}>
            {AppConfig.website}
          </ThemedText>
        </Section>
      </ScrollView>
    </ThemedView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: 24,
    gap: 22,
  },
  tagline: {
    fontSize: 17,
    lineHeight: 24,
    opacity: 0.8,
  },
  section: {
    gap: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
});
