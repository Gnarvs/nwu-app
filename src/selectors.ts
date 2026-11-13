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

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export type ClassStatus = 'done' | 'now' | 'next' | 'later';

/**
 * Where each of today's classes stands right now. `classes` must already be
 * filtered to today and sorted by start time.
 */
export function classStatuses<T extends { start: string; end: string }>(classes: T[], now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  const nextIdx = classes.findIndex((c) => toMinutes(c.start) > mins);
  return classes.map((c, i) => {
    let status: ClassStatus = 'later';
    if (mins >= toMinutes(c.end)) status = 'done';
    else if (mins >= toMinutes(c.start)) status = 'now';
    else if (i === nextIdx) status = 'next';
    return { ...c, status };
  });
}

/** "08:00", "09:30" -> "1 hr 30 min" */
export function duration(start: string, end: string) {
  const d = toMinutes(end) - toMinutes(start);
  const h = Math.floor(d / 60);
  const m = d % 60;
  return [h ? `${h} hr` : '', m ? `${m} min` : ''].filter(Boolean).join(' ');
}
