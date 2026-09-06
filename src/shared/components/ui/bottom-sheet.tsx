import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { cn } from '@/shared/lib/cn';

export interface CustomBottomSheetProps {
  children: React.ReactNode;
  /** Array of snap points, e.g. ['25%', '50%', '90%']. Default is ['50%'] */
  snapPoints?: string[];
  /** When true, sheet auto-sizes to content instead of fixed snapPoints */
  enableDynamicSizing?: boolean;
  onClose?: () => void;
  containerClassName?: string;
  bodyClassName?: string;
}

export const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(
  (
    {
      children,
      snapPoints = ['25', '50%', '90%'],
      enableDynamicSizing = false,
      onClose,
      containerClassName = 'bg-surface',
      bodyClassName = 'px-5 pb-8',
    },
    ref
  ) => {
    // Memoize snap points
    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    // Backdrop rendering (dims background on open, closes on tap)
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
          opacity={0.6}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={enableDynamicSizing ? undefined : memoizedSnapPoints}
        enableDynamicSizing={enableDynamicSizing}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
        handleIndicatorStyle={{ backgroundColor: '#cc785c', width: 36 }}
        backgroundStyle={{ backgroundColor: '#fcf9f6' }}>
        <BottomSheetView className={cn(containerClassName, bodyClassName)}>
          <BottomSheetView>{children}</BottomSheetView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

CustomBottomSheet.displayName = 'CustomBottomSheet';
