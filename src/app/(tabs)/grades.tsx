import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Dropdown } from '@/components/dropdown';
import { Card, Pill, Screen } from '@/components/ui';
import { grades, semesters, type GradeRow } from '@/data/sampleData';
import { formatGrade, weightedAverage } from '@/format';
import { colors, spacing } from '@/theme';

const remarksTone = {
  Passed: 'success',
  Failed: 'danger',
  INC: 'gold',
  'In Progress': 'muted',
} as const;

export default function GradesScreen() {
  const [semesterId, setSemesterId] = useState(semesters[0].id);
  const rows = grades[semesterId] ?? [];
  const units = rows.reduce((s, r) => s + r.units, 0);
  const finalsPosted = rows.length > 0 && rows.every((r) => r.fg !== null);
  const gwa = finalsPosted ? weightedAverage(rows.map((r) => ({ units: r.units, grade: r.fg }))) : null;

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
        <Summary label="GWA" value={gwa ? gwa.toFixed(2) : 'Pending'} highlight />
      </View>

      <Card style={styles.table}>
        <View style={[styles.tr, styles.thead]}>
          <Text style={[styles.th, styles.subjectCol]}>Subject</Text>
          <Text style={[styles.th, styles.gradeCol]}>PG</Text>
          <Text style={[styles.th, styles.gradeCol]}>MG</Text>
          <Text style={[styles.th, styles.gradeCol]}>FG</Text>
        </View>
        {rows.length === 0 ? (
          <Text style={styles.emptyText}>No grades for this semester yet.</Text>
        ) : (
          rows.map((r, i) => <GradeTableRow key={r.code} row={r} striped={i % 2 === 1} />)
        )}
      </Card>

      <Text style={styles.legend}>
        PG = Prelim Grade · MG = Midterm Grade · FG = Final Grade. Grades use the 1.00 to 5.00 scale, where
        1.00 is the highest and 3.00 is the lowest passing grade. A dash means the grade is not posted yet.
      </Text>
    </Screen>
  );
}

function GradeTableRow({ row, striped }: { row: GradeRow; striped: boolean }) {
  return (
    <View style={[styles.tr, striped && styles.striped]}>
      <View style={styles.subjectCol}>
        <Text style={styles.code}>
          {row.code} <Text style={styles.units}>· {row.units} u</Text>
        </Text>
        <Text style={styles.title}>{row.title}</Text>
        <View style={{ marginTop: 4 }}>
          <Pill label={row.remarks} tone={remarksTone[row.remarks]} />
        </View>
      </View>
      <GradeCell value={row.pg} />
      <GradeCell value={row.mg} />
      <GradeCell value={row.fg} bold />
    </View>
  );
}

function GradeCell({ value, bold }: { value: number | null; bold?: boolean }) {
  const failing = value !== null && value > 3;
  return (
    <Text
      style={[
        styles.td,
        styles.gradeCol,
        bold && { fontWeight: '800' },
        value === null && { color: colors.textMuted },
        failing && { color: colors.danger },
      ]}>
      {formatGrade(value)}
    </Text>
  );
}

function Summary({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={[styles.summaryItem, highlight && styles.summaryHighlight]}>
      <Text style={[styles.summaryValue, highlight && { color: colors.maroon }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', gap: spacing.md },
  summaryItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  summaryHighlight: { backgroundColor: colors.goldSoft, borderColor: colors.gold },
  summaryValue: { fontSize: 20, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
  summaryLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  table: { padding: 0, overflow: 'hidden' },
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  thead: { backgroundColor: colors.maroon, paddingVertical: 10 },
  striped: { backgroundColor: '#FBF8F5' },
  th: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  subjectCol: { flex: 1, paddingRight: spacing.sm },
  gradeCol: { width: 50, textAlign: 'center' },
  td: { fontSize: 15, color: colors.text, fontVariant: ['tabular-nums'] },
  code: { fontSize: 13, fontWeight: '800', color: colors.maroon },
  units: { fontWeight: '500', color: colors.textMuted },
  title: { fontSize: 13, color: colors.text, marginTop: 1 },
  emptyText: { padding: spacing.lg, color: colors.textMuted, textAlign: 'center' },
  legend: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
});
