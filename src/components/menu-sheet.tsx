import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppState } from '@/context/app-state';
import { student } from '@/data/sampleData';
import { colors, radius, spacing } from '@/theme';

import { BottomSheet } from './bottom-sheet';
import { PrimaryButton, Seal, type IconName } from './ui';

export function MenuSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { pendingEvaluations, signOut } = useAppState();
  const [confirming, setConfirming] = useState(false);
  const [wasVisible, setWasVisible] = useState(visible);

  // Always reopen on the main list, not the sign-out confirmation.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setConfirming(false);
  }

  const go = (path: '/faculty-evaluation' | '/settings') => {
    onClose();
    router.push(path);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.profile}>
        <Seal size={44} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {student.firstName} {student.lastName}
          </Text>
          <Text style={styles.meta}>
            {student.id} · {student.section}
          </Text>
        </View>
      </View>

      {confirming ? (
        <View style={styles.confirm}>
          <Text style={styles.confirmTitle}>Sign out of NWU Student?</Text>
          <Text style={styles.confirmBody}>You will need to sign in again to see your records.</Text>
          <View style={styles.confirmButtons}>
            <View style={{ flex: 1 }}>
              <PrimaryButton label="Cancel" tone="outline" onPress={() => setConfirming(false)} />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Sign out"
                onPress={() => {
                  onClose();
                  signOut();
                }}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.list}>
          <MenuItem
            icon="clipboard-outline"
            label="Faculty evaluation"
            detail={pendingEvaluations > 0 ? `${pendingEvaluations} pending` : 'All done'}
            onPress={() => go('/faculty-evaluation')}
          />
          <MenuItem icon="settings-outline" label="Settings" onPress={() => go('/settings')} />
          <MenuItem icon="log-out-outline" label="Sign out" danger onPress={() => setConfirming(true)} />
        </View>
      )}
    </BottomSheet>
  );
}

function MenuItem({
  icon,
  label,
  detail,
  danger,
  onPress,
}: {
  icon: IconName;
  label: string;
  detail?: string;
  danger?: boolean;
  onPress: () => void;
}) {
  const tint = danger ? colors.danger : colors.maroon;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && { backgroundColor: colors.background }]}>
      <View style={[styles.itemIcon, { backgroundColor: danger ? colors.dangerSoft : colors.maroonSoft }]}>
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <Text style={[styles.itemLabel, danger && { color: colors.danger }]}>{label}</Text>
      {detail ? <Text style={styles.itemDetail}>{detail}</Text> : null}
      {!danger ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.lg,
    marginBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  name: { fontSize: 17, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  list: { gap: 2 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  itemIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
  itemDetail: { fontSize: 13, color: colors.goldText, fontWeight: '600' },
  confirm: { paddingVertical: spacing.sm, gap: spacing.sm },
  confirmTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  confirmBody: { fontSize: 14, color: colors.textMuted },
  confirmButtons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
});
