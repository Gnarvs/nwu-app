import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Collapsible, Divider, Icon, Pill, Row, Screen, SectionTitle, type IconName } from '@/components/ui';
import { tuition } from '@/data/sampleData';
import { formatDate, formatPeso, formatShortDate } from '@/format';
import { tuitionTotals } from '@/selectors';
import { colors, radius, shadowRaised, spacing } from '@/theme';

const statusTone = { Paid: 'success', Partial: 'gold', Unpaid: 'danger' } as const;

const methodIcon: Record<string, IconName> = {
  GCash: 'phone-portrait-outline',
  Cashier: 'storefront-outline',
  'Bank deposit': 'business-outline',
};

export default function TuitionScreen() {
  const t = tuitionTotals(tuition);
  const paidPct = t.assessment > 0 ? Math.min(1, t.paid / t.assessment) : 0;

  return (
    <Screen title="Tuition" subtitle={tuition.term}>
      <LinearGradient
        colors={[colors.maroonBright, colors.maroon, colors.maroonDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}>
        <View style={styles.glow} />
        <Text style={styles.balanceLabel}>Remaining balance</Text>
        <Text style={styles.balanceValue} accessibilityLabel={`Remaining balance ${formatPeso(t.balance)}`}>
          {formatPeso(t.balance)}
        </Text>

        {/* One segment per installment, filled by how much of it is paid. */}
        <View
          style={styles.segments}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel="Paid so far"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(paidPct * 100) }}>
          {t.periods.map((p) => {
            const fill = p.amount > 0 ? (p.amount - p.outstanding) / p.amount : 0;
            return (
              <View key={p.label} style={[styles.segment, { flex: p.amount }]}>
                <View style={[styles.segmentFill, { width: `${fill * 100}%` }]} />
              </View>
            );
          })}
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceSmall}>
            Paid <Text style={styles.balanceStrong}>{formatPeso(t.paid)}</Text>
          </Text>
          <Text style={styles.balanceSmall}>
            {Math.round(paidPct * 100)}% of {formatPeso(t.assessment)}
          </Text>
        </View>

        {t.nextDue ? (
          <View style={styles.nextDue}>
            <View style={styles.nextDueIcon}>
              <Icon name="alarm-outline" size={18} color={colors.maroon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextDueLabel}>
                {t.nextDue.label} due {formatShortDate(t.nextDue.dueDate)}
              </Text>
              <Text style={styles.nextDueAmount}>{formatPeso(t.nextDue.outstanding)}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.nextDue}>
            <View style={styles.nextDueIcon}>
              <Icon name="checkmark" size={18} color={colors.maroon} />
            </View>
            <Text style={styles.nextDueLabel}>Fully paid for this term</Text>
          </View>
        )}
      </LinearGradient>

      <SectionTitle>Payment schedule</SectionTitle>
      <Card>
        {t.periods.map((p, i) => {
          const last = i === t.periods.length - 1;
          const isNext = t.nextDue?.label === p.label;
          const icon: IconName = p.status === 'Paid' ? 'checkmark' : p.status === 'Partial' ? 'ellipse' : 'ellipse-outline';
          return (
            <View
              key={p.label}
              style={styles.step}
              accessible
              accessibilityLabel={`${p.label}, ${formatPeso(p.amount)}, due ${formatDate(p.dueDate)}, ${p.status}${p.outstanding > 0 && p.status === 'Partial' ? `, ${formatPeso(p.outstanding)} left` : ''}`}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.node,
                    p.status === 'Paid' && styles.nodePaid,
                    p.status === 'Partial' && styles.nodePartial,
                    isNext && styles.nodeNext,
                  ]}>
                  <Icon
                    name={icon}
                    size={p.status === 'Paid' ? 14 : 10}
                    color={p.status === 'Paid' ? '#fff' : p.status === 'Partial' ? colors.goldText : colors.border}
                  />
                </View>
                {!last ? <View style={[styles.line, p.status === 'Paid' && styles.linePaid]} /> : null}
              </View>
              <View style={[styles.stepBody, !last && { paddingBottom: spacing.lg }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.schedLabel, isNext && { color: colors.maroon }]}>{p.label}</Text>
                  <Text style={styles.schedDate}>Due {formatDate(p.dueDate)}</Text>
                  {p.status === 'Partial' ? (
                    <Text style={styles.leftText}>{formatPeso(p.outstanding)} left to pay</Text>
                  ) : null}
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={[styles.amount, p.status === 'Paid' && styles.amountPaid]}>{formatPeso(p.amount)}</Text>
                  <Pill label={p.status} tone={statusTone[p.status]} />
                </View>
              </View>
            </View>
          );
        })}
      </Card>

      <SectionTitle>Assessment</SectionTitle>
      <Card style={{ paddingBottom: spacing.xs }}>
        <View style={styles.assessTop}>
          <View>
            <Text style={styles.assessLabel}>Total assessment</Text>
            <Text style={styles.assessValue}>{formatPeso(t.assessment)}</Text>
          </View>
          <View style={styles.assessChip}>
            <Text style={styles.assessChipText}>{tuition.fees.length} fees</Text>
          </View>
        </View>
        <Collapsible label="Show fee breakdown" openLabel="Hide fee breakdown">
          <View style={styles.breakdown}>
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
          </View>
        </Collapsible>
      </Card>

      <SectionTitle>Payment history</SectionTitle>
      <Card style={{ paddingVertical: spacing.sm }}>
        {tuition.payments.map((p, i) => (
          <View
            key={p.id}
            style={[styles.payRow, i > 0 && styles.border]}
            accessible
            accessibilityLabel={`${formatPeso(p.amount)} paid ${formatDate(p.date)} by ${p.method}, receipt ${p.orNumber}`}>
            <View style={styles.payIcon}>
              <Icon name={methodIcon[p.method] ?? 'receipt-outline'} size={18} color={colors.maroon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.schedLabel}>{p.orNumber}</Text>
              <Text style={styles.schedDate}>
                {formatDate(p.date)} · {p.method}
              </Text>
            </View>
            <Text style={[styles.amount, { color: colors.success }]}>+{formatPeso(p.amount)}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.howTo}>
        <Icon name="information-circle-outline" size={20} color={colors.goldText} />
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
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    ...shadowRaised,
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    right: -80,
    top: -100,
    borderWidth: 28,
    borderColor: 'rgba(242, 183, 5, 0.1)',
  },
  balanceLabel: { color: colors.onMaroonMuted, fontSize: 14, fontWeight: '600' },
  balanceValue: { color: '#fff', fontSize: 36, fontWeight: '800', marginTop: 4, fontVariant: ['tabular-nums'] },
  segments: { flexDirection: 'row', gap: 4, marginTop: spacing.lg },
  segment: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  segmentFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 4 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, gap: spacing.sm },
  balanceSmall: { color: colors.onMaroonMuted, fontSize: 13, fontVariant: ['tabular-nums'] },
  balanceStrong: { color: '#fff', fontWeight: '700' },
  nextDue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: colors.gold,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  nextDueIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextDueLabel: { color: colors.maroon, fontWeight: '700', fontSize: 13 },
  nextDueAmount: { color: colors.maroonDeep, fontWeight: '800', fontSize: 17, fontVariant: ['tabular-nums'] },
  step: { flexDirection: 'row', gap: spacing.md },
  rail: { alignItems: 'center', width: 24 },
  node: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodePaid: { backgroundColor: colors.success, borderColor: colors.success },
  nodePartial: { borderColor: colors.gold, backgroundColor: colors.goldSoft },
  nodeNext: { borderWidth: 3 },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 2 },
  linePaid: { backgroundColor: colors.success },
  stepBody: { flex: 1, flexDirection: 'row', gap: spacing.md },
  schedLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  schedDate: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  leftText: { fontSize: 12, color: colors.goldText, fontWeight: '700', marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] },
  amountPaid: { color: colors.textMuted },
  assessTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  assessLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  assessValue: { fontSize: 22, fontWeight: '800', color: colors.maroon, fontVariant: ['tabular-nums'], marginTop: 2 },
  assessChip: {
    backgroundColor: colors.neutralSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  assessChipText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  breakdown: {
    marginTop: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  totalLabel: { color: colors.text, fontWeight: '700', fontSize: 15 },
  totalValue: { color: colors.maroon, fontWeight: '800', fontSize: 16 },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  border: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  payIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.maroonSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howTo: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.goldSoft, borderColor: colors.gold },
  howToText: { flex: 1, fontSize: 13, color: colors.goldText, lineHeight: 19 },
});
