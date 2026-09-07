import { forwardRef } from 'react';
import { Text, type TextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const textVariants = cva('text-on-surface', {
  variants: {
    variant: {
      'headline-display': 'font-display text-headline-display',
      'headline-lg': 'font-display text-headline-lg',
      'headline-lg-mobile': 'font-display text-headline-lg-mobile',
      'headline-md': 'font-display text-headline-md',
      'body-lg': 'font-sans text-body-lg',
      'body-md': 'font-sans text-body-md',
      'label-md': 'font-sans text-label-md',
      'label-sm': 'font-sans text-label-sm',
      code: 'font-mono text-code',
    },
    color: {
      'on-surface': 'text-on-surface',
      'on-surface-variant': 'text-on-surface-variant',
      primary: 'text-primary',
      'primary-on': 'text-primary-on',
      'inverse-on-surface': 'text-inverse-on-surface',
      outline: 'text-outline',
      'outline-variant': 'text-outline-variant',
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
    color: 'on-surface',
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
