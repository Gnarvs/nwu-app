/**
 * SAMPLE DATA ONLY.
 *
 * Every name, grade, amount and message in this file is made up. This is the
 * single place the app reads data from. To connect the app to NWU's real
 * student information system, replace the exports below with data fetched
 * from that system (keeping the shapes defined in ./types.ts), and the screens
 * will keep working without changes.
 */

import type {
  Announcement,
  ClassMeeting,
  ClearanceOffice,
  FacultyToEvaluate,
  GradeRow,
  Message,
  Semester,
  Student,
  Tuition,
} from './types';

export type * from './types';

/* ------------------------------------------------------------------ */
/* Student profile                                                     */
/* ------------------------------------------------------------------ */

export const student: Student = {
  id: '2023-01842',
  firstName: 'Juan Miguel',
  lastName: 'Dela Cruz',
  email: 'jmdelacruz@student.nwu.example',
  program: 'BS Information Technology',
  college: 'College of Computer Studies',
  yearLevel: '3rd Year',
  section: 'BSIT 3-A',
  currentTerm: '1st Semester, AY 2026–2027',
  adviser: 'Prof. Liza M. Cabrera',
};

/* ------------------------------------------------------------------ */
/* Home: announcements                                                 */
/* ------------------------------------------------------------------ */

export const announcements: Announcement[] = [
  {
    id: 'a1',
    title: 'Final exams start December 8',
    body: 'Final examinations for the 1st semester run December 8 to 13. Bring your exam permit and school ID.',
    date: '2026-11-12',
    category: 'Academic',
  },
  {
    id: 'a2',
    title: 'Pre-final payment deadline extended',
    body: 'The Accounting Office extended the pre-final payment deadline to November 17.',
    date: '2026-11-10',
    category: 'Finance',
  },
  {
    id: 'a3',
    title: 'Faculty evaluation is open',
    body: 'Please evaluate each of your instructors before November 28. Your answers are anonymous.',
    date: '2026-11-06',
    category: 'Advisory',
  },
  {
    id: 'a4',
    title: 'University Week 2026',
    body: 'Join the parade, booths and the battle of the bands at the main campus quadrangle, November 20 to 22.',
    date: '2026-11-03',
    category: 'Event',
  },
];

/* ------------------------------------------------------------------ */
/* Schedule                                                            */
/* ------------------------------------------------------------------ */

export const schedule: ClassMeeting[] = [
  {
    id: 'c1',
    code: 'IT 311',
    title: 'Information Assurance and Security 1',
    section: 'BSIT 3-A',
    instructor: 'Engr. Ramon D. Agustin',
    room: 'IT 204',
    days: ['Mon', 'Wed'],
    start: '08:00',
    end: '09:30',
    units: 3,
  },
  {
    id: 'c2',
    code: 'IT 312',
    title: 'Integrative Programming and Technologies 2',
    section: 'BSIT 3-A',
    instructor: 'Prof. Liza M. Cabrera',
    room: 'Comp Lab 3',
    days: ['Mon', 'Wed'],
    start: '10:00',
    end: '11:30',
    units: 3,
  },
  {
    id: 'c3',
    code: 'GE 7',
    title: 'Science, Technology and Society',
    section: 'BSIT 3-A',
    instructor: 'Dr. Fernando R. Pascua',
    room: 'LA 101',
    days: ['Mon', 'Wed'],
    start: '13:00',
    end: '14:30',
    units: 3,
  },
  {
    id: 'c4',
    code: 'IT 313',
    title: 'Systems Integration and Architecture',
    section: 'BSIT 3-A',
    instructor: 'Prof. Maricel T. Ventura',
    room: 'IT 205',
    days: ['Tue', 'Thu'],
    start: '08:00',
    end: '09:30',
    units: 3,
  },
  {
    id: 'c5',
    code: 'IT 314',
    title: 'Mobile Application Development',
    section: 'BSIT 3-A',
    instructor: 'Mr. Joel B. Ramos',
    room: 'Comp Lab 2',
    days: ['Tue', 'Thu'],
    start: '13:00',
    end: '14:30',
    units: 3,
  },
  {
    id: 'c6',
    code: 'IT 315',
    title: 'Quantitative Methods',
    section: 'BSIT 3-A',
    instructor: 'Ms. Kristine A. Domingo',
    room: 'IT 204',
    days: ['Fri'],
    start: '08:00',
    end: '11:00',
    units: 3,
  },
  {
    id: 'c7',
    code: 'RIZAL',
    title: "Life and Works of Rizal",
    section: 'BSIT 3-A',
    instructor: 'Prof. Arnel S. Tabios',
    room: 'LA 103',
    days: ['Fri'],
    start: '13:00',
    end: '16:00',
    units: 3,
  },
];

