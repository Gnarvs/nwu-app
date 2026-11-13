import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Divider, Pill, Row, Screen, SectionTitle } from '@/components/ui';
import { tuition } from '@/data/sampleData';
import { formatDate, formatPeso, formatShortDate } from '@/format';
import { tuitionTotals } from '@/selectors';
import { colors, radius, spacing } from '@/theme';

const statusTone = { Paid: 'success', Partial: 'gold', Unpaid: 'danger' } as const;

export default function TuitionScreen() {
  const t = tuitionTotals(tuition);
  const paidPct = t.assessment > 0 ? Math.min(1, t.paid / t.assessment) : 0;

  return (
    <Screen title="Tuition" subtitle={tuition.term}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Remaining balance</Text>
        <Text style={styles.balanceValue}>{formatPeso(t.balance)}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${paidPct * 100}%` }]} />
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceSmall}>Paid {formatPeso(t.paid)}</Text>
          <Text style={styles.balanceSmall}>of {formatPeso(t.assessment)}</Text>
        </View>
        {t.nextDue ? (
          <View style={styles.nextDue}>
            <Ionicons name="alarm-outline" size={16} color={colors.maroon} />
            <Text style={styles.nextDueText}>
              {t.nextDue.label} due {formatShortDate(t.nextDue.dueDate)}: {formatPeso(t.nextDue.outstanding)}
            </Text>
          </View>
        ) : null}
      </View>

      <SectionTitle>Payment schedule</SectionTitle>
      <Card style={{ paddingVertical: spacing.sm }}>
        {t.periods.map((p, i) => (
          <View key={p.label} style={[styles.schedRow, i > 0 && styles.border]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.schedLabel}>{p.label}</Text>
              <Text style={styles.schedDate}>Due {formatDate(p.dueDate)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={styles.amount}>{formatPeso(p.amount)}</Text>
              <Pill label={p.status} tone={statusTone[p.status]} />
            </View>
          </View>
        ))}
      </Card>

      <SectionTitle>Assessment</SectionTitle>
      <Card>
        {tuition.fees.map((f) => (
          <Row key={f.label} label={f.label} value={formatPeso(f.amount)} />
        ))}
        <Divider style={{ marginVertical: spacing.sm }} />
        <Row label="Total fees" value={formatPeso(t.gross)} />
        {tuition.discounts.map((d) => (
          <Row
            key={d.label}
            label={d.label}
            value={`- ${formatPeso(d.amount)}`}
            valueStyle={{ color: colors.success }}
          />
        ))}
        <Divider style={{ marginVertical: spacing.sm }} />
        <Row
          label="Total assessment"
          value={formatPeso(t.assessment)}
          labelStyle={styles.totalLabel}
          valueStyle={styles.totalValue}
        />
      </Card>

      <SectionTitle>Payment history</SectionTitle>
      <Card style={{ paddingVertical: spacing.sm }}>
        {tuition.payments.map((p, i) => (
          <View key={p.id} style={[styles.schedRow, i > 0 && styles.border]}>
            <View style={styles.payIcon}>
              <Ionicons name="receipt-outline" size={18} color={colors.maroon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.schedLabel}>{p.orNumber}</Text>
              <Text style={styles.schedDate}>
                {formatDate(p.date)} · {p.method}
              </Text>
            </View>
            <Text style={styles.amount}>{formatPeso(p.amount)}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.howTo}>
        <Ionicons name="information-circle-outline" size={20} color={colors.goldText} />
        <Text style={styles.howToText}>
          Pay at the Cashier, through GCash, or by bank deposit. Keep your official receipt until the end of the
          semester.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: colors.maroon,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  balanceLabel: { color: '#F3D9D9', fontSize: 14, fontWeight: '600' },
  balanceValue: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 4, fontVariant: ['tabular-nums'] },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 4 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  balanceSmall: { color: '#F3D9D9', fontSize: 13 },
  nextDue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.lg,
    backgroundColor: colors.gold,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  nextDueText: { color: colors.maroon, fontWeight: '700', fontSize: 13 },
  schedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  border: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  schedLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  schedDate: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  amount: { fontSize: 15, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] },
  totalLabel: { color: colors.text, fontWeight: '700', fontSize: 15 },
  totalValue: { color: colors.maroon, fontWeight: '800', fontSize: 16 },
  payIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.maroonSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howTo: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.goldSoft, borderColor: colors.gold },
  howToText: { flex: 1, fontSize: 13, color: colors.goldText, lineHeight: 19 },
});
