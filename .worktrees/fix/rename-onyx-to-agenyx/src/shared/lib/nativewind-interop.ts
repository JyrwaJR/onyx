/**
 * @file NativeWind cssInterop registrations for third-party components.
 *
 * NativeWind's className prop only works on standard React Native components
 * out of the box. This file registers third-party components (e.g. from
 * react-native-reanimated) so their `className` prop is forwarded to `style`.
 *
 * Import this file early in the app (e.g. in _layout.tsx) so the registrations
 * are available before any component tree renders.
 */

import { Animated } from 'react-native';
import { cssInterop } from 'nativewind';

// Register Animated.View so NativeWind can process `className` → `style`
cssInterop(Animated.View, { className: 'style' });