/* ------------------------------------------------------------------ */
/* Grades                                                              */
/* ------------------------------------------------------------------ */

export const semesters: Semester[] = [
  { id: '2026-1', label: '1st Semester, AY 2026–2027' },
  { id: '2025-2', label: '2nd Semester, AY 2025–2026' },
  { id: '2025-1', label: '1st Semester, AY 2025–2026' },
];

export const grades: Record<string, GradeRow[]> = {
  '2026-1': [
    { code: 'IT 311', title: 'Information Assurance and Security 1', units: 3, instructor: 'Engr. Ramon D. Agustin', pg: 1.75, mg: 1.5, fg: null, remarks: 'In Progress' },
    { code: 'IT 312', title: 'Integrative Programming and Technologies 2', units: 3, instructor: 'Prof. Liza M. Cabrera', pg: 1.5, mg: 1.25, fg: null, remarks: 'In Progress' },
    { code: 'IT 313', title: 'Systems Integration and Architecture', units: 3, instructor: 'Prof. Maricel T. Ventura', pg: 2.0, mg: 1.75, fg: null, remarks: 'In Progress' },
    { code: 'IT 314', title: 'Mobile Application Development', units: 3, instructor: 'Mr. Joel B. Ramos', pg: 1.25, mg: 1.25, fg: null, remarks: 'In Progress' },
    { code: 'IT 315', title: 'Quantitative Methods', units: 3, instructor: 'Ms. Kristine A. Domingo', pg: 2.25, mg: 2.0, fg: null, remarks: 'In Progress' },
    { code: 'GE 7', title: 'Science, Technology and Society', units: 3, instructor: 'Dr. Fernando R. Pascua', pg: 1.5, mg: 1.75, fg: null, remarks: 'In Progress' },
    { code: 'RIZAL', title: 'Life and Works of Rizal', units: 3, instructor: 'Prof. Arnel S. Tabios', pg: 1.75, mg: null, fg: null, remarks: 'In Progress' },
  ],
  '2025-2': [
    { code: 'IT 221', title: 'Information Management', units: 3, instructor: 'Prof. Maricel T. Ventura', pg: 1.75, mg: 1.5, fg: 1.5, remarks: 'Passed' },
    { code: 'IT 222', title: 'Networking 1', units: 3, instructor: 'Engr. Ramon D. Agustin', pg: 2.0, mg: 1.75, fg: 1.75, remarks: 'Passed' },
    { code: 'IT 223', title: 'Integrative Programming and Technologies 1', units: 3, instructor: 'Prof. Liza M. Cabrera', pg: 1.25, mg: 1.25, fg: 1.25, remarks: 'Passed' },
    { code: 'IT 224', title: 'Human Computer Interaction', units: 3, instructor: 'Mr. Joel B. Ramos', pg: 1.5, mg: 1.5, fg: 1.25, remarks: 'Passed' },
    { code: 'GE 5', title: 'Purposive Communication', units: 3, instructor: 'Ms. Rowena P. Aquino', pg: 1.75, mg: 2.0, fg: 1.75, remarks: 'Passed' },
    { code: 'GE 6', title: 'Art Appreciation', units: 3, instructor: 'Mr. Dennis L. Bautista', pg: 1.5, mg: 1.5, fg: 1.5, remarks: 'Passed' },
    { code: 'PE 4', title: 'Team Sports', units: 2, instructor: 'Coach Mario V. Santos', pg: 1.25, mg: 1.0, fg: 1.0, remarks: 'Passed' },
  ],
  '2025-1': [
    { code: 'IT 211', title: 'Data Structures and Algorithms', units: 3, instructor: 'Prof. Liza M. Cabrera', pg: 2.0, mg: 2.25, fg: 2.0, remarks: 'Passed' },
    { code: 'IT 212', title: 'Object-Oriented Programming', units: 3, instructor: 'Mr. Joel B. Ramos', pg: 1.5, mg: 1.5, fg: 1.5, remarks: 'Passed' },
    { code: 'IT 213', title: 'Platform Technologies', units: 3, instructor: 'Engr. Ramon D. Agustin', pg: 1.75, mg: 2.0, fg: 1.75, remarks: 'Passed' },
    { code: 'GE 3', title: 'The Contemporary World', units: 3, instructor: 'Dr. Fernando R. Pascua', pg: 1.75, mg: 1.75, fg: 1.75, remarks: 'Passed' },
    { code: 'GE 4', title: 'Mathematics in the Modern World', units: 3, instructor: 'Ms. Kristine A. Domingo', pg: 2.5, mg: 2.25, fg: 2.25, remarks: 'Passed' },
    { code: 'FIL 2', title: 'Pagbasa at Pagsulat Tungo sa Pananaliksik', units: 3, instructor: 'Gng. Teresita C. Ramirez', pg: 1.5, mg: 1.5, fg: 1.5, remarks: 'Passed' },
    { code: 'PE 3', title: 'Individual and Dual Sports', units: 2, instructor: 'Coach Mario V. Santos', pg: 1.25, mg: 1.25, fg: 1.25, remarks: 'Passed' },
  ],
};

