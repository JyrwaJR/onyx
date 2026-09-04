import { forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from './cn';

interface DividerProps extends ViewProps {
  /** Divider color variant. */
  variant?: 'default' | 'soft';
}

/**
 * Horizontal divider following Claude design system.
 *
 * Uses hairline color for subtle separation between elements.
 *
 * @param variant - Divider style: 'default' (hairline) or 'soft' (hairline-soft).
 */
export const Divider = forwardRef<View, DividerProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          'h-px',
          variant === 'default' ? 'bg-hairline' : 'bg-hairline-soft',
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
