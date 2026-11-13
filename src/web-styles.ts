import { Platform } from 'react-native';

import { colors } from '@/theme';

/**
 * Web-only CSS that React Native styles can't express: a visible keyboard
 * focus ring and honoring the browser's reduce-motion setting.
 */
export function installWebStyles() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById('nwu-web-styles')) return;
  const style = document.createElement('style');
  style.id = 'nwu-web-styles';
  style.textContent = `
    [role="button"]:focus-visible, [role="tab"]:focus-visible, [role="link"]:focus-visible,
    [role="radio"]:focus-visible, [role="switch"]:focus-visible, a:focus-visible {
      outline: 3px solid ${colors.gold} !important;
      outline-offset: 2px;
      border-radius: 10px;
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; scroll-behavior: auto !important; }
    }
  `;
  document.head.appendChild(style);
}
