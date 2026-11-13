import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Card, Chip, EmptyState, Icon, Screen } from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { messages } from '@/data/sampleData';
import { formatShortDate } from '@/format';
import { colors, spacing } from '@/theme';

type Filter = 'All' | 'Unread';

export default function MessagesScreen() {
  const { readMessageIds, unreadCount } = useAppState();
  const [filter, setFilter] = useState<Filter>('All');
  const list = filter === 'All' ? messages : messages.filter((m) => !readMessageIds.has(m.id));

  return (
    <Screen title="Messages" subtitle={unreadCount ? `${unreadCount} unread` : 'All caught up'}>
      <View style={styles.filters}>
        <Chip label="All" count={messages.length} selected={filter === 'All'} onPress={() => setFilter('All')} />
        <Chip label="Unread" count={unreadCount} selected={filter === 'Unread'} onPress={() => setFilter('Unread')} />
      </View>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {list.length === 0 ? (
          <EmptyState icon="mail-open-outline" title="You're all caught up" body="No unread messages." />
        ) : (
          list.map((m, i) => {
            const unread = !readMessageIds.has(m.id);
            return (
              <Pressable
                key={m.id}
                accessibilityRole="button"
                accessibilityLabel={`${unread ? 'Unread. ' : ''}From ${m.from}, ${m.role}. ${m.subject}. ${formatShortDate(m.date)}.`}
                accessibilityHint="Opens the message"
                onPress={() => router.push({ pathname: '/message/[id]', params: { id: m.id } })}
                android_ripple={{ color: colors.maroonSoft }}
                style={({ pressed }) => [
                  styles.row,
                  i > 0 && styles.border,
                  unread && styles.rowUnread,
                  pressed && styles.pressed,
                ]}>
                {unread ? <View style={styles.accent} /> : null}
                <Avatar name={m.from} tone={unread ? 'gold' : 'muted'} ring={unread} />
                <View style={{ flex: 1 }}>
                  <View style={styles.head}>
                    <Text style={[styles.from, unread && styles.bold]} numberOfLines={1}>
                      {m.from}
                    </Text>
                    <Text style={[styles.date, unread && { color: colors.maroon, fontWeight: '700' }]}>
                      {formatShortDate(m.date)}
                    </Text>
                  </View>
                  <Text style={styles.role} numberOfLines={1}>
                    {m.role}
                  </Text>
                  <Text style={[styles.subject, unread && styles.bold]} numberOfLines={1}>
                    {m.subject}
                  </Text>
                  <Text style={styles.preview} numberOfLines={2}>
                    {m.preview}
                  </Text>
                </View>
                <View style={styles.trail}>
                  {unread ? <View style={styles.dot} /> : <View style={{ height: 10 }} />}
                  <Icon name="chevron-forward" size={16} color={colors.textMuted} />
                </View>
              </Pressable>
            );
          })
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', padding: spacing.lg },
  rowUnread: { backgroundColor: '#FFFCF3' },
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.gold },
  pressed: { backgroundColor: colors.background },
  border: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  head: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  from: { flex: 1, fontSize: 15, color: colors.text },
  role: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  bold: { fontWeight: '800' },
  date: { fontSize: 12, color: colors.textMuted },
  subject: { fontSize: 14, color: colors.text, marginTop: 4 },
  preview: { fontSize: 13, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  trail: { alignItems: 'center', justifyContent: 'space-between', alignSelf: 'stretch', paddingTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.maroon },
});
