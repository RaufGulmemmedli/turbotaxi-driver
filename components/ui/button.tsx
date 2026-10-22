import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const DANGER_COLOR = '#D7263D';

type Props = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: Variant;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({ title, variant = 'primary', loading, disabled, style, ...rest }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const tint = Colors[scheme].tint;
  const isDisabled = disabled || loading;

  const accent = variant === 'danger' ? DANGER_COLOR : tint;

  const containerStyle: ViewStyle = {
    backgroundColor: variant === 'primary' || variant === 'danger' ? accent : 'transparent',
    borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth * 2 : 0,
    borderColor: accent,
    opacity: isDisabled ? 0.5 : 1,
  };

  const labelColor =
    variant === 'primary'
      ? scheme === 'dark'
        ? '#11181C'
        : '#fff'
      : variant === 'danger'
        ? '#fff'
        : accent;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [styles.base, containerStyle, pressed && !isDisabled && styles.pressed, style]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <Text style={[styles.label, { color: labelColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
