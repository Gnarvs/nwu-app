import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, PrimaryButton, Seal, type IconName } from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { student } from '@/data/sampleData';
import { colors, minTouch, radius, shadowRaised, spacing } from '@/theme';

/**
 * Demo sign-in. Any password works; the student ID is prefilled with the
 * sample student. Replace with the school's real login when available.
 */
export default function SignInScreen() {
  const { signIn } = useAppState();
  const insets = useSafeAreaInsets();
  const [studentId, setStudentId] = useState(student.id);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<'id' | 'password' | null>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const canSubmit = !!studentId.trim();

  return (
    <LinearGradient
      colors={[colors.maroonBright, colors.maroon, colors.maroonDeep]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.root}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <Seal size={88} />
            <Text style={styles.school} accessibilityRole="header">
              Northwestern University
            </Text>
            <Text style={styles.app}>Student Portal</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.subtitle}>Use your student ID and portal password.</Text>

            <Field label="Student ID" icon="id-card-outline" focused={focused === 'id'}>
              <TextInput
                value={studentId}
                onChangeText={setStudentId}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                textContentType="username"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                onFocus={() => setFocused('id')}
                onBlur={() => setFocused(null)}
                style={styles.input}
                placeholder="2023-00000"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Student ID"
              />
            </Field>

            <Field
              label="Password"
              icon="lock-closed-outline"
              focused={focused === 'password'}
              helper="Demo only: any password works."
              trailing={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  onPress={() => setShowPassword((v) => !v)}
                  style={({ pressed }) => [styles.eye, pressed && { opacity: 0.6 }]}>
                  <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
                </Pressable>
              }>
              <TextInput
                ref={passwordRef}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCorrect={false}
                autoCapitalize="none"
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                onSubmitEditing={() => canSubmit && signIn()}
                accessibilityLabel="Password"
              />
            </Field>

            <View style={{ marginTop: spacing.xl }}>
              <PrimaryButton label="Sign in" icon="log-in-outline" onPress={signIn} disabled={!canSubmit} />
            </View>
            <View style={styles.demo}>
              <Icon name="flask-outline" size={14} color={colors.goldText} />
              <Text style={styles.demoText}>Demo build with sample data only.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function Field({
  label,
  icon,
  focused,
  helper,
  trailing,
  children,
}: {
  label: string;
  icon: IconName;
  focused: boolean;
  helper?: string;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <Icon name={icon} size={18} color={focused ? colors.maroon : colors.textMuted} />
        {children}
        {trailing}
      </View>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  glowTop: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    top: -180,
    right: -120,
    backgroundColor: 'rgba(242, 183, 5, 0.08)',
  },
  glowBottom: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: -150,
    left: -110,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.xxl },
  brand: { alignItems: 'center', gap: spacing.sm },
  school: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: spacing.md, textAlign: 'center' },
  app: { color: colors.gold, fontSize: 14, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderTopWidth: 4,
    borderTopColor: colors.gold,
    ...shadowRaised,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingLeft: spacing.md,
    backgroundColor: colors.surfaceMuted,
    minHeight: 50,
  },
  inputWrapFocused: { borderColor: colors.maroon, backgroundColor: colors.surface },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingRight: spacing.md,
    fontSize: 16,
    color: colors.text,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  eye: { width: minTouch, height: minTouch, alignItems: 'center', justifyContent: 'center' },
  helper: { fontSize: 12, color: colors.textMuted, marginTop: 6 },
  demo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.lg,
    backgroundColor: colors.goldSoft,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    alignSelf: 'center',
  },
  demoText: { fontSize: 12, color: colors.goldText, fontWeight: '600' },
});
