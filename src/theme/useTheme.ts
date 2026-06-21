import { useColorScheme } from 'react-native';
import { colors, colorsDark, font, fontSize, radius, space, shadow, animation } from './tokens';

export type Colors = { readonly [K in keyof typeof colors]: string };

export type Theme = {
  readonly colors: Colors;
  readonly font: typeof font;
  readonly fontSize: typeof fontSize;
  readonly radius: typeof radius;
  readonly space: typeof space;
  readonly shadow: typeof shadow;
  readonly animation: typeof animation;
};

const lightTheme: Theme = { colors, font, fontSize, radius, space, shadow, animation };
const darkTheme: Theme = { colors: colorsDark, font, fontSize, radius, space, shadow, animation };

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
