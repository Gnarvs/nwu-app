const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
});

export function formatPeso(amount: number) {
  return peso.format(amount);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-11-12" -> "Nov 12, 2026" (parsed as a local date, no timezone shift). */
export function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** "2026-11-12" -> "Nov 12" */
export function formatShortDate(iso: string) {
  const [, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

/** "13:00" -> "1:00 PM" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatGrade(value: number | null) {
  return value === null ? '—' : value.toFixed(2);
}

/** Units-weighted average of the grades that are posted. Returns null if none. */
export function weightedAverage(rows: { units: number; grade: number | null }[]) {
  const posted = rows.filter((r) => r.grade !== null);
  const units = posted.reduce((sum, r) => sum + r.units, 0);
  if (units === 0) return null;
  return posted.reduce((sum, r) => sum + (r.grade as number) * r.units, 0) / units;
}

/** "Prof. Liza M. Cabrera" -> "LC", "Accounting Office" -> "AO" */
export function initials(name: string) {
  const words = name.replace(/^(Prof|Dr|Mr|Ms|Mrs|Engr|Coach)\.?\s+/i, '').split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
}
