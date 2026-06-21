import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/useTheme';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.paper,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.clay,
        tabBarInactiveTintColor: theme.colors.inkMuted,
        tabBarLabelStyle: {
          fontFamily: 'Fredoka_500Medium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Gallery',
          tabBarAccessibilityLabel: 'Gallery tab',
        }}
      />
      <Tabs.Screen
        name="albums"
        options={{
          title: 'Albums',
          tabBarAccessibilityLabel: 'Albums tab',
        }}
      />
    </Tabs>
  );
}