/* ------------------------------------------------------------------ */
/* Tuition                                                             */
/* ------------------------------------------------------------------ */

export const tuition: Tuition = {
  term: '1st Semester, AY 2026–2027',
  fees: [
    { label: 'Tuition (21 units)', amount: 17850 },
    { label: 'Laboratory fees', amount: 4200 },
    { label: 'Miscellaneous fees', amount: 5350 },
    { label: 'Computer fee', amount: 1500 },
    { label: 'Library fee', amount: 800 },
    { label: 'Student development fee', amount: 600 },
    { label: 'Medical and dental fee', amount: 400 },
    { label: 'Athletic fee', amount: 350 },
  ],
  discounts: [{ label: 'Early enrollment discount', amount: 500 }],
  schedule: [
    { label: 'Downpayment', dueDate: '2026-08-03', amount: 5000, status: 'Paid' },
    { label: 'Prelim', dueDate: '2026-09-07', amount: 6387.5, status: 'Paid' },
    { label: 'Midterm', dueDate: '2026-10-12', amount: 6387.5, status: 'Paid' },
    { label: 'Pre-final', dueDate: '2026-11-17', amount: 6387.5, status: 'Partial' },
    { label: 'Final', dueDate: '2026-12-07', amount: 6387.5, status: 'Unpaid' },
  ],
  payments: [
    { id: 'p4', date: '2026-11-07', orNumber: 'OR-0458812', method: 'GCash', amount: 3000 },
    { id: 'p3', date: '2026-10-09', orNumber: 'OR-0451027', method: 'Cashier', amount: 6387.5 },
    { id: 'p2', date: '2026-09-04', orNumber: 'OR-0443390', method: 'Bank deposit', amount: 6387.5 },
    { id: 'p1', date: '2026-07-30', orNumber: 'OR-0430155', method: 'Cashier', amount: 5000 },
  ],
};

