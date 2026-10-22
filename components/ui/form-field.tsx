import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = TextInputProps & {
  label: string;
  optional?: boolean;
};

export function FormField({ label, optional, style, ...rest }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];
  const borderColor = scheme === 'dark' ? '#3A3F42' : '#D7DBDE';

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>
        {label}
        {optional ? <ThemedText style={styles.optional}> (optional)</ThemedText> : null}
      </ThemedText>
      <TextInput
        placeholderTextColor={palette.icon}
        style={[
          styles.input,
          { color: palette.text, borderColor, backgroundColor: scheme === 'dark' ? '#1E2123' : '#FBFCFD' },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  optional: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.6,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: 14,
    fontSize: 16,
  },
});
