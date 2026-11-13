import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Screen } from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { messages } from '@/data/sampleData';
import { formatShortDate, initials } from '@/format';
import { colors, spacing } from '@/theme';

export default function MessagesScreen() {
  const { readMessageIds, unreadCount } = useAppState();

  return (
    <Screen title="Messages" subtitle={unreadCount ? `${unreadCount} unread` : 'All caught up'}>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {messages.map((m, i) => {
          const unread = !readMessageIds.has(m.id);
          return (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/message/[id]', params: { id: m.id } })}
              style={({ pressed }) => [styles.row, i > 0 && styles.border, pressed && styles.pressed]}>
              <View style={[styles.avatar, unread && styles.avatarUnread]}>
                <Text style={[styles.avatarText, unread && { color: colors.maroon }]}>{initials(m.from)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.head}>
                  <Text style={[styles.from, unread && styles.bold]} numberOfLines={1}>
                    {m.from}
                  </Text>
                  <Text style={[styles.date, unread && { color: colors.maroon, fontWeight: '700' }]}>
                    {formatShortDate(m.date)}
                  </Text>
                </View>
                <Text style={[styles.subject, unread && styles.bold]} numberOfLines={1}>
                  {m.subject}
                </Text>
                <Text style={styles.preview} numberOfLines={2}>
                  {m.preview}
                </Text>
              </View>
              {unread ? <View style={styles.dot} /> : null}
            </Pressable>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', padding: spacing.lg },
  pressed: { backgroundColor: colors.background },
  border: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFEAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarUnread: { backgroundColor: colors.goldSoft, borderWidth: 2, borderColor: colors.gold },
  avatarText: { fontSize: 15, fontWeight: '800', color: colors.textMuted },
  head: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  from: { flex: 1, fontSize: 15, color: colors.text },
  bold: { fontWeight: '800' },
  date: { fontSize: 12, color: colors.textMuted },
  subject: { fontSize: 14, color: colors.text, marginTop: 1 },
  preview: { fontSize: 13, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.maroon, marginTop: 6 },
});
