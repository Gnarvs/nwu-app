import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Page } from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { messages } from '@/data/sampleData';
import { formatDate, formatTime, initials } from '@/format';
import { colors, spacing } from '@/theme';

export default function MessageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { markMessageRead } = useAppState();
  const message = messages.find((m) => m.id === id);

  useEffect(() => {
    if (message) markMessageRead(message.id);
  }, [message, markMessageRead]);

  if (!message) {
    return (
      <Page>
        <Text style={styles.missing}>This message could not be found.</Text>
      </Page>
    );
  }

  // Show the time as written in the record (Philippine time), not the device's timezone.
  const time = formatTime(message.date.slice(11, 16));

  return (
    <Page>
      <Stack.Screen options={{ title: message.from }} />
      <Card>
        <Text style={styles.subject}>{message.subject}</Text>
        <View style={styles.sender}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(message.from)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.from}>{message.from}</Text>
            <Text style={styles.role}>{message.role}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.date}>{formatDate(message.date)}</Text>
            <Text style={styles.date}>{time}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.body}>{message.body}</Text>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  missing: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
  subject: { fontSize: 20, fontWeight: '800', color: colors.text },
  sender: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.lg },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.goldSoft,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: colors.maroon },
  from: { fontSize: 15, fontWeight: '700', color: colors.text },
  role: { fontSize: 13, color: colors.textMuted },
  date: { fontSize: 12, color: colors.textMuted },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.lg },
  body: { fontSize: 15, color: colors.text, lineHeight: 23 },
});
