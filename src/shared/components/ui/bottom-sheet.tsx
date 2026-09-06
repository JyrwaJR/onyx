import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

export interface CustomBottomSheetProps {
  title?: string;
  children: React.ReactNode;
  /** Array of snap points, e.g. ['25%', '50%', '90%']. Default is ['50%'] */
  snapPoints?: string[];
  /** When true, sheet auto-sizes to content instead of fixed snapPoints */
  enableDynamicSizing?: boolean;
  onClose?: () => void;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(
  (
    {
      title,
      children,
      snapPoints = ['50%'],
      enableDynamicSizing = false,
      onClose,
      containerClassName = 'bg-slate-900 rounded-t-3xl',
      headerClassName = 'flex-row items-center justify-between border-b border-slate-800 pb-3 mb-4',
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
        handleIndicatorStyle={{ backgroundColor: '#94a3b8', width: 36 }}
        backgroundStyle={{ backgroundColor: 'transparent' }}>
        <BottomSheetView className={`${containerClassName} ${bodyClassName}`}>
          {/* Header */}
          {(title || onClose) && (
            <View className={headerClassName}>
              {title ? <Text className="text-lg font-semibold text-white">{title}</Text> : <View />}
            </View>
          )}

          {/* Body Content */}
          <View>{children}</View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

CustomBottomSheet.displayName = 'CustomBottomSheet';
