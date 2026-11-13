/**
 * Shapes of the data the app expects.
 *
 * When connecting to the school's real system, keep these types and make the
 * API responses (or an adapter around them) match them. The screens only
 * depend on these shapes, not on where the data comes from.
 */

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  college: string;
  yearLevel: string;
  section: string;
  currentTerm: string;
  adviser: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string; // ISO date
  category: 'Academic' | 'Finance' | 'Event' | 'Advisory';
};

export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export type ClassMeeting = {
  id: string;
  code: string;
  title: string;
  section: string;
  instructor: string;
  room: string;
  days: Weekday[];
  start: string; // 24h "HH:mm"
  end: string; // 24h "HH:mm"
  units: number;
};

export type Semester = {
  id: string;
  label: string; // e.g. "1st Semester, AY 2026–2027"
};

/** Grades use the Philippine 1.00 (highest) to 5.00 (failing) scale. `null` means not yet posted. */
export type GradeRow = {
  code: string;
  title: string;
  units: number;
  instructor: string;
  pg: number | null; // Prelim grade
  mg: number | null; // Midterm grade
  fg: number | null; // Final grade
  remarks: 'Passed' | 'Failed' | 'INC' | 'In Progress';
};

export type FeeItem = {
  label: string;
  amount: number;
};

export type PaymentDue = {
  label: string; // e.g. "Prelim"
  dueDate: string; // ISO date
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
};

export type PaymentRecord = {
  id: string;
  date: string; // ISO date
  orNumber: string;
  method: string;
  amount: number;
};

export type Tuition = {
  term: string;
  fees: FeeItem[];
  discounts: FeeItem[];
  schedule: PaymentDue[];
  payments: PaymentRecord[];
};

export type ClearanceStatus = 'Cleared' | 'With Obligation';

export type ClearanceOffice = {
  id: string;
  office: string;
  signatory: string;
  status: ClearanceStatus;
  obligation?: string; // what the student still needs to settle
  updatedAt: string; // ISO date
};

export type Message = {
  id: string;
  from: string;
  role: string;
  subject: string;
  preview: string;
  body: string;
  date: string; // ISO date-time
  unread: boolean;
};

export type FacultyToEvaluate = {
  id: string;
  name: string;
  subjectCode: string;
  subjectTitle: string;
  submitted: boolean;
};
