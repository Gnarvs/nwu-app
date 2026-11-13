import { Platform } from 'react-native';

export const colors = {
  maroon: '#7A0E0E',
  maroonDark: '#5C0909',
  maroonDeep: '#4A0707',
  maroonBright: '#9B1C1C',
  maroonSoft: '#F6E7E7',
  gold: '#F2B705',
  goldSoft: '#FDF3D3',
  goldText: '#7A5A00',
  background: '#F7F3EE',
  surface: '#FFFFFF',
  surfaceMuted: '#FBF8F5',
  text: '#1F1A17',
  textMuted: '#6B625C',
  /** Muted text on maroon surfaces (contrast 7.9:1 on maroon). */
  onMaroonMuted: '#F3D9D9',
  border: '#E8E0D8',
  neutralSoft: '#EFEAE5',
  success: '#1E7A46',
  successSoft: '#E3F3EA',
  danger: '#B42318',
  dangerSoft: '#FDECEA',
  overlay: 'rgba(20, 10, 10, 0.5)',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

export const iconSize = { sm: 16, md: 20, lg: 24 };

/** Shared animation timings (ms). Exits run a little faster than entrances. */
export const motion = { fast: 150, base: 220, exit: 180, slow: 300 };

/** Content width cap so the app reads well on desktop browsers. */
export const maxContentWidth = 720;

/** Minimum touch target (iOS 44pt, Android 48dp). */
export const minTouch = 44;

export const shadow = Platform.select({
  web: { boxShadow: '0 1px 2px rgba(60, 20, 20, 0.06), 0 2px 8px rgba(60, 20, 20, 0.05)' },
  default: {
    shadowColor: '#3C1414',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
}) as object;

export const shadowRaised = Platform.select({
  web: { boxShadow: '0 6px 20px rgba(74, 7, 7, 0.22)' },
  default: {
    shadowColor: '#4A0707',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
}) as object;
