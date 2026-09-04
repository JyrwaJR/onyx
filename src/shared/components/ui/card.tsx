import { forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';

const cardVariants = cva('rounded-lg p-4', {
  variants: {
    variant: {
      default: 'bg-surface-card border border-hairline',
      elevated: 'bg-surface-card border border-hairline shadow-subtle',
      dark: 'bg-surface-dark',
      'dark-elevated': 'bg-surface-dark-elevated',
      ghost: 'bg-transparent',
      coral: 'bg-primary',
    },
    size: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

interface CardProps extends ViewProps, VariantProps<typeof cardVariants> {}

/**
 * Card container following Claude design system.
 *
 * Supports multiple surface variants: default (cream card), dark, coral, etc.
 * Color-block first approach — depth comes from surface contrast, not shadows.
 *
 * @param variant - Card surface variant.
 * @param size - Card padding size.
 */
export const Card = forwardRef<View, CardProps>(({ variant, size, className, ...props }, ref) => {
  return <View ref={ref} className={cn(cardVariants({ variant, size }), className)} {...props} />;
});

Card.displayName = 'Card';

export { cardVariants };
