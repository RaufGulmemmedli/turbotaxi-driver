import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppConfig } from '@/constants/config';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}>
        <View style={styles.header}>
          <ThemedText type="title">Dashboard</ThemedText>
          <ThemedText style={styles.subtitle}>
            {user?.companyName
              ? `Signed in for ${user.companyName}`
              : `Welcome${user?.fullName ? `, ${user.fullName}` : ''}`}
            {user?.isDemo ? '  ·  Demo mode' : ''}
          </ThemedText>
        </View>

        <View style={styles.cards}>
          <Card title="Today's trips" value="0" hint="Trips assigned to you today" />
          <Card title="Status" value="Offline" hint="Go online to start receiving trips" />
          <Card title="Earnings" value="—" hint="Operational data for your organization" />
        </View>

        <ThemedText style={styles.note}>
          Core operational features (fleet, trips, and driver data) belong to {AppConfig.appName}{' '}
          organizations and are only available to approved accounts.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

function Card({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText style={styles.cardValue}>{value}</ThemedText>
      <ThemedText style={styles.cardHint}>{hint}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24, gap: 24 },
  header: { gap: 6 },
  subtitle: { fontSize: 15, opacity: 0.8 },
  cards: { gap: 14 },
  card: {
    borderRadius: 14,
    padding: 18,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#80808033',
  },
  cardTitle: { fontSize: 14, opacity: 0.7 },
  cardValue: { fontSize: 28, fontWeight: '700' },
  cardHint: { fontSize: 13, opacity: 0.6 },
  note: { fontSize: 13, lineHeight: 20, opacity: 0.7 },
});
