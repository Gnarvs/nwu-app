import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Chip, EmptyState, Icon, Pill, ProgressBar, Screen } from '@/components/ui';
import { clearance, student, type ClearanceStatus } from '@/data/sampleData';
import { formatShortDate } from '@/format';
import { colors, radius, spacing } from '@/theme';

type Filter = 'All' | ClearanceStatus;

export default function ClearanceScreen() {
  const [filter, setFilter] = useState<Filter>('All');
  const cleared = clearance.filter((o) => o.status === 'Cleared').length;
  const pending = clearance.length - cleared;
  const done = pending === 0;
  const counts: Record<Filter, number> = { All: clearance.length, 'With Obligation': pending, Cleared: cleared };

  // Put what still needs action first; keep the data file's order otherwise.
  const ordered = [...clearance].sort(
    (a, b) => Number(a.status === 'Cleared') - Number(b.status === 'Cleared'),
  );
  const list = filter === 'All' ? ordered : ordered.filter((o) => o.status === filter);

  return (
    <Screen title="Clearance" subtitle={student.currentTerm}>
      <Card style={styles.summary}>
        <View style={styles.summaryTop}>
          <View style={[styles.summaryIcon, { backgroundColor: done ? colors.successSoft : colors.goldSoft }]}>
            <Icon
              name={done ? 'checkmark-done' : 'hourglass-outline'}
              size={24}
              color={done ? colors.success : colors.goldText}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>
              {cleared} of {clearance.length} offices cleared
            </Text>
            <Text style={styles.summaryBody}>
              {done
                ? 'You are fully cleared for this semester.'
                : `Settle ${pending} remaining ${pending === 1 ? 'obligation' : 'obligations'} to complete your clearance.`}
            </Text>
          </View>
          <Text style={[styles.percent, done && { color: colors.success }]}>
            {Math.round((cleared / clearance.length) * 100)}%
          </Text>
        </View>
        <ProgressBar
          value={cleared / clearance.length}
          color={done ? colors.success : colors.maroon}
          label="Clearance progress"
        />
      </Card>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filters}>
        {(['All', 'With Obligation', 'Cleared'] as Filter[]).map((f) => (
          <Chip key={f} label={f} count={counts[f]} selected={filter === f} onPress={() => setFilter(f)} />
        ))}
      </ScrollView>

      <Card style={{ paddingVertical: spacing.xs }}>
        {list.length === 0 ? (
          <EmptyState icon="checkmark-done-outline" title="Nothing here" body="No offices match this filter." />
        ) : (
          list.map((o, i) => {
            const ok = o.status === 'Cleared';
            return (
              <View
                key={o.id}
                style={[styles.row, i > 0 && styles.border]}
                accessible
                accessibilityLabel={`${o.office}, ${o.status}. ${o.signatory}, updated ${formatShortDate(o.updatedAt)}.${o.obligation ? ` To settle: ${o.obligation}` : ''}`}>
                <View style={[styles.statusIcon, { backgroundColor: ok ? colors.successSoft : colors.dangerSoft }]}>
                  <Icon name={ok ? 'checkmark' : 'alert'} size={16} color={ok ? colors.success : colors.danger} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={styles.rowHead}>
                    <Text style={styles.office}>{o.office}</Text>
                    <Pill label={o.status} tone={ok ? 'success' : 'danger'} />
                  </View>
                  <Text style={styles.signatory}>
                    {o.signatory} · {formatShortDate(o.updatedAt)}
                  </Text>
                  {o.obligation ? (
                    <View style={styles.obligation}>
                      <Text style={styles.obligationLabel}>To settle</Text>
                      <Text style={styles.obligationText}>{o.obligation}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { gap: spacing.md },
  summaryTop: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  summaryIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  summaryBody: { fontSize: 13, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  percent: { fontSize: 22, fontWeight: '800', color: colors.maroon, fontVariant: ['tabular-nums'] },
  // Bleed to the screen edge so a chip that doesn't fit scrolls instead of wrapping.
  filterScroll: { marginHorizontal: -spacing.lg, flexGrow: 0 },
  filters: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md },
  border: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  rowHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  office: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 },
  signatory: { fontSize: 13, color: colors.textMuted },
  obligation: {
    marginTop: 6,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
    padding: spacing.sm,
    gap: 2,
  },
  obligationLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.danger,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  obligationText: { fontSize: 13, color: colors.danger, lineHeight: 18 },
});
