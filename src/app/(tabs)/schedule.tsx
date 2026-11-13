import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Chip, Screen, SectionTitle } from '@/components/ui';
import { schedule, student, type Weekday } from '@/data/sampleData';
import { formatTime } from '@/format';
import { WEEKDAYS, todayWeekday } from '@/selectors';
import { colors, radius, spacing } from '@/theme';

export default function ScheduleScreen() {
  const [day, setDay] = useState<Weekday>(todayWeekday() ?? 'Mon');
  const classes = schedule
    .filter((c) => c.days.includes(day))
    .sort((a, b) => a.start.localeCompare(b.start));
  const totalUnits = schedule.reduce((s, c) => s + c.units, 0);

  return (
    <Screen title="Class Schedule" subtitle={student.currentTerm}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
        {WEEKDAYS.map((d) => (
          <Chip key={d} label={d} selected={d === day} onPress={() => setDay(d)} />
        ))}
      </ScrollView>

      {classes.length === 0 ? (
        <Card style={styles.empty}>
          <Ionicons name="sunny-outline" size={28} color={colors.gold} />
          <Text style={styles.emptyTitle}>No classes on {day}</Text>
          <Text style={styles.emptyBody}>Enjoy the free day.</Text>
        </Card>
      ) : (
        classes.map((c) => (
          <Card key={c.id} style={styles.classCard}>
            <View style={styles.timeCol}>
              <Text style={styles.start}>{formatTime(c.start)}</Text>
              <Text style={styles.end}>{formatTime(c.end)}</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.codeRow}>
                <Text style={styles.code}>{c.code}</Text>
                <Text style={styles.units}>{c.units} units</Text>
              </View>
              <Text style={styles.title}>{c.title}</Text>
              <Meta icon="location-outline" text={c.room} />
              <Meta icon="person-outline" text={c.instructor} />
            </View>
          </Card>
        ))
      )}

      <SectionTitle>{`All subjects · ${totalUnits} units`}</SectionTitle>
      <Card style={{ paddingVertical: spacing.sm }}>
        {schedule.map((c, i) => (
          <View key={c.id} style={[styles.listRow, i > 0 && styles.listBorder]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listCode}>{c.code}</Text>
              <Text style={styles.listTitle} numberOfLines={1}>
                {c.title}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.listDays}>{c.days.join(' / ')}</Text>
              <Text style={styles.listTime}>
                {formatTime(c.start)} to {formatTime(c.end)}
              </Text>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

function Meta({ icon, text }: { icon: 'location-outline' | 'person-outline'; text: string }) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} size={14} color={colors.textMuted} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  days: { gap: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.xs },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  emptyBody: { fontSize: 14, color: colors.textMuted },
  classCard: { flexDirection: 'row', gap: spacing.lg, padding: 0, overflow: 'hidden' },
  timeCol: {
    width: 88,
    backgroundColor: colors.maroon,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
  },
  start: { color: '#fff', fontSize: 15, fontWeight: '700' },
  end: { color: colors.gold, fontSize: 12, marginTop: 4, fontWeight: '600' },
  body: { flex: 1, paddingVertical: spacing.lg, paddingRight: spacing.lg, gap: 4 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  code: { fontSize: 12, fontWeight: '800', color: colors.maroon },
  units: { fontSize: 12, color: colors.textMuted },
  title: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, color: colors.textMuted },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  listBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  listCode: { fontSize: 12, fontWeight: '700', color: colors.maroon },
  listTitle: { fontSize: 14, color: colors.text },
  listDays: { fontSize: 13, fontWeight: '600', color: colors.text },
  listTime: { fontSize: 12, color: colors.textMuted },
});
