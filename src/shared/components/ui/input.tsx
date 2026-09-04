import { forwardRef } from 'react';
import { TextInput, type TextInputProps, View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';

const inputVariants = cva('rounded-lg border bg-canvas px-4 py-3 text-base text-ink min-h-[48px]', {
  variants: {
    variant: {
      default: 'border-hairline',
      error: 'border-error',
      success: 'border-success',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface InputProps extends TextInputProps, VariantProps<typeof inputVariants> {
  /** Label text displayed above the input. */
  label?: string;
  /** Error message displayed below the input. */
  error?: string;
}

/**
 * Text input following Claude design system.
 *
 * Supports default, error, and success border states.
 * Includes optional label and error message display.
 *
 * @param label - Optional label text.
 * @param error - Optional error message.
 * @param variant - Input style variant.
 */
export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, variant, className, ...props }, ref) => {
    const resolvedVariant = error ? 'error' : variant;

    return (
      <View className="w-full">
        {label && <Text className="mb-2 text-body-sm font-medium text-muted">{label}</Text>}
        <TextInput
          ref={ref}
          placeholderTextColor="#8e8b82"
          className={cn(inputVariants({ variant: resolvedVariant }), className)}
          {...props}
        />
        {error && <Text className="mt-1 text-body-sm text-error">{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

export { inputVariants };
