import type { Tuition, Weekday } from '@/data/sampleData';

export const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Today's weekday, or null on Sunday. */
export function todayWeekday(): Weekday | null {
  const d = new Date().getDay(); // 0 = Sunday
  return d === 0 ? null : WEEKDAYS[d - 1];
}

/** Totals derived from the tuition record, so the data file only holds raw values. */
export function tuitionTotals(t: Tuition) {
  const gross = t.fees.reduce((s, f) => s + f.amount, 0);
  const discounts = t.discounts.reduce((s, f) => s + f.amount, 0);
  const assessment = gross - discounts;
  const paid = t.payments.reduce((s, p) => s + p.amount, 0);
  const balance = Math.max(0, assessment - paid);

  // Walk the schedule in order and apply payments to find what is still owed per period.
  let remainingPaid = paid;
  const periods = t.schedule.map((p) => {
    const applied = Math.min(p.amount, remainingPaid);
    remainingPaid -= applied;
    return { ...p, outstanding: p.amount - applied };
  });
  const nextDue = periods.find((p) => p.outstanding > 0) ?? null;

  return { gross, discounts, assessment, paid, balance, periods, nextDue };
}
