import Ionicons from '@expo/vector-icons/Ionicons';
import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type HostInstance,
  type ScrollViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, maxContentWidth } from '@/theme';

import { MenuSheet } from './menu-sheet';
import type { IconName } from './ui';

type ScrollCtx = {
  register: (key: string, x: number, width: number) => void;
  reveal: (key: string) => void;
};

const TabScrollContext = createContext<ScrollCtx | null>(null);

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

  const [ctx] = useState<ScrollCtx>(() => ({
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
  }));

  return (
    <View {...rest} style={[styles.bar, { paddingBottom: insets.bottom }, style]}>
      <View style={styles.inner}>
        <TabScrollContext.Provider value={ctx}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scroller}
            contentContainerStyle={styles.scrollContent}
            onLayout={(e) => {
              viewport.current = e.nativeEvent.layout.width;
              if (focused.current) ctx.reveal(focused.current);
            }}>
            {children}
          </ScrollView>
        </TabScrollContext.Provider>

        <View style={styles.pinned}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => setMenuOpen(true)}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
            <View style={styles.menuIcon}>
              <Ionicons name="menu" size={20} color={colors.maroon} />
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

  useEffect(() => {
    if (isFocused) scroll?.reveal(tabKey);
  }, [isFocused, scroll, tabKey]);

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
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
      <View style={[styles.indicator, isFocused && styles.indicatorOn]} />
      <View>
        <Ionicons
          name={isFocused ? iconFocused : icon}
          size={22}
          color={isFocused ? colors.maroon : colors.textMuted}
        />
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

const TAB_WIDTH = 78;

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
  scrollContent: { paddingHorizontal: 4 },
  pinned: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 4,
  },
  tab: {
    width: TAB_WIDTH,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  pressed: { opacity: 0.6 },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 18,
    right: 18,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: 'transparent',
  },
  indicatorOn: { backgroundColor: colors.gold },
  label: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  labelFocused: { color: colors.maroon },
  menuIcon: {
    width: 30,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
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
