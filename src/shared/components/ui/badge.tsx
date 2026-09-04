import { forwardRef } from 'react';
import { Text, type TextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const badgeVariants = cva('rounded-pill px-3 py-1', {
  variants: {
    variant: {
      default: 'bg-surface-card',
      primary: 'bg-primary',
      success: 'bg-success/15',
      warning: 'bg-warning/15',
      error: 'bg-error/15',
      muted: 'bg-surface-soft',
    },
    size: {
      sm: 'px-2 py-0.5',
      md: 'px-3 py-1',
      lg: 'px-4 py-1.5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const badgeTextVariants = cva('font-caption', {
  variants: {
    variant: {
      default: 'text-ink',
      primary: 'text-on-primary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      muted: 'text-muted',
    },
    uppercase: {
      true: 'font-caption-upper',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface BadgeProps
  extends TextProps, VariantProps<typeof badgeVariants>, VariantProps<typeof badgeTextVariants> {}

/**
 * Badge/pill component following Claude design system.
 *
 * Used for category tags, status indicators, and inline labels.
 * Supports default, primary (coral), success, warning, error, and muted variants.
 *
 * @param variant - Badge color variant.
 * @param size - Badge size.
 * @param uppercase - Whether to use uppercase caption styling.
 */
export const Badge = forwardRef<Text, BadgeProps>(
  ({ variant, size, uppercase, className, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          badgeTextVariants({ variant, uppercase }),
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { badgeVariants, badgeTextVariants };
