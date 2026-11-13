import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Chip, Pill, Screen } from '@/components/ui';
import { clearance, student, type ClearanceStatus } from '@/data/sampleData';
import { formatShortDate } from '@/format';
import { colors, radius, spacing } from '@/theme';

type Filter = 'All' | ClearanceStatus;

export default function ClearanceScreen() {
  const [filter, setFilter] = useState<Filter>('All');
  const cleared = clearance.filter((o) => o.status === 'Cleared').length;
  const pending = clearance.length - cleared;
  const done = pending === 0;
  const list = filter === 'All' ? clearance : clearance.filter((o) => o.status === filter);

  return (
    <Screen title="Clearance" subtitle={student.currentTerm}>
      <Card style={styles.summary}>
        <View style={[styles.summaryIcon, { backgroundColor: done ? colors.successSoft : colors.goldSoft }]}>
          <Ionicons
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
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(cleared / clearance.length) * 100}%` }]} />
          </View>
        </View>
      </Card>

      <View style={styles.filters}>
        {(['All', 'With Obligation', 'Cleared'] as Filter[]).map((f) => (
          <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>

      <Card style={{ paddingVertical: spacing.xs }}>
        {list.map((o, i) => {
          const ok = o.status === 'Cleared';
          return (
            <View key={o.id} style={[styles.row, i > 0 && styles.border]}>
              <Ionicons
                name={ok ? 'checkmark-circle' : 'alert-circle'}
                size={24}
                color={ok ? colors.success : colors.danger}
              />
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
                    <Text style={styles.obligationText}>{o.obligation}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  summaryIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  summaryBody: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.border, marginTop: spacing.md, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.maroon, borderRadius: 4 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md },
  border: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  rowHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, flexWrap: 'wrap' },
  office: { fontSize: 15, fontWeight: '700', color: colors.text, flexShrink: 1 },
  signatory: { fontSize: 13, color: colors.textMuted },
  obligation: {
    marginTop: 6,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  obligationText: { fontSize: 13, color: colors.danger, lineHeight: 18 },
});
