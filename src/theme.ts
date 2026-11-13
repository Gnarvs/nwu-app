import { Platform } from 'react-native';

export const colors = {
  maroon: '#7A0E0E',
  maroonDark: '#5C0909',
  maroonSoft: '#F6E7E7',
  gold: '#F2B705',
  goldSoft: '#FDF3D3',
  goldText: '#7A5A00',
  background: '#F7F3EE',
  surface: '#FFFFFF',
  text: '#1F1A17',
  textMuted: '#6B625C',
  border: '#E8E0D8',
  success: '#1E7A46',
  successSoft: '#E3F3EA',
  danger: '#B42318',
  dangerSoft: '#FDECEA',
  overlay: 'rgba(20, 10, 10, 0.45)',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

/** Content width cap so the app reads well on desktop browsers. */
export const maxContentWidth = 720;

export const shadow = Platform.select({
  web: { boxShadow: '0 1px 3px rgba(60, 20, 20, 0.08)' },
  default: {
    shadowColor: '#3C1414',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
}) as object;