/* ------------------------------------------------------------------ */
/* Clearance (15 offices)                                              */
/* ------------------------------------------------------------------ */

export const clearance: ClearanceOffice[] = [
  { id: 'o1', office: 'Program Adviser', signatory: 'Prof. Liza M. Cabrera', status: 'Cleared', updatedAt: '2026-11-04' },
  { id: 'o2', office: 'Department Chair', signatory: 'Engr. Ramon D. Agustin', status: 'Cleared', updatedAt: '2026-11-04' },
  { id: 'o3', office: "Dean's Office", signatory: 'Dr. Rosario G. Valdez', status: 'Cleared', updatedAt: '2026-11-05' },
  { id: 'o4', office: 'Library', signatory: 'Ms. Imelda F. Corpuz', status: 'With Obligation', obligation: '1 overdue book (Database Systems, 7th ed.). Return it and settle the ₱45 fine.', updatedAt: '2026-11-10' },
  { id: 'o5', office: 'Computer Laboratory', signatory: 'Mr. Nestor P. Galang', status: 'With Obligation', obligation: 'Unreturned HDMI cable borrowed for Comp Lab 3 on Oct 21.', updatedAt: '2026-11-08' },
  { id: 'o6', office: 'Accounting Office', signatory: 'Mrs. Gloria S. Manzano', status: 'With Obligation', obligation: 'Outstanding balance for the pre-final and final periods.', updatedAt: '2026-11-11' },
  { id: 'o7', office: 'Registrar', signatory: 'Mr. Victor A. Lagmay', status: 'Cleared', updatedAt: '2026-11-03' },
  { id: 'o8', office: 'Guidance Office', signatory: 'Ms. Angelica R. Tolentino', status: 'Cleared', updatedAt: '2026-11-02' },
  { id: 'o9', office: 'Office of Student Affairs', signatory: 'Dr. Benjamin C. Ulep', status: 'Cleared', updatedAt: '2026-11-02' },
  { id: 'o10', office: 'University Clinic', signatory: 'Dr. Maria Theresa L. Pagdilao', status: 'Cleared', updatedAt: '2026-10-30' },
  { id: 'o11', office: 'Campus Ministry', signatory: 'Rev. Fr. Antonio M. Rabago', status: 'Cleared', updatedAt: '2026-10-29' },
  { id: 'o12', office: 'Physical Education Department', signatory: 'Coach Mario V. Santos', status: 'Cleared', updatedAt: '2026-10-29' },
  { id: 'o13', office: 'Supreme Student Council', signatory: 'SSC Treasurer', status: 'Cleared', updatedAt: '2026-10-28' },
  { id: 'o14', office: 'Property Custodian', signatory: 'Mr. Rogelio D. Ferrer', status: 'Cleared', updatedAt: '2026-10-28' },
  { id: 'o15', office: 'Security Office', signatory: 'Chief Danilo T. Ramos', status: 'Cleared', updatedAt: '2026-10-27' },
];

/* ------------------------------------------------------------------ */
/* Messages                                                            */
/* ------------------------------------------------------------------ */

