import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { initials } from '@/format';
import { colors, iconSize, maxContentWidth, minTouch, motion, radius, shadow, spacing } from '@/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Decorative icon: hidden from screen readers because the text next to it
 * already says what it means. Pass `label` when the icon stands alone.
 */
export function Icon({
  name,
  size = iconSize.md,
  color = colors.text,
  label,
  style,
}: {
  name: IconName;
  size?: number;
  color?: string;
  label?: string;
  style?: StyleProp<TextStyle>;
}) {
  if (label) {
    return <Ionicons name={name} size={size} color={color} style={style} accessibilityLabel={label} accessible />;
  }
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style}
      aria-hidden
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}

/** Gold seal with the school initials. Placeholder until the official logo is added. */
export function Seal({ size = 40 }: { size?: number }) {
  return (
    <View
      accessibilityLabel="Northwestern University seal"
      accessibilityRole="image"
      style={[
        styles.seal,
        { width: size, height: size, borderRadius: size / 2, borderWidth: Math.max(2, size / 16) },
      ]}>
      <Text style={[styles.sealText, { fontSize: size * 0.3 }]}>NWU</Text>
    </View>
  );
}

/** Maroon header used at the top of each tab screen. */
export function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[colors.maroonBright, colors.maroon, colors.maroonDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.headerInner}>
        <Seal size={36} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right}
      </View>
    </LinearGradient>
  );
}

/** Tab screen shell: maroon header plus a centered, scrollable content column. */
export function Screen({
  title,
  subtitle,
  headerRight,
  children,
}: {
  title: string;
  subtitle?: string;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={styles.screen}>
      <ScreenHeader title={title} subtitle={subtitle} right={headerRight} />
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </View>
  );
}

/** Plain scrolling column for stack screens that already have a native header. */
export function Page({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: spacing.xxl + insets.bottom }]}>
      {children}
    </ScrollView>
  );
}

export function Card({
  children,
  style,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        onPress={onPress}
        android_ripple={{ color: colors.maroonSoft }}
        style={({ pressed }) => [styles.card, style, pressed && styles.cardPressed]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children, action }: { children: string; action?: ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {children}
      </Text>
      {action}
    </View>
  );
}

export type Tone = 'success' | 'danger' | 'gold' | 'maroon' | 'muted';

export const toneColors: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: colors.successSoft, fg: colors.success },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  gold: { bg: colors.goldSoft, fg: colors.goldText },
  maroon: { bg: colors.maroonSoft, fg: colors.maroon },
  muted: { bg: colors.neutralSoft, fg: colors.textMuted },
};

export function Pill({ label, tone, icon }: { label: string; tone: Tone; icon?: IconName }) {
  const t = toneColors[tone];
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      {icon ? <Icon name={icon} size={12} color={t.fg} /> : null}
      <Text style={[styles.pillText, { color: t.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

export function Row({
  label,
  value,
  labelStyle,
  valueStyle,
}: {
  label: string;
  value: string;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View style={styles.kvRow} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={[styles.kvLabel, labelStyle]}>{label}</Text>
      <Text style={[styles.kvValue, valueStyle]}>{value}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = 'maroon',
  icon,
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'maroon' | 'gold' | 'outline' | 'danger';
  icon?: IconName;
  accessibilityHint?: string;
}) {
  const bg =
    tone === 'maroon' ? colors.maroon : tone === 'gold' ? colors.gold : tone === 'danger' ? colors.danger : 'transparent';
  const fg = tone === 'maroon' || tone === 'danger' ? '#fff' : colors.maroon;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg },
        tone === 'outline' && styles.buttonOutline,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}>
      {icon ? <Icon name={icon} size={18} color={fg} /> : null}
      <Text style={[styles.buttonText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  count,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  count?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={count !== undefined ? `${label}, ${count}` : label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
      {count !== undefined ? (
        <View style={[styles.chipCount, selected && styles.chipCountSelected]}>
          <Text style={[styles.chipCountText, selected && { color: colors.maroon }]}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/** Horizontal progress bar. Pass `segments` to split the track into equal parts. */
export function ProgressBar({
  value,
  color = colors.maroon,
  trackColor = colors.border,
  height = 8,
  label,
}: {
  value: number;
  color?: string;
  trackColor?: string;
  height?: number;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(1, value));
  const reduced = useReducedMotion();
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduced) {
      anim.setValue(pct);
      return;
    }
    Animated.timing(anim, {
      toValue: pct,
      duration: motion.slow * 2,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct, reduced, anim]);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: trackColor }]}>
      <Animated.View
        style={{
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: color,
          width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  );
}

/** Circle with a person's or office's initials. */
export function Avatar({
  name,
  size = 44,
  tone = 'maroon',
  ring,
}: {
  name: string;
  size?: number;
  tone?: Tone;
  ring?: boolean;
}) {
  const t = toneColors[tone];
  return (
    <View
      aria-hidden
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: t.bg },
        ring && { borderWidth: 2, borderColor: colors.gold },
      ]}>
      <Text style={[styles.avatarText, { color: t.fg, fontSize: size * 0.34 }]}>{initials(name)}</Text>
    </View>
  );
}

/** Centered message for empty lists. */
export function EmptyState({ icon, title, body }: { icon: IconName; title: string; body?: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={26} color={colors.goldText} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {body ? <Text style={styles.emptyBody}>{body}</Text> : null}
    </View>
  );
}

/**
 * Show/hide toggle for extra detail. The content fades and slides in; with
 * reduce motion on, it just appears.
 */
export function Collapsible({
  label,
  openLabel,
  children,
  initiallyOpen = false,
}: {
  label: string;
  openLabel?: string;
  children: ReactNode;
  initiallyOpen?: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const reduced = useReducedMotion();
  const [anim] = useState(() => new Animated.Value(initiallyOpen ? 1 : 0));

  useEffect(() => {
    if (reduced) {
      anim.setValue(open ? 1 : 0);
      return;
    }
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: open ? motion.base : motion.exit,
      easing: open ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [open, reduced, anim]);

  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View>
      {open ? (
        <Animated.View
          style={{
            opacity: anim,
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) }],
          }}>
          {children}
        </Animated.View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        hitSlop={8}
        style={({ pressed }) => [styles.disclosure, pressed && styles.pressed]}>
        <Text style={styles.disclosureText}>{open ? (openLabel ?? label) : label}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon name="chevron-down" size={iconSize.sm} color={colors.maroon} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md + 2,
    borderBottomWidth: 3,
    borderBottomColor: colors.gold,
  },
  headerInner: {
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700', letterSpacing: 0.2 },
  headerSubtitle: { color: colors.onMaroonMuted, fontSize: 13, marginTop: 2 },
  seal: {
    backgroundColor: colors.gold,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: { color: colors.maroon, fontWeight: '800', letterSpacing: 0.5 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadow,
  },
  cardPressed: { backgroundColor: colors.surfaceMuted, opacity: 0.9 },
  pressed: { opacity: 0.7 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  pillText: { fontSize: 12, fontWeight: '600' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    gap: spacing.md,
  },
  kvLabel: { color: colors.textMuted, fontSize: 14, flexShrink: 1 },
  kvValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
    textAlign: 'right',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  buttonOutline: { borderWidth: 1.5, borderColor: colors.maroon },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { fontSize: 16, fontWeight: '700' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.text },
  chipTextSelected: { color: '#fff' },
  chipCount: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: colors.neutralSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCountSelected: { backgroundColor: colors.gold },
  chipCountText: { fontSize: 12, fontWeight: '700', color: colors.textMuted, fontVariant: ['tabular-nums'] },
  track: { width: '100%', overflow: 'hidden' },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.xs },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptyBody: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  disclosure: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: minTouch,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },
  disclosureText: { color: colors.maroon, fontSize: 14, fontWeight: '700' },
});
