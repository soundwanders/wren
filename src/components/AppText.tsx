import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { ColorKey, FontVariant, FontSizeKey } from '@/theme/tokens';

interface AppTextProps extends TextProps {
  variant?: FontVariant;
  size?: FontSizeKey;
  color?: ColorKey;
  style?: TextStyle | TextStyle[];
}

export function AppText({
  variant = 'body',
  size = 'md',
  color = 'ink',
  style,
  children,
  ...rest
}: AppTextProps) {
  const theme = useTheme();

  const textStyle: TextStyle = {
    ...theme.font[variant],
    fontSize: theme.fontSize[size],
    color: theme.colors[color],
  };

  return (
    <Text style={[textStyle, style]} allowFontScaling {...rest}>
      {children}
    </Text>
  );
}
