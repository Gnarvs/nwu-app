import Constants from 'expo-constants';
import { Platform, StyleSheet, Switch, Text, View } from 'react-native';

import { Avatar, Card, Icon, Page, Row, SectionTitle, type IconName } from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { student } from '@/data/sampleData';
import { colors, spacing } from '@/theme';

export default function SettingsScreen() {
  const { settings, setSetting } = useAppState();

  return (
    <Page>
      <Card style={styles.profile}>
        <Avatar name={`${student.firstName} ${student.lastName}`} size={56} tone="gold" ring />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>
            {student.firstName} {student.lastName}
          </Text>
          <Text style={styles.profileMeta}>
            {student.id} · {student.section}
          </Text>
        </View>
      </Card>

      <SectionTitle>Account</SectionTitle>
      <Card>
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
          icon="notifications-outline"
          value={settings.pushNotifications}
          onChange={(v) => setSetting('pushNotifications', v)}
        />
        <Toggle
          label="Email updates"
          icon="mail-outline"
          value={settings.emailUpdates}
          onChange={(v) => setSetting('emailUpdates', v)}
        />
        <Toggle
          label="Alert me when grades are posted"
          icon="school-outline"
          value={settings.gradeAlerts}
          onChange={(v) => setSetting('gradeAlerts', v)}
        />
        <Toggle
          label="Payment due reminders"
          icon="wallet-outline"
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
  icon,
  value,
  onChange,
  last,
}: {
  label: string;
  icon: IconName;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.toggle, !last && styles.border]}>
      <View style={styles.toggleIcon}>
        <Icon name={icon} size={18} color={colors.maroon} />
      </View>
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
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  profileName: { fontSize: 18, fontWeight: '800', color: colors.text },
  profileMeta: { fontSize: 14, color: colors.textMuted, marginTop: 2, fontVariant: ['tabular-nums'] },
  toggleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.maroonSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggle: {
    minHeight: 56,
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
