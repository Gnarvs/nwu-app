# NWU Student

A student app for Northwestern University (Laoag City, Philippines), built with Expo and TypeScript. It runs on iOS, Android and the web, and the web build deploys to Vercel.

Everything in the app is **sample data**. No real student records are used.

## Screens

| Screen | What it shows |
| --- | --- |
| Home | Greeting, student info, quick stats, today's classes, announcements |
| Schedule | Classes by day (Mon to Sat) plus the full subject list |
| Grades | Semester dropdown and a table with PG, MG and FG (Prelim, Midterm, Final) |
| Tuition | Remaining balance, payment schedule, fee breakdown, payment history |
| Clearance | 15 offices, each Cleared or With Obligation, with a filter |
| Messages | Inbox with unread state; tap a message to read it |
| Menu (pinned tab) | Bottom sheet with Faculty evaluation, Settings and Sign out |

The bottom tab bar scrolls sideways when the tabs don't fit, and the Menu button stays pinned on the right. On narrow phones the tabs are sized so the last visible one is cut in half, and a fade on the edge shows there is more to scroll. On wider screens all six tabs fit in one row.

## UI notes

- Home shows an "Up next" or "In class now" card for today's classes, and each class gets a Now / Up next / Done label based on the device clock.
- Schedule has a Mon to Sat picker that always fits the screen width. Dots under each day show how many classes it has.
- Tuition has a segmented progress bar (one segment per installment), a payment timeline, and a fee breakdown you can expand or collapse.
- Clearance and Messages have filter chips with counts. Offices with obligations are listed first.
- Animations respect the system "reduce motion" setting (`src/hooks/use-reduced-motion.ts`).
- On the web, keyboard users get a gold focus ring (`src/web-styles.ts`).
- Shared building blocks (cards, pills, chips, progress bar, avatar, collapsible, empty state) are in `src/components/ui.tsx`.

## Brand colors

- Maroon `#7A0E0E`
- Gold `#F2B705`

All colors live in `src/theme.ts`, along with spacing, radius, icon sizes and animation timings.

## Running it

```bash
npm install
```

```bash
npm run web       # browser
```

```bash
npm start         # then scan the QR code with Expo Go, or press i / a
```

Other scripts:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run build:web   # static web build in ./dist
```

## Where the data lives

All data is in one file: **`src/data/sampleData.ts`**. The shapes it must follow are in `src/data/types.ts`.

To connect the app to the school's real system later:

1. Keep the types in `src/data/types.ts` (adjust them if the real system has more fields).
2. Replace the exports in `src/data/sampleData.ts` with data from the real API, mapped to those types.
3. Replace the demo sign-in in `src/app/sign-in.tsx` and `src/context/app-state.tsx` with the school's real login.

The screens only read from `@/data/sampleData`, so nothing else needs to change. Totals such as the tuition balance and GWA are calculated from the raw data (`src/selectors.ts`, `src/format.ts`), so the data file only needs to hold the raw records.

## Deploying to Vercel

The repo already has a `vercel.json`:

- Build command: `npx expo export --platform web`
- Output directory: `dist`
- All paths rewrite to `index.html`, so deep links like `/grades` work on refresh

Steps:

1. Push the repo to GitHub.
2. In Vercel, click **Add New > Project** and import the repo.
3. Leave the framework preset as **Other**. Vercel picks up the settings from `vercel.json`.
4. Deploy.

Or from the command line:

```bash
npx vercel
```

## Project layout

```
src/
  app/                  routes (Expo Router)
    (tabs)/             Home, Schedule, Grades, Tuition, Clearance, Messages
    message/[id].tsx    message detail
    faculty-evaluation.tsx
    settings.tsx
    sign-in.tsx
  components/           tab bar, menu sheet, dropdown, shared UI
  context/app-state.tsx in-memory sign-in, read messages, evaluations, settings
  hooks/                use-reduced-motion
  data/
    sampleData.ts       ALL app data (replace this file later)
    types.ts            data shapes
  format.ts             peso, date, time and grade formatting
  selectors.ts          derived values (tuition totals, today's weekday, class status)
  theme.ts              colors, spacing, radius, motion timings
  web-styles.ts         web-only CSS (focus ring, reduced motion)
```

## Notes

- The "NWU" gold seal is a placeholder. Swap in the official logo (and update `assets/icon.png`, `assets/favicon.png`) once the school provides it.
- App state (signed in, read messages, submitted evaluations, settings) is kept in memory and resets on reload.
