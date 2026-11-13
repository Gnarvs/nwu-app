import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { facultyToEvaluate, messages } from '@/data/sampleData';

/**
 * Small in-memory app state: sign-in, which messages were opened, which
 * evaluations were sent, and settings toggles. Nothing is saved between
 * launches; swap this for real session handling when connecting to the
 * school's system.
 */
type Settings = {
  pushNotifications: boolean;
  emailUpdates: boolean;
  gradeAlerts: boolean;
  paymentReminders: boolean;
};

type AppState = {
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  readMessageIds: Set<string>;
  markMessageRead: (id: string) => void;
  unreadCount: number;
  submittedEvaluations: Set<string>;
  submitEvaluation: (facultyId: string) => void;
  pendingEvaluations: number;
  settings: Settings;
  setSetting: (key: keyof Settings, value: boolean) => void;
};

const AppStateContext = createContext<AppState | null>(null);

const initialRead = new Set(messages.filter((m) => !m.unread).map((m) => m.id));
const initialSubmitted = new Set(facultyToEvaluate.filter((f) => f.submitted).map((f) => f.id));

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(true);
  const [readMessageIds, setReadMessageIds] = useState(initialRead);
  const [submittedEvaluations, setSubmitted] = useState(initialSubmitted);
  const [settings, setSettings] = useState<Settings>({
    pushNotifications: true,
    emailUpdates: true,
    gradeAlerts: true,
    paymentReminders: false,
  });

  const markMessageRead = useCallback((id: string) => {
    setReadMessageIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const submitEvaluation = useCallback((facultyId: string) => {
    setSubmitted((prev) => new Set(prev).add(facultyId));
  }, []);

  const setSetting = useCallback((key: keyof Settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      signedIn,
      signIn: () => setSignedIn(true),
      signOut: () => setSignedIn(false),
      readMessageIds,
      markMessageRead,
      unreadCount: messages.filter((m) => !readMessageIds.has(m.id)).length,
      submittedEvaluations,
      submitEvaluation,
      pendingEvaluations: facultyToEvaluate.filter((f) => !submittedEvaluations.has(f.id)).length,
      settings,
      setSetting,
    }),
    [signedIn, readMessageIds, markMessageRead, submittedEvaluations, submitEvaluation, settings, setSetting],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
