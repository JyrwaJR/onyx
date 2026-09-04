import { forwardRef } from 'react';
import { Text, TouchableOpacity, View, type TouchableOpacityProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-xl px-5 py-3 min-h-[40px]',
  {
    variants: {
      variant: {
        primary: 'bg-primary shadow-md',
        secondary: 'bg-surface border shadow-xs border-outline-variant',
        destructive: 'bg-error/10 border border-error/20',
        ghost: 'bg-transparent',
        'primary-on-dark': 'bg-inverse-surface',
      },
      size: {
        sm: 'min-h-[32px] px-3 py-2',
        md: 'min-h-[40px] px-5 py-3',
        lg: 'min-h-[48px] px-6 py-4',
        icon: 'h-11 w-11 rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const buttonTextVariants = cva('font-sans text-center', {
  variants: {
    variant: {
      primary: 'text-primary-on',
      secondary: 'text-on-surface',
      destructive: 'text-error',
      ghost: 'text-primary',
      'primary-on-dark': 'text-inverse-on-surface',
    },
    size: {
      sm: 'text-label-sm',
      md: 'text-label-md',
      lg: 'text-body-md',
      icon: 'text-label-md',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

interface ButtonProps
  extends TouchableOpacityProps, Omit<VariantProps<typeof buttonVariants>, 'disabled'> {
  /** Button label text. */
  title?: string;
}

/**
 * Primary button component following Claude design system.
 *
 * Supports multiple variants: primary (coral), secondary (cream with border),
 * destructive (red tint), ghost (no background), and primary-on-dark.
 *
 * @param title - Button label text.
 * @param variant - Button style variant.
 * @param size - Button size variant.
 * @param disabled - Whether the button is disabled.
 * @param touchableProps - Additional TouchableOpacity props.
 */
export const Button = forwardRef<View, ButtonProps>(
  ({ title, variant, size, disabled, className, children, ...props }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        disabled={disabled}
        className={cn(buttonVariants({ variant, size }), disabled && 'opacity-50', className)}
        activeOpacity={0.7}
        {...props}>
        {title ? <Text className={buttonTextVariants({ variant, size })}>{title}</Text> : children}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants, buttonTextVariants };
