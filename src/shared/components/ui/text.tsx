import { forwardRef } from 'react';
import { Text, type TextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';

const textVariants = cva('text-ink', {
  variants: {
    variant: {
      'display-lg': 'font-display text-display-lg',
      'display-md': 'font-display text-display-md',
      'display-sm': 'font-display text-display-sm',
      'title-lg': 'font-sans text-title-lg font-medium',
      'title-md': 'font-sans text-title-md font-medium',
      'title-sm': 'font-sans text-title-sm font-medium',
      'body-md': 'font-sans text-body-md',
      'body-sm': 'font-sans text-body-sm',
      caption: 'font-sans text-caption',
      'caption-upper': 'font-sans text-caption-upper',
      code: 'font-mono text-code',
    },
    color: {
      ink: 'text-ink',
      body: 'text-body',
      'body-strong': 'text-body-strong',
      muted: 'text-muted',
      'muted-soft': 'text-muted-soft',
      primary: 'text-primary',
      'on-primary': 'text-on-primary',
      'on-dark': 'text-on-dark',
      'on-dark-soft': 'text-on-dark-soft',
      error: 'text-error',
      success: 'text-success',
      warning: 'text-warning',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'body-md',
    color: 'ink',
  },
});

interface TextComponentProps extends TextProps, VariantProps<typeof textVariants> {}

/**
 * Typography component following Claude design system.
 *
 * Supports display (serif), title, body, caption, and code variants.
 * Each variant maps to the correct font family, size, weight, and line height.
 *
 * @param variant - Typography scale variant.
 * @param color - Text color token.
 * @param align - Text alignment.
 */
export const TextComponent = forwardRef<Text, TextComponentProps>(
  ({ variant, color, align, className, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(textVariants({ variant, color, align }), className)}
        {...props}
      />
    );
  }
);

TextComponent.displayName = 'TextComponent';

export { textVariants };
