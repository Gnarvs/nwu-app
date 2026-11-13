import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Dropdown } from '@/components/dropdown';
import { Card, Icon, Pill, Screen } from '@/components/ui';
import { grades, semesters, type GradeRow } from '@/data/sampleData';
import { formatGrade, weightedAverage } from '@/format';
import { colors, radius, spacing } from '@/theme';

const remarksTone = {
  Passed: 'success',
  Failed: 'danger',
  INC: 'gold',
  'In Progress': 'muted',
} as const;

const PERIODS = [
  { key: 'pg', short: 'PG', long: 'Prelim' },
  { key: 'mg', short: 'MG', long: 'Midterm' },
  { key: 'fg', short: 'FG', long: 'Final' },
] as const;

export default function GradesScreen() {
  const [semesterId, setSemesterId] = useState(semesters[0].id);
  const rows = grades[semesterId] ?? [];
  const units = rows.reduce((s, r) => s + r.units, 0);
  const finalsPosted = rows.length > 0 && rows.every((r) => r.fg !== null);
  const gwa = finalsPosted ? weightedAverage(rows.map((r) => ({ units: r.units, grade: r.fg }))) : null;
  const midterm = weightedAverage(rows.map((r) => ({ units: r.units, grade: r.mg })));
  // Hide the remarks pill when every subject is simply still in progress: it says nothing new.
  const allInProgress = rows.every((r) => r.remarks === 'In Progress');

  return (
    <Screen title="Grades" subtitle="Prelim, midterm and final grades">
      <Dropdown
        label="Semester"
        value={semesterId}
        onChange={setSemesterId}
        options={semesters.map((s) => ({ value: s.id, label: s.label }))}
      />

      <View style={styles.summary}>
        <Summary label="Subjects" value={String(rows.length)} />
        <Summary label="Units" value={String(units)} />
        <Summary
          label={gwa ? 'GWA' : 'GWA pending'}
          value={gwa ? gwa.toFixed(2) : midterm ? midterm.toFixed(2) : '—'}
          caption={gwa ? undefined : midterm ? 'Midterm avg' : undefined}
          highlight
        />
      </View>

      {allInProgress && rows.length > 0 ? (
        <View style={styles.notice}>
          <Icon name="time-outline" size={16} color={colors.goldText} />
          <Text style={styles.noticeText}>Semester in progress. Final grades are posted after finals week.</Text>
        </View>
      ) : null}

      <Card style={styles.table}>
        <View style={[styles.tr, styles.thead]}>
          <Text style={[styles.th, styles.subjectCol]}>Subject</Text>
          {PERIODS.map((p) => (
            <Text key={p.key} style={[styles.th, styles.gradeCol]} accessibilityLabel={`${p.long} grade`}>
              {p.short}
            </Text>
          ))}
        </View>
        {rows.length === 0 ? (
          <Text style={styles.emptyText}>No grades for this semester yet.</Text>
        ) : (
          rows.map((r, i) => (
            <GradeTableRow key={r.code} row={r} striped={i % 2 === 1} showRemarks={!allInProgress} />
          ))
        )}
      </Card>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>How to read this</Text>
        <Text style={styles.legendText}>
          PG = Prelim, MG = Midterm, FG = Final. Grades use the 1.00 to 5.00 scale: 1.00 is the highest and 3.00 is
          the lowest passing grade. A dash means the grade is not posted yet.
        </Text>
        <View style={styles.legendKeys}>
          <Key color={colors.success} label="1.00 to 1.75" />
          <Key color={colors.text} label="2.00 to 3.00" />
          <Key color={colors.danger} label="Below passing" />
        </View>
      </View>
    </Screen>
  );
}

function gradeColor(value: number | null) {
  if (value === null) return colors.textMuted;
  if (value > 3) return colors.danger;
  if (value <= 1.75) return colors.success;
  return colors.text;
}

function GradeTableRow({ row, striped, showRemarks }: { row: GradeRow; striped: boolean; showRemarks: boolean }) {
  const a11y = PERIODS.map((p) => `${p.long} ${row[p.key] === null ? 'not posted' : formatGrade(row[p.key])}`).join(', ');
  return (
    <View
      style={[styles.tr, striped && styles.striped]}
      accessible
      accessibilityLabel={`${row.code}, ${row.title}, ${row.units} units. ${a11y}. ${row.remarks}.`}>
      <View style={styles.subjectCol}>
        <Text style={styles.code}>
          {row.code} <Text style={styles.units}>· {row.units} units</Text>
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {row.title}
        </Text>
        {showRemarks ? (
          <View style={{ marginTop: 4 }}>
            <Pill label={row.remarks} tone={remarksTone[row.remarks]} />
          </View>
        ) : null}
      </View>
      <GradeCell value={row.pg} />
      <GradeCell value={row.mg} />
      <GradeCell value={row.fg} final />
    </View>
  );
}

function GradeCell({ value, final }: { value: number | null; final?: boolean }) {
  return (
    <View style={styles.gradeCol}>
      <View style={[styles.cell, final && value !== null && styles.cellFinal]}>
        <Text style={[styles.td, { color: gradeColor(value) }, final && { fontWeight: '800' }]}>
          {formatGrade(value)}
        </Text>
      </View>
    </View>
  );
}

function Summary({
  label,
  value,
  caption,
  highlight,
}: {
  label: string;
  value: string;
  caption?: string;
  highlight?: boolean;
}) {
  return (
    <View
      style={[styles.summaryItem, highlight && styles.summaryHighlight]}
      accessible
      accessibilityLabel={`${label}: ${value}${caption ? `, ${caption}` : ''}`}>
      <Text style={[styles.summaryValue, highlight && { color: colors.maroon }]}>{value}</Text>
      <Text style={[styles.summaryLabel, highlight && { color: colors.goldText, fontWeight: '700' }]}>{label}</Text>
      {caption ? <Text style={styles.summaryCaption}>{caption}</Text> : null}
    </View>
  );
}

function Key({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.key}>
      <View style={[styles.keyDot, { backgroundColor: color }]} />
      <Text style={styles.keyText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', gap: spacing.md },
  summaryItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  summaryHighlight: { backgroundColor: colors.goldSoft, borderColor: colors.gold, borderWidth: 1 },
  summaryValue: { fontSize: 22, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
  summaryLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  summaryCaption: { fontSize: 11, color: colors.goldText, marginTop: 1 },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.goldSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: -spacing.xs,
  },
  noticeText: { flex: 1, fontSize: 13, color: colors.goldText, fontWeight: '600', lineHeight: 18 },
  table: { padding: 0, overflow: 'hidden' },
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  thead: { backgroundColor: colors.maroon, paddingVertical: 10 },
  striped: { backgroundColor: colors.surfaceMuted },
  th: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  subjectCol: { flex: 1, paddingRight: spacing.sm },
  gradeCol: { width: 52, alignItems: 'center', textAlign: 'center' },
  cell: { minWidth: 46, paddingVertical: 4, borderRadius: radius.sm, alignItems: 'center' },
  cellFinal: { backgroundColor: colors.maroonSoft },
  td: { fontSize: 15, fontVariant: ['tabular-nums'] },
  code: { fontSize: 13, fontWeight: '800', color: colors.maroon },
  units: { fontWeight: '500', color: colors.textMuted },
  title: { fontSize: 13, color: colors.text, marginTop: 1 },
  emptyText: { padding: spacing.lg, color: colors.textMuted, textAlign: 'center' },
  legend: { gap: spacing.sm },
  legendTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  legendText: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  legendKeys: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  key: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  keyDot: { width: 8, height: 8, borderRadius: 4 },
  keyText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
});
