import { Text, type ColorValue } from 'react-native';

interface TabBarIconProps {
  color: ColorValue;
  size: number;
  label: string;
}

export function TabBarIcon({ color, size, label }: TabBarIconProps) {
  return <Text style={{ color, fontSize: size, fontWeight: '600' }}>{label}</Text>;
}
