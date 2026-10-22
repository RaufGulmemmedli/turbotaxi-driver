import { Link, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { AppConfig, isDemoAvailable } from '@/constants/config';
import { useAuth } from '@/contexts/auth-context';

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signInDemo, isLoading } = useAuth();

  return (
    <ThemedView style={styles.flex}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 },
        ]}>
        <View style={styles.hero}>
          <ThemedText type="title">{AppConfig.appName}</ThemedText>
          <ThemedText style={styles.tagline}>{AppConfig.tagline}</ThemedText>
        </View>

        <View style={styles.bullets}>
          <Bullet text="Not limited to a single company — open to any qualifying transport business." />
          <Bullet text="Built for taxi companies, fleet managers, drivers, and transport service providers." />
          <Bullet text="New organizations can create an account or request access. Existing users sign in with their credentials." />
        </View>

        <View style={styles.actions}>
          <Button title="Sign In" onPress={() => router.push('/login')} />

          {AppConfig.registrationEnabled ? (
            <Button
              title="Create Account"
              variant="secondary"
              onPress={() => router.push('/signup')}
            />
          ) : (
            <Button
              title="Request Access"
              variant="secondary"
              onPress={() => router.push('/request-access')}
            />
          )}

          {isDemoAvailable ? (
            <Button title="Try Demo" variant="ghost" loading={isLoading} onPress={signInDemo} />
          ) : null}
        </View>

        <View style={styles.links}>
          <Link href="/about" style={styles.link}>
            <ThemedText type="link">About App / Learn More</ThemedText>
          </Link>
          {AppConfig.registrationEnabled ? (
            <Link href="/request-access" style={styles.link}>
              <ThemedText type="link">Request Access for your organization</ThemedText>
            </Link>
          ) : null}
          <ThemedText
            type="link"
            style={styles.link}
            onPress={() => Linking.openURL(`mailto:${AppConfig.salesEmail}`)}>
            Contact Sales
          </ThemedText>
          <ThemedText
            type="link"
            style={styles.link}
            onPress={() => Linking.openURL(`mailto:${AppConfig.supportEmail}`)}>
            Contact Support
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <ThemedText style={styles.bulletDot}>{'\u2022'}</ThemedText>
      <ThemedText style={styles.bulletText}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    gap: 28,
  },
  hero: {
    gap: 10,
  },
  tagline: {
    fontSize: 17,
    lineHeight: 24,
    opacity: 0.8,
  },
  bullets: {
    gap: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
  links: {
    gap: 14,
    alignItems: 'center',
  },
  link: {
    paddingVertical: 2,
  },
});
