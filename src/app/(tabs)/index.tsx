import { router, type Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Avatar,
  Card,
  EmptyState,
  Icon,
  Pill,
  Screen,
  SectionTitle,
  toneColors,
  type IconName,
  type Tone,
} from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { announcements, clearance, grades, schedule, semesters, student, tuition } from '@/data/sampleData';
import { formatPeso, formatShortDate, formatTime, weightedAverage } from '@/format';
import { classStatuses, todayWeekday, tuitionTotals, type ClassStatus } from '@/selectors';
import { colors, radius, shadowRaised, spacing } from '@/theme';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const categoryStyle: Record<(typeof announcements)[number]['category'], { tone: Tone; icon: IconName }> = {
  Academic: { tone: 'maroon', icon: 'book-outline' },
  Finance: { tone: 'gold', icon: 'cash-outline' },
  Event: { tone: 'success', icon: 'sparkles-outline' },
  Advisory: { tone: 'muted', icon: 'megaphone-outline' },
};

const statusPill: Record<ClassStatus, { label: string; tone: Tone } | null> = {
  now: { label: 'In class', tone: 'success' },
  next: { label: 'Up next', tone: 'gold' },
  done: { label: 'Done', tone: 'muted' },
  later: null,
};

export default function HomeScreen() {
  const { unreadCount } = useAppState();
  const today = todayWeekday();
  const todaysClasses = classStatuses(
    today
      ? schedule.filter((c) => c.days.includes(today)).sort((a, b) => a.start.localeCompare(b.start))
      : [],
  );
  const upcoming = todaysClasses.find((c) => c.status === 'now') ?? todaysClasses.find((c) => c.status === 'next');

  const current = grades[semesters[0].id] ?? [];
  const midtermAvg = weightedAverage(current.map((g) => ({ units: g.units, grade: g.mg })));
  const { balance, nextDue } = tuitionTotals(tuition);
  const cleared = clearance.filter((o) => o.status === 'Cleared').length;
  const pendingClearance = clearance.length - cleared;

  return (
    <Screen title="NWU Student" subtitle="Northwestern University">
      <LinearGradient
        colors={[colors.maroonBright, colors.maroon, colors.maroonDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.heroGlow} />
        <View style={styles.heroTop}>
          <Avatar name={`${student.firstName} ${student.lastName}`} size={52} tone="gold" ring />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroGreeting}>{greeting()},</Text>
            <Text style={styles.heroName} numberOfLines={1}>
              {student.firstName}
            </Text>
          </View>
        </View>
        <View style={styles.heroMeta}>
          <Text style={styles.heroMetaText}>{student.id}</Text>
          <View style={styles.dot} />
          <Text style={styles.heroMetaText}>{student.section}</Text>
        </View>
        <Text style={styles.heroProgram}>{student.program}</Text>
        <View style={styles.termTag}>
          <Icon name="calendar-clear-outline" size={13} color={colors.maroon} />
          <Text style={styles.termTagText}>{student.currentTerm}</Text>
        </View>

        {upcoming ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${upcoming.status === 'now' ? 'In class now' : 'Up next'}: ${upcoming.title}, ${formatTime(upcoming.start)}, room ${upcoming.room}`}
            accessibilityHint="Opens your class schedule"
            onPress={() => router.navigate('/schedule')}
            style={({ pressed }) => [styles.upNext, pressed && { opacity: 0.85 }]}>
            <View style={styles.upNextIcon}>
              <Icon name={upcoming.status === 'now' ? 'radio-button-on' : 'time-outline'} size={18} color={colors.maroon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.upNextLabel}>{upcoming.status === 'now' ? 'In class now' : 'Up next'}</Text>
              <Text style={styles.upNextTitle} numberOfLines={1}>
                {upcoming.code} · {upcoming.title}
              </Text>
              <Text style={styles.upNextMeta}>
                {formatTime(upcoming.start)} to {formatTime(upcoming.end)} · {upcoming.room}
              </Text>
            </View>
            <Icon name="chevron-forward" size={18} color={colors.gold} />
          </Pressable>
        ) : null}
      </LinearGradient>

      <View style={styles.grid}>
        <StatTile
          icon="school-outline"
          label="Midterm average"
          value={midtermAvg ? midtermAvg.toFixed(2) : '—'}
          caption={`${current.length} subjects`}
          href="/grades"
        />
        <StatTile
          icon="wallet-outline"
          label="Balance"
          value={formatPeso(balance)}
          caption={nextDue ? `Next due ${formatShortDate(nextDue.dueDate)}` : 'Fully paid'}
          tone={nextDue ? 'gold' : 'success'}
          href="/tuition"
        />
        <StatTile
          icon="shield-checkmark-outline"
          label="Clearance"
          value={`${cleared} of ${clearance.length}`}
          caption={pendingClearance ? `${pendingClearance} with obligation` : 'Fully cleared'}
          tone={pendingClearance ? 'danger' : 'success'}
          href="/clearance"
        />
        <StatTile
          icon="chatbubbles-outline"
          label="Messages"
          value={String(unreadCount)}
          caption={unreadCount === 1 ? 'unread message' : 'unread messages'}
          href="/messages"
        />
      </View>

      <SectionTitle
        action={
          <Pressable
            accessibilityRole="link"
            onPress={() => router.navigate('/schedule')}
            hitSlop={12}
            style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Text style={styles.link}>Full schedule</Text>
          </Pressable>
        }>{`Today${today ? `, ${today}` : ''}`}</SectionTitle>
      <Card style={{ paddingVertical: spacing.sm }}>
        {todaysClasses.length === 0 ? (
          <EmptyState icon="cafe-outline" title="No classes today" body="Rest up, or catch up on readings." />
        ) : (
          todaysClasses.map((c, i) => {
            const pill = statusPill[c.status];
            const done = c.status === 'done';
            return (
              <View
                key={c.id}
                style={[styles.classRow, i > 0 && styles.classRowBorder]}
                accessible
                accessibilityLabel={`${c.code}, ${c.title}, ${formatTime(c.start)} to ${formatTime(c.end)}, ${c.room}${pill ? `, ${pill.label}` : ''}`}>
                <View style={styles.classTime}>
                  <Text style={[styles.classTimeText, done && styles.dim]}>{formatTime(c.start)}</Text>
                  <Text style={styles.classTimeEnd}>{formatTime(c.end)}</Text>
                </View>
                <View
                  style={[
                    styles.classBar,
                    c.status === 'now' && { backgroundColor: colors.success },
                    done && { backgroundColor: colors.border },
                  ]}
                />
                <View style={{ flex: 1, gap: 1 }}>
                  <View style={styles.classHead}>
                    <Text style={styles.classCode}>{c.code}</Text>
                    {pill ? <Pill label={pill.label} tone={pill.tone} /> : null}
                  </View>
                  <Text style={[styles.classTitle, done && styles.dim]} numberOfLines={1}>
                    {c.title}
                  </Text>
                  <Text style={styles.classMeta}>{c.room}</Text>
                </View>
              </View>
            );
          })
        )}
      </Card>

      <SectionTitle>Announcements</SectionTitle>
      {announcements.map((a) => {
        const cat = categoryStyle[a.category];
        return (
          <Card key={a.id} style={styles.ann}>
            <View style={[styles.annIcon, { backgroundColor: toneBg(cat.tone) }]}>
              <Icon name={cat.icon} size={18} color={toneFg(cat.tone)} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.annHead}>
                <Pill label={a.category} tone={cat.tone} />
                <Text style={styles.annDate}>{formatShortDate(a.date)}</Text>
              </View>
              <Text style={styles.annTitle}>{a.title}</Text>
              <Text style={styles.annBody}>{a.body}</Text>
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const toneBg = (t: Tone) => toneColors[t].bg;
const toneFg = (t: Tone) => toneColors[t].fg;

function StatTile({
  icon,
  label,
  value,
  caption,
  href,
  tone = 'maroon',
}: {
  icon: IconName;
  label: string;
  value: string;
  caption: string;
  href: Href;
  tone?: Tone;
}) {
  return (
    <Card
      style={styles.tile}
      onPress={() => router.navigate(href)}
      accessibilityLabel={`${label}: ${value}, ${caption}`}
      accessibilityHint={`Opens ${label.toLowerCase()}`}>
      <View style={styles.tileTop}>
        <View style={[styles.tileIcon, { backgroundColor: toneBg(tone) }]}>
          <Icon name={icon} size={18} color={toneFg(tone)} />
        </View>
        <Icon name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={[styles.tileCaption, { color: tone === 'maroon' ? colors.textMuted : toneFg(tone) }]} numberOfLines={1}>
        {caption}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    ...shadowRaised,
  },
  heroGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    right: -70,
    top: -90,
    borderWidth: 28,
    borderColor: 'rgba(242, 183, 5, 0.1)',
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  heroGreeting: { fontSize: 14, color: colors.onMaroonMuted },
  heroName: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 1 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
  heroMetaText: { fontSize: 14, color: '#fff', fontWeight: '700', fontVariant: ['tabular-nums'] },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.gold },
  heroProgram: { fontSize: 14, color: colors.onMaroonMuted, marginTop: 2 },
  termTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  termTagText: { fontSize: 12, fontWeight: '700', color: colors.maroon },
  upNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(242, 183, 5, 0.45)',
    minHeight: 44,
  },
  upNextIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upNextLabel: { fontSize: 11, fontWeight: '800', color: colors.gold, textTransform: 'uppercase', letterSpacing: 0.8 },
  upNextTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginTop: 1 },
  upNextMeta: { fontSize: 13, color: colors.onMaroonMuted, marginTop: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: { flexBasis: '45%', flexGrow: 1, gap: 2 },
  tileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  tileIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  tileValue: { fontSize: 21, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
  tileCaption: { fontSize: 12, fontWeight: '600' },
  link: { fontSize: 13, fontWeight: '700', color: colors.maroon },
  classRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  classRowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  classTime: { width: 70 },
  classTimeText: { fontSize: 14, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] },
  classTimeEnd: { fontSize: 12, color: colors.textMuted, fontVariant: ['tabular-nums'] },
  classBar: { width: 3, alignSelf: 'stretch', borderRadius: 2, backgroundColor: colors.gold },
  classHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  classCode: { fontSize: 12, fontWeight: '700', color: colors.maroon },
  classTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  classMeta: { fontSize: 13, color: colors.textMuted },
  dim: { color: colors.textMuted },
  ann: { flexDirection: 'row', gap: spacing.md },
  annIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  annHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  annDate: { fontSize: 12, color: colors.textMuted },
  annTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  annBody: { fontSize: 14, color: colors.textMuted, marginTop: 4, lineHeight: 20 },
});