export const messages: Message[] = [
  {
    id: 'm1',
    from: 'Accounting Office',
    role: 'Finance',
    subject: 'Reminder: pre-final balance',
    preview: 'You have a remaining balance of ₱3,387.50 for the pre-final period.',
    body:
      'Good day, Juan Miguel.\n\nThis is a reminder that you have a remaining balance of ₱3,387.50 for the pre-final period. The deadline has been extended to November 17, 2026.\n\nYou can pay at the Cashier, through GCash, or by bank deposit. Please keep your official receipt.\n\nThank you,\nAccounting Office',
    date: '2026-11-12T09:15:00+08:00',
    unread: true,
  },
  {
    id: 'm2',
    from: 'Prof. Liza M. Cabrera',
    role: 'Program Adviser',
    subject: 'Advising for 2nd semester enrollment',
    preview: 'Please book a 15-minute advising slot before the end of November.',
    body:
      'Hi Juan Miguel,\n\nPlease book a 15-minute advising slot with me before the end of November so we can go over your subjects for the 2nd semester. Bring a copy of your checklist.\n\nSlots are posted outside the CCS faculty room.\n\nProf. Cabrera',
    date: '2026-11-11T14:02:00+08:00',
    unread: true,
  },
  {
    id: 'm3',
    from: 'Library',
    role: 'University Library',
    subject: 'Overdue book notice',
    preview: 'Database Systems (7th ed.) was due on November 3.',
    body:
      'Database Systems (7th ed.) was due on November 3, 2026. A fine of ₱5 per school day applies. Please return the book at the circulation desk to clear your library record.',
    date: '2026-11-10T08:30:00+08:00',
    unread: false,
  },
  {
    id: 'm4',
    from: 'Mr. Joel B. Ramos',
    role: 'IT 314 Instructor',
    subject: 'Mobile app project checkpoint',
    preview: 'Checkpoint 2 demos will be on Thursday. Bring a working build.',
    body:
      'Class,\n\nCheckpoint 2 demos will be on Thursday during our regular schedule. Each group gets 7 minutes. Bring a working build on a phone or emulator, and be ready to explain your data model.\n\nMr. Ramos',
    date: '2026-11-09T19:45:00+08:00',
    unread: false,
  },
  {
    id: 'm5',
    from: 'Office of Student Affairs',
    role: 'Student Affairs',
    subject: 'University Week volunteers',
    preview: 'We are looking for student volunteers for University Week.',
    body:
      'We are looking for student volunteers for University Week (November 20 to 22). Volunteers get community service hours. Sign up at the OSA office or reply to this message.',
    date: '2026-11-05T10:00:00+08:00',
    unread: false,
  },
  {
    id: 'm6',
    from: 'Registrar',
    role: "Registrar's Office",
    subject: 'Midterm grades posted',
    preview: 'Midterm grades for the 1st semester are now available in the app.',
    body:
      'Midterm grades for the 1st semester, AY 2026–2027 are now available. If you see an error, talk to your instructor first, then file a grade correction request at the Registrar within 10 school days.',
    date: '2026-10-28T16:20:00+08:00',
    unread: false,
  },
];

/* ------------------------------------------------------------------ */
/* Faculty evaluation                                                  */
/* ------------------------------------------------------------------ */

export const evaluationPeriod = {
  term: '1st Semester, AY 2026–2027',
  deadline: '2026-11-28',
  criteria: [
    'Knows the subject matter well',
    'Explains lessons clearly',
    'Comes to class on time and prepared',
    'Treats students fairly and with respect',
    'Gives useful feedback on work',
  ],
};

export const facultyToEvaluate: FacultyToEvaluate[] = [
  { id: 'f1', name: 'Engr. Ramon D. Agustin', subjectCode: 'IT 311', subjectTitle: 'Information Assurance and Security 1', submitted: true },
  { id: 'f2', name: 'Prof. Liza M. Cabrera', subjectCode: 'IT 312', subjectTitle: 'Integrative Programming and Technologies 2', submitted: true },
  { id: 'f3', name: 'Prof. Maricel T. Ventura', subjectCode: 'IT 313', subjectTitle: 'Systems Integration and Architecture', submitted: false },
  { id: 'f4', name: 'Mr. Joel B. Ramos', subjectCode: 'IT 314', subjectTitle: 'Mobile Application Development', submitted: false },
  { id: 'f5', name: 'Ms. Kristine A. Domingo', subjectCode: 'IT 315', subjectTitle: 'Quantitative Methods', submitted: false },
  { id: 'f6', name: 'Dr. Fernando R. Pascua', subjectCode: 'GE 7', subjectTitle: 'Science, Technology and Society', submitted: false },
  { id: 'f7', name: 'Prof. Arnel S. Tabios', subjectCode: 'RIZAL', subjectTitle: 'Life and Works of Rizal', submitted: false },
];
