import { forwardRef } from 'react';
import { TouchableOpacity, Text, View, type TouchableOpacityProps } from 'react-native';
import { cn } from '@/shared/lib/cn';

interface FabProps extends TouchableOpacityProps {
  /** Icon content (emoji or text). */
  icon?: string;
}

/**
 * Floating Action Button following Claude design system.
 *
 * Circular coral button positioned at bottom-right.
 * Used for primary actions like creating new sessions.
 *
 * @param icon - Icon content (default: "+").
 * @param touchableProps - Additional TouchableOpacity props.
 */
export const Fab = forwardRef<View, FabProps>(({ icon = '+', className, ...props }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      className={cn(
        'absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg',
        className
      )}
      activeOpacity={0.8}
      {...props}>
      <Text className="text-2xl font-bold text-primary-on">{icon}</Text>
    </TouchableOpacity>
  );
});

Fab.displayName = 'Fab';
