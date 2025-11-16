import { BlurView } from "expo-blur";
import { GlassView } from "expo-glass-effect";
import { SFSymbol, SymbolView } from "expo-symbols";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedProps, useAnimatedStyle } from "react-native-reanimated";
import { Octicons } from '@expo/vector-icons';

const pencil = require('../assets/pencil.png');
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const ControlButton = ({
  progress,
  onEditPress,
  onSubmitPress
}: {
  progress: SharedValue<number>;
  onEditPress: () => void;
  onSubmitPress: () => void;
}) => {

  const blurAnimatedProps = useAnimatedProps(() => {
    const intensity = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, 10, 0],
      Extrapolation.CLAMP
    );

    return {
      intensity,
    };
  });
  const checkmarkIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        progress.value,
        [0, 1],
        [0, 1],
        Extrapolation.CLAMP
      ),
      pointerEvents: progress.value >= 0.5 ? 'auto' : 'none',
    }
  })
  const editIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        progress.value,
        [0, 1],
        [1, 0],
        Extrapolation.CLAMP
      ),
      pointerEvents: progress.value < 0.5 ? 'auto' : 'none',
    }
  })

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: interpolate(
        progress.value,
        [0, 1],
        [0, 12],
        Extrapolation.CLAMP
      ),
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      height: 54,
      width: 54,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }
  })


  return (
    <Animated.View style={buttonAnimatedStyle}>
      <AnimatedBlurView animatedProps={blurAnimatedProps} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 8, zIndex: 2, pointerEvents: 'none' }} tint='light' />
      <Animated.View style={[StyleSheet.absoluteFill, checkmarkIconAnimatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F4F8' }]}
          onPress={onSubmitPress}
        >
          <Octicons name='check' size={20} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, editIconAnimatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F4F8' }]}
          onPress={onEditPress}
        >
          <Image source={pencil} style={{ width: 16, height: 16 }} resizeMode='contain' />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
};

const styles = StyleSheet.create({
  controlButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});