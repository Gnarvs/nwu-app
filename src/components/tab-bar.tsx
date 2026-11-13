import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { LinearGradient } from 'expo-linear-gradient';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type HostInstance,
  type ScrollViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors, maxContentWidth, motion } from '@/theme';

import { MenuSheet } from './menu-sheet';
import { Icon, type IconName } from './ui';

type ScrollCtx = {
  register: (key: string, x: number, width: number) => void;
  reveal: (key: string) => void;
  tabWidth: number;
};

const TabScrollContext = createContext<ScrollCtx | null>(null);

const TAB_COUNT = 6;
const MIN_TAB_WIDTH = 66;
const MAX_TAB_WIDTH = 96;

/**
 * Pick a tab width for the space we have. When every tab fits, they share the
 * row evenly. When they don't, the width is chosen so the last visible tab is
 * cut roughly in half, which reads as "scroll for more" instead of looking
 * like a clipped label.
 */
function tabWidthFor(viewport: number) {
  if (!viewport) return 78;
  if (viewport / TAB_COUNT >= MIN_TAB_WIDTH) return Math.min(MAX_TAB_WIDTH, viewport / TAB_COUNT);
  const whole = Math.max(1, Math.floor(viewport / MIN_TAB_WIDTH - 0.5));
  return viewport / (whole + 0.5);
}

/**
 * Bottom tab bar: the tabs scroll sideways, and the Menu button stays pinned
 * on the right. Used as the child of expo-router/ui's <TabList asChild>.
 */
export function AppTabBar({ children, style, ...rest }: TabListProps & { children?: ReactNode }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const layouts = useRef(new Map<string, { x: number; width: number }>());
  const viewport = useRef(0);
  const focused = useRef<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const tabWidth = tabWidthFor(viewportWidth);

  const ctx = useMemo<ScrollCtx>(
    () => ({
      tabWidth,
      register: (key, x, width) => layouts.current.set(key, { x, width }),
      reveal: (key) => {
        focused.current = key;
        const l = layouts.current.get(key);
        // Wait until both the tab and the scroll viewport have been measured.
        if (!l || !viewport.current || !scrollRef.current) return;
        // Center the focused tab when possible so its neighbors are visible too.
        const target = Math.max(0, l.x - (viewport.current - l.width) / 2);
        scrollRef.current.scrollTo({ x: target, animated: true });
      },
    }),
    [tabWidth],
  );

  const overflow = contentWidth - viewportWidth;
  const showLeftFade = overflow > 1 && scrollX > 4;
  const showRightFade = overflow > 1 && scrollX < overflow - 4;

  return (
    <View {...rest} style={[styles.bar, { paddingBottom: insets.bottom }, style]}>
      <View style={styles.inner}>
        <TabScrollContext.Provider value={ctx}>
          <View style={styles.scroller}>
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={32}
              onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
              onContentSizeChange={(w) => setContentWidth(w)}
              contentContainerStyle={styles.scrollContent}
              onLayout={(e) => {
                viewport.current = e.nativeEvent.layout.width;
                setViewportWidth(e.nativeEvent.layout.width);
                if (focused.current) ctx.reveal(focused.current);
              }}>
              {children}
            </ScrollView>
            {showLeftFade ? (
              <LinearGradient
                pointerEvents="none"
                colors={[colors.surface, 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.fade, { left: 0 }]}
              />
            ) : null}
            {showRightFade ? (
              <LinearGradient
                pointerEvents="none"
                colors={['rgba(255,255,255,0)', colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.fade, { right: 0 }]}
              />
            ) : null}
          </View>
        </TabScrollContext.Provider>

        <View style={styles.pinned}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            accessibilityHint="Faculty evaluation, settings and sign out"
            onPress={() => setMenuOpen(true)}
            style={({ pressed }) => [styles.tab, { width: 72 }, pressed && styles.pressed]}>
            <View style={styles.menuIcon}>
              <Icon name="menu" size={20} color={colors.maroon} />
            </View>
            <Text style={[styles.label, styles.labelFocused]}>Menu</Text>
          </Pressable>
        </View>
      </View>
      <MenuSheet visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

type TabButtonProps = Omit<TabTriggerSlotProps, 'ref'> & {
  ref?: Ref<HostInstance>;
  tabKey: string;
  icon: IconName;
  iconFocused: IconName;
  label: string;
  badge?: number;
};

/** One tab. Receives isFocused/onPress from <TabTrigger asChild>. */
export function TabButton({ ref, tabKey, icon, iconFocused, label, badge, isFocused, ...props }: TabButtonProps) {
  const scroll = useContext(TabScrollContext);
  const reduced = useReducedMotion();
  const [pill] = useState(() => new Animated.Value(isFocused ? 1 : 0));

  useEffect(() => {
    if (isFocused) scroll?.reveal(tabKey);
  }, [isFocused, scroll, tabKey]);

  useEffect(() => {
    const to = isFocused ? 1 : 0;
    if (reduced) {
      pill.setValue(to);
      return;
    }
    Animated.timing(pill, {
      toValue: to,
      duration: isFocused ? motion.base : motion.exit,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isFocused, reduced, pill]);

  return (
    <Pressable
      ref={ref}
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      accessibilityLabel={badge ? `${label}, ${badge} unread` : label}
      onLayout={(e) => {
        scroll?.register(tabKey, e.nativeEvent.layout.x, e.nativeEvent.layout.width);
        if (isFocused) scroll?.reveal(tabKey);
      }}
      style={({ pressed }) => [styles.tab, { width: scroll?.tabWidth ?? 78 }, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Animated.View
          style={[
            styles.pill,
            { opacity: pill, transform: [{ scaleX: pill.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] },
          ]}
        />
        <Icon name={isFocused ? iconFocused : icon} size={22} color={isFocused ? colors.maroon : colors.textMuted} />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.label, isFocused && styles.labelFocused]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  inner: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
  scroller: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  fade: { position: 'absolute', top: 0, bottom: 0, width: 40 },
  pinned: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 2,
  },
  tab: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  pressed: { opacity: 0.6 },
  iconWrap: { width: 56, height: 30, alignItems: 'center', justifyContent: 'center' },
  pill: {
    ...StyleSheet.absoluteFill,
    borderRadius: 15,
    backgroundColor: colors.maroonSoft,
  },
  label: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  labelFocused: { color: colors.maroon, fontWeight: '700' },
  menuIcon: {
    width: 56,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: 6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.maroon,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
