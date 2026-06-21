import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { AppView } from '@/components/AppView';
import { useTheme } from '@/theme/useTheme';

export default function AlbumsScreen() {
  const theme = useTheme();

  return (
    <AppView style={styles.container}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <AppText variant="display" size="xxl">
          Albums
        </AppText>
      </View>
      <View style={styles.body}>
        <AppText variant="body" size="md" color="inkMuted">
          Albums coming in Milestone 6
        </AppText>
      </View>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
