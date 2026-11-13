import Constants from 'expo-constants';
import { Platform, StyleSheet, Switch, Text, View } from 'react-native';

import { Card, Page, Row, SectionTitle } from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { student } from '@/data/sampleData';
import { colors, spacing } from '@/theme';

export default function SettingsScreen() {
  const { settings, setSetting } = useAppState();

  return (
    <Page>
      <SectionTitle>Account</SectionTitle>
      <Card>
        <Row label="Name" value={`${student.firstName} ${student.lastName}`} />
        <Row label="Student ID" value={student.id} />
        <Row label="Email" value={student.email} />
        <Row label="Program" value={student.program} />
        <Row label="College" value={student.college} />
        <Row label="Year and section" value={`${student.yearLevel}, ${student.section}`} />
        <Row label="Adviser" value={student.adviser} />
      </Card>

      <SectionTitle>Notifications</SectionTitle>
      <Card style={{ paddingVertical: spacing.xs }}>
        <Toggle
          label="Push notifications"
          value={settings.pushNotifications}
          onChange={(v) => setSetting('pushNotifications', v)}
        />
        <Toggle label="Email updates" value={settings.emailUpdates} onChange={(v) => setSetting('emailUpdates', v)} />
        <Toggle
          label="Alert me when grades are posted"
          value={settings.gradeAlerts}
          onChange={(v) => setSetting('gradeAlerts', v)}
        />
        <Toggle
          label="Payment due reminders"
          value={settings.paymentReminders}
          onChange={(v) => setSetting('paymentReminders', v)}
          last
        />
      </Card>

      <SectionTitle>About</SectionTitle>
      <Card>
        <Row label="App version" value={Constants.expoConfig?.version ?? '1.0.0'} />
        <Text style={styles.note}>
          This build uses sample data only. No real student records are shown or stored.
        </Text>
      </Card>
    </Page>
  );
}

function Toggle({
  label,
  value,
  onChange,
  last,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.toggle, !last && styles.border]}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.maroon }}
        thumbColor={value ? colors.gold : '#fff'}
        // react-native-web colors the "on" thumb with this prop instead of thumbColor.
        {...(Platform.OS === 'web' ? ({ activeThumbColor: colors.gold } as object) : {})}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  toggleLabel: { fontSize: 15, color: colors.text, flex: 1 },
  note: { fontSize: 13, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 19 },
});
