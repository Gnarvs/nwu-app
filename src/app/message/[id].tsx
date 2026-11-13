import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar, Card, EmptyState, Page } from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { messages } from '@/data/sampleData';
import { formatDate, formatTime } from '@/format';
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
        <Card>
          <EmptyState icon="mail-unread-outline" title="Message not found" body="It may have been removed." />
        </Card>
      </Page>
    );
  }

  // Show the time as written in the record (Philippine time), not the device's timezone.
  const time = formatTime(message.date.slice(11, 16));

  return (
    <Page>
      <Stack.Screen options={{ title: message.from }} />
      <Card>
        <Text style={styles.subject} accessibilityRole="header">
          {message.subject}
        </Text>
        <View style={styles.sender}>
          <Avatar name={message.from} tone="gold" ring />
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
  subject: { fontSize: 20, fontWeight: '800', color: colors.text, lineHeight: 26 },
  sender: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.lg },
  from: { fontSize: 15, fontWeight: '700', color: colors.text },
  role: { fontSize: 13, color: colors.textMuted },
  date: { fontSize: 12, color: colors.textMuted },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.lg },
  body: { fontSize: 16, color: colors.text, lineHeight: 25, maxWidth: 640 },
});
