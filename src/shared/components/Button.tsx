import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

/**
 * Primary or secondary button component following Claude design system.
 *
 * @param title - Button label text.
 * @param variant - Button style variant: 'primary' (coral) or 'secondary' (cream with border).
 * @param touchableProps - Additional TouchableOpacity props.
 */
export const Button = forwardRef<View, ButtonProps>(
  ({ title, variant = 'primary', ...touchableProps }, ref) => {
    const baseStyle = variant === 'primary' ? styles.primary : styles.secondary;
    const textStyle = variant === 'primary' ? styles.primaryText : styles.secondaryText;

    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={`${baseStyle} ${touchableProps.className ?? ''}`}>
        <Text className={textStyle}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const styles = {
  primary: 'items-center bg-primary rounded-md px-5 py-3 min-h-[40px]',
  primaryText: 'text-on-primary font-button text-center',
  secondary: 'items-center bg-canvas border border-hairline rounded-md px-5 py-3 min-h-[40px]',
  secondaryText: 'text-ink font-button text-center',
};
