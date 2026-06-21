import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { ColorKey } from '@/theme/tokens';

interface AppViewProps extends ViewProps {
  background?: ColorKey;
  style?: ViewStyle | ViewStyle[];
}

export function AppView({ background = 'paper', style, children, ...rest }: AppViewProps) {
  const theme = useTheme();

  return (
    <View style={[{ backgroundColor: theme.colors[background] }, style]} {...rest}>
      {children}
    </View>
  );
}
