import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, EmptyState, Icon, Pill, Screen, SectionTitle } from '@/components/ui';
import { schedule, student, type Weekday } from '@/data/sampleData';
import { formatTime } from '@/format';
import { WEEKDAYS, classStatuses, duration, todayWeekday } from '@/selectors';
import { colors, radius, spacing } from '@/theme';

const DAY_NAMES: Record<Weekday, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};

export default function ScheduleScreen() {
  const today = todayWeekday();
  const [day, setDay] = useState<Weekday>(today ?? 'Mon');
  const sorted = schedule
    .filter((c) => c.days.includes(day))
    .sort((a, b) => a.start.localeCompare(b.start));
  // Live status only makes sense for today's list.
  const classes = day === today ? classStatuses(sorted) : sorted.map((c) => ({ ...c, status: null }));
  const totalUnits = schedule.reduce((s, c) => s + c.units, 0);

  return (
    <Screen title="Class Schedule" subtitle={student.currentTerm}>
      <View style={styles.days} accessibilityRole="tablist">
        {WEEKDAYS.map((d) => {
          const count = schedule.filter((c) => c.days.includes(d)).length;
          const selected = d === day;
          const isToday = d === today;
          return (
            <Pressable
              key={d}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`${DAY_NAMES[d]}${isToday ? ', today' : ''}, ${count} ${count === 1 ? 'class' : 'classes'}`}
              onPress={() => setDay(d)}
              style={({ pressed }) => [styles.day, selected && styles.daySelected, pressed && !selected && styles.dayPressed]}>
              <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{d}</Text>
              <View style={styles.dots}>
                {count === 0 ? (
                  <View style={[styles.dotEmpty, selected && { borderColor: colors.onMaroonMuted }]} />
                ) : (
                  Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <View key={i} style={[styles.dotFull, selected && { backgroundColor: colors.gold }]} />
                  ))
                )}
              </View>
              {isToday ? <Text style={[styles.today, selected && { color: colors.gold }]}>Today</Text> : null}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.dayHeading} accessibilityRole="header">
        {DAY_NAMES[day]}
        <Text style={styles.dayCount}>
          {'  '}
          {classes.length} {classes.length === 1 ? 'class' : 'classes'}
        </Text>
      </Text>

      {classes.length === 0 ? (
        <Card>
          <EmptyState icon="sunny-outline" title={`No classes on ${DAY_NAMES[day]}`} body="Enjoy the free day." />
        </Card>
      ) : (
        classes.map((c) => {
          const done = c.status === 'done';
          const now = c.status === 'now';
          return (
            <Card
              key={c.id}
              style={[styles.classCard, now && styles.classCardNow]}>
              <View style={[styles.timeCol, now && { backgroundColor: colors.success }, done && styles.timeColDone]}>
                <Text style={styles.start}>{formatTime(c.start)}</Text>
                <View style={styles.timeRule} />
                <Text style={styles.end}>{formatTime(c.end)}</Text>
              </View>
              <View style={styles.body}>
                <View style={styles.codeRow}>
                  <Text style={styles.code}>{c.code}</Text>
                  {now ? (
                    <Pill label="In class" tone="success" icon="radio-button-on" />
                  ) : c.status === 'next' ? (
                    <Pill label="Up next" tone="gold" />
                  ) : done ? (
                    <Pill label="Done" tone="muted" icon="checkmark" />
                  ) : (
                    <Text style={styles.units}>{c.units} units</Text>
                  )}
                </View>
                <Text style={styles.title}>{c.title}</Text>
                <Meta icon="location-outline" text={c.room} />
                <Meta icon="person-outline" text={c.instructor} />
                <Meta icon="hourglass-outline" text={duration(c.start, c.end)} />
              </View>
            </Card>
          );
        })
      )}

      <SectionTitle>{`All subjects · ${totalUnits} units`}</SectionTitle>
      <Card style={{ paddingVertical: spacing.sm }}>
        {schedule.map((c, i) => (
          <View
            key={c.id}
            style={[styles.listRow, i > 0 && styles.listBorder]}
            accessible
            accessibilityLabel={`${c.code}, ${c.title}, ${c.days.map((d) => DAY_NAMES[d]).join(' and ')}, ${formatTime(c.start)} to ${formatTime(c.end)}`}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listCode}>{c.code}</Text>
              <Text style={styles.listTitle} numberOfLines={2}>
                {c.title}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.dayTags}>
                {c.days.map((d) => (
                  <View key={d} style={styles.dayTag}>
                    <Text style={styles.dayTagText}>{d}</Text>
                  </View>
                ))}
              </View>
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

function Meta({ icon, text }: { icon: 'location-outline' | 'person-outline' | 'hourglass-outline'; text: string }) {
  return (
    <View style={styles.meta}>
      <Icon name={icon} size={14} color={colors.textMuted} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  days: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  day: {
    flex: 1,
    minHeight: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 4,
  },
  daySelected: { backgroundColor: colors.maroon },
  dayPressed: { backgroundColor: colors.maroonSoft },
  dayText: { fontSize: 14, fontWeight: '700', color: colors.text },
  dayTextSelected: { color: '#fff' },
  dots: { flexDirection: 'row', gap: 3, height: 6, alignItems: 'center' },
  dotFull: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.maroon },
  dotEmpty: { width: 5, height: 5, borderRadius: 3, borderWidth: 1, borderColor: colors.border },
  today: { fontSize: 9, fontWeight: '800', color: colors.maroon, textTransform: 'uppercase', letterSpacing: 0.5 },
  dayHeading: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: -spacing.sm },
  dayCount: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  classCard: { flexDirection: 'row', gap: spacing.lg, padding: 0, overflow: 'hidden' },
  classCardNow: { borderColor: colors.success, borderWidth: 1.5 },
  timeCol: {
    width: 88,
    backgroundColor: colors.maroon,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  timeColDone: { backgroundColor: colors.maroonDark },
  start: { color: '#fff', fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] },
  timeRule: { width: 16, height: 2, borderRadius: 1, backgroundColor: colors.gold },
  end: { color: colors.onMaroonMuted, fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] },
  body: { flex: 1, paddingVertical: spacing.lg, paddingRight: spacing.lg, gap: 4 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  code: { fontSize: 12, fontWeight: '800', color: colors.maroon },
  units: { fontSize: 12, color: colors.textMuted },
  title: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, color: colors.textMuted, flexShrink: 1 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  listBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  listCode: { fontSize: 12, fontWeight: '700', color: colors.maroon },
  listTitle: { fontSize: 14, color: colors.text },
  dayTags: { flexDirection: 'row', gap: 4, marginBottom: 3 },
  dayTag: { backgroundColor: colors.maroonSoft, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  dayTagText: { fontSize: 11, fontWeight: '700', color: colors.maroon },
  listTime: { fontSize: 12, color: colors.textMuted, fontVariant: ['tabular-nums'] },
});
