import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton, Seal } from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { student } from '@/data/sampleData';
import { colors, radius, spacing } from '@/theme';

/**
 * Demo sign-in. Any password works; the student ID is prefilled with the
 * sample student. Replace with the school's real login when available.
 */
export default function SignInScreen() {
  const { signIn } = useAppState();
  const insets = useSafeAreaInsets();
  const [studentId, setStudentId] = useState(student.id);
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <Seal size={88} />
          <Text style={styles.school}>Northwestern University</Text>
          <Text style={styles.app}>Student Portal</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.label}>Student ID</Text>
          <TextInput
            value={studentId}
            onChangeText={setStudentId}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            placeholder="2023-00000"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholder="Any password works in this demo"
            placeholderTextColor={colors.textMuted}
            onSubmitEditing={signIn}
          />
          <View style={{ marginTop: spacing.lg }}>
            <PrimaryButton label="Sign in" onPress={signIn} disabled={!studentId.trim()} />
          </View>
          <Text style={styles.demo}>Demo only. Sample data, no real accounts.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.maroon },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.xxl },
  brand: { alignItems: 'center', gap: spacing.sm },
  school: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: spacing.md, textAlign: 'center' },
  app: { color: colors.gold, fontSize: 15, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderTopWidth: 4,
    borderTopColor: colors.gold,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginTop: spacing.md, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  demo: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
});
