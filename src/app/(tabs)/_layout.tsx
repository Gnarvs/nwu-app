import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';

import { AppTabBar, TabButton } from '@/components/tab-bar';
import { useAppState } from '@/context/app-state';

export default function TabLayout() {
  const { unreadCount } = useAppState();

  return (
    <Tabs style={{ flex: 1 }}>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <AppTabBar>
          <TabTrigger name="index" href="/" asChild>
            <TabButton tabKey="index" label="Home" icon="home-outline" iconFocused="home" />
          </TabTrigger>
          <TabTrigger name="schedule" href="/schedule" asChild>
            <TabButton tabKey="schedule" label="Schedule" icon="calendar-outline" iconFocused="calendar" />
          </TabTrigger>
          <TabTrigger name="grades" href="/grades" asChild>
            <TabButton tabKey="grades" label="Grades" icon="school-outline" iconFocused="school" />
          </TabTrigger>
          <TabTrigger name="tuition" href="/tuition" asChild>
            <TabButton tabKey="tuition" label="Tuition" icon="wallet-outline" iconFocused="wallet" />
          </TabTrigger>
          <TabTrigger name="clearance" href="/clearance" asChild>
            <TabButton
              tabKey="clearance"
              label="Clearance"
              icon="shield-checkmark-outline"
              iconFocused="shield-checkmark"
            />
          </TabTrigger>
          <TabTrigger name="messages" href="/messages" asChild>
            <TabButton
              tabKey="messages"
              label="Messages"
              icon="chatbubbles-outline"
              iconFocused="chatbubbles"
              badge={unreadCount}
            />
          </TabTrigger>
        </AppTabBar>
      </TabList>
    </Tabs>
  );
}
