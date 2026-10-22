import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { AppConfig } from '@/constants/config';
import { useAuth } from '@/contexts/auth-context';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signOut, deleteAccount } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  async function performDelete() {
    setIsDeleting(true);
    try {
      await deleteAccount();
      // Session is cleared inside deleteAccount(); the route guards reset
      // navigation to the public landing screen automatically.
    } catch {
      Alert.alert('Unable to delete account', 'Unable to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Account', style: 'destructive', onPress: performDelete },
      ]
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}>
        <View style={styles.header}>
          <ThemedText type="title">Account</ThemedText>
          {user ? (
            <View style={styles.userBox}>
              {user.fullName ? <ThemedText style={styles.userName}>{user.fullName}</ThemedText> : null}
              <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
              {user.companyName ? (
                <ThemedText style={styles.userMeta}>{user.companyName}</ThemedText>
              ) : null}
              {user.isDemo ? <ThemedText style={styles.userMeta}>Demo account</ThemedText> : null}
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Button
            title={`About ${AppConfig.appName}`}
            variant="secondary"
            onPress={() => router.push('/about')}
          />
          <Button
            title="Contact Support"
            variant="ghost"
            onPress={() => Linking.openURL(`mailto:${AppConfig.supportEmail}`)}
          />
          <Button title="Sign Out" variant="ghost" onPress={signOut} disabled={isDeleting} />
        </View>

        <View style={styles.dangerZone}>
          <ThemedText style={styles.dangerHint}>
            Deleting your account permanently removes your access. This cannot be undone.
          </ThemedText>
          <Button
            title="Delete Account"
            variant="danger"
            loading={isDeleting}
            onPress={confirmDelete}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24, gap: 28 },
  header: { gap: 12 },
  userBox: { gap: 4 },
  userName: { fontSize: 18, fontWeight: '600' },
  userEmail: { fontSize: 15, opacity: 0.8 },
  userMeta: { fontSize: 14, opacity: 0.6 },
  actions: { gap: 12 },
  dangerZone: { gap: 10, marginTop: 8 },
  dangerHint: { fontSize: 13, lineHeight: 19, opacity: 0.7 },
});
