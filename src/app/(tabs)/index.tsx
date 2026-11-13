import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Pill, Screen, SectionTitle, type IconName } from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { announcements, clearance, grades, schedule, semesters, student, tuition } from '@/data/sampleData';
import { formatPeso, formatShortDate, formatTime, weightedAverage } from '@/format';
import { colors, radius, spacing } from '@/theme';
import { todayWeekday, tuitionTotals } from '@/selectors';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const categoryTone = {
  Academic: 'maroon',
  Finance: 'gold',
  Event: 'success',
  Advisory: 'muted',
} as const;

export default function HomeScreen() {
  const { unreadCount } = useAppState();
  const today = todayWeekday();
  const todaysClasses = today
    ? schedule.filter((c) => c.days.includes(today)).sort((a, b) => a.start.localeCompare(b.start))
    : [];

  const current = grades[semesters[0].id] ?? [];
  const midtermAvg = weightedAverage(current.map((g) => ({ units: g.units, grade: g.mg })));
  const { balance } = tuitionTotals(tuition);
  const cleared = clearance.filter((o) => o.status === 'Cleared').length;

  return (
    <Screen title="NWU Student" subtitle="Northwestern University">
      <View style={styles.hero}>
        <Text style={styles.heroGreeting}>{greeting()},</Text>
        <Text style={styles.heroName}>{student.firstName}</Text>
        <View style={styles.heroMeta}>
          <Text style={styles.heroMetaText}>{student.id}</Text>
          <View style={styles.dot} />
          <Text style={styles.heroMetaText}>{student.section}</Text>
        </View>
        <Text style={styles.heroProgram}>{student.program}</Text>
        <View style={styles.termTag}>
          <Ionicons name="calendar-clear-outline" size={13} color={colors.maroon} />
          <Text style={styles.termTagText}>{student.currentTerm}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <StatTile
          icon="school-outline"
          label="Midterm average"
          value={midtermAvg ? midtermAvg.toFixed(2) : '—'}
          href="/grades"
        />
        <StatTile icon="wallet-outline" label="Balance" value={formatPeso(balance)} href="/tuition" />
        <StatTile
          icon="shield-checkmark-outline"
          label="Clearance"
          value={`${cleared} of ${clearance.length}`}
          href="/clearance"
        />
        <StatTile
          icon="chatbubbles-outline"
          label="Unread messages"
          value={String(unreadCount)}
          href="/messages"
        />
      </View>

      <SectionTitle>{`Today${today ? `, ${today}` : ''}`}</SectionTitle>
      <Card style={{ paddingVertical: spacing.sm }}>
        {todaysClasses.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cafe-outline" size={22} color={colors.textMuted} />
            <Text style={styles.emptyText}>No classes today.</Text>
          </View>
        ) : (
          todaysClasses.map((c, i) => (
            <View key={c.id} style={[styles.classRow, i > 0 && styles.classRowBorder]}>
              <View style={styles.classTime}>
                <Text style={styles.classTimeText}>{formatTime(c.start)}</Text>
                <Text style={styles.classTimeEnd}>{formatTime(c.end)}</Text>
              </View>
              <View style={styles.classBar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.classCode}>{c.code}</Text>
                <Text style={styles.classTitle} numberOfLines={1}>
                  {c.title}
                </Text>
                <Text style={styles.classMeta}>{c.room}</Text>
              </View>
            </View>
          ))
        )}
      </Card>

      <SectionTitle>Announcements</SectionTitle>
      {announcements.map((a) => (
        <Card key={a.id}>
          <View style={styles.annHead}>
            <Pill label={a.category} tone={categoryTone[a.category]} />
            <Text style={styles.annDate}>{formatShortDate(a.date)}</Text>
          </View>
          <Text style={styles.annTitle}>{a.title}</Text>
          <Text style={styles.annBody}>{a.body}</Text>
        </Card>
      ))}
    </Screen>
  );
}

function StatTile({ icon, label, value, href }: { icon: IconName; label: string; value: string; href: Href }) {
  return (
    <Card style={styles.tile} onPress={() => router.navigate(href)}>
      <View style={styles.tileIcon}>
        <Ionicons name={icon} size={18} color={colors.maroon} />
      </View>
      <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderLeftWidth: 5,
    borderLeftColor: colors.gold,
  },
  heroGreeting: { fontSize: 15, color: colors.textMuted },
  heroName: { fontSize: 26, fontWeight: '800', color: colors.maroon, marginTop: 2 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  heroMetaText: { fontSize: 14, color: colors.text, fontWeight: '600' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textMuted },
  heroProgram: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  termTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  termTagText: { fontSize: 12, fontWeight: '700', color: colors.maroon },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: { flexBasis: '45%', flexGrow: 1, gap: 4 },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.maroonSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tileValue: { fontSize: 20, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
  tileLabel: { fontSize: 13, color: colors.textMuted },
  empty: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 15 },
  classRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  classRowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  classTime: { width: 70 },
  classTimeText: { fontSize: 14, fontWeight: '700', color: colors.text },
  classTimeEnd: { fontSize: 12, color: colors.textMuted },
  classBar: { width: 3, alignSelf: 'stretch', borderRadius: 2, backgroundColor: colors.gold },
  classCode: { fontSize: 12, fontWeight: '700', color: colors.maroon },
  classTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  classMeta: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  annHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  annDate: { fontSize: 12, color: colors.textMuted },
  annTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  annBody: { fontSize: 14, color: colors.textMuted, marginTop: 4, lineHeight: 20 },
});
