import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ControlButton } from './EditButton';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const SPRING_CONFIG = {
  damping: 10,
  stiffness: 140,
  mass: 1
};

export const SplitToEditContainer = () => {
  const hoursRef = React.useRef<TextInput>(null);
  const minutesRef = React.useRef<TextInput>(null);

  const progress = useSharedValue(0);
  const minWidth = useSharedValue(60);
  const hourWidth = useSharedValue(54);

  const [hours, setHours] = React.useState('02');
  const [minutes, setMinutes] = React.useState('30');

  const inputAnimatedProps = useAnimatedProps(() => {
    const enabled = progress.value >= 0.5;

    return {
      editable: enabled,
      pointerEvents: enabled ? 'auto' : 'none' as 'auto' | 'none',
    };
  });

  const hoursAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,

      width: hourWidth.value,
      borderRadius: interpolate(progress.value, [0, 1], [0, 12], Extrapolation.CLAMP),
      paddingRight: interpolate(progress.value, [0, 1], [6, 16], Extrapolation.CLAMP),
      paddingLeft: interpolate(progress.value, [0, 1], [16, 16], Extrapolation.CLAMP),
    }
  })

  const minAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: interpolate(progress.value, [0, 1], [0, 12], Extrapolation.CLAMP),
      height: 54,
      width: minWidth.value,
      marginHorizontal: interpolate(progress.value, [0, 1], [0, 8], Extrapolation.CLAMP),
      paddingRight: interpolate(progress.value, [0, 1], [8, 14], Extrapolation.CLAMP),
      paddingLeft: interpolate(progress.value, [0, 1], [4, 14], Extrapolation.CLAMP),
    }
  })

  const switchToEdit = () => {
    progress.value = withSpring(1, SPRING_CONFIG);
    hourWidth.value = withSpring(94, SPRING_CONFIG);
    minWidth.value = withSpring(94, SPRING_CONFIG);
  };

  const reset = () => {
    progress.value = withSpring(0, SPRING_CONFIG);
    hourWidth.value = withSpring(54, SPRING_CONFIG);
    minWidth.value = withSpring(60, SPRING_CONFIG);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, hoursAnimatedStyle]}>
        <AnimatedTextInput
          ref={hoursRef}
          animatedProps={inputAnimatedProps}
          style={styles.textInput}
          value={hours}
          onChangeText={setHours}
          maxLength={2}
          keyboardType="number-pad"
          returnKeyType={'next'}
          onEndEditing={() => {
            setHours(prev => prev.padStart(2, '0'));
          }}
          onSubmitEditing={() => {
            minutesRef.current?.focus();
          }}
        />
        <Text style={styles.placeholder}>Hr.</Text>
      </Animated.View>
      <Animated.View style={[styles.box, minAnimatedStyle]}>
        <AnimatedTextInput
          ref={minutesRef}
          animatedProps={inputAnimatedProps}
          style={styles.textInput}
          value={minutes}
          onChangeText={setMinutes}
          maxLength={2}
          keyboardType="number-pad"
          returnKeyType={'done'}
          onEndEditing={() => {
            setHours(prev => prev.padStart(2, '0'));
          }}
          onSubmitEditing={() => {
            reset()
          }}
        />
        <Text style={styles.placeholder}>Min.</Text>
      </Animated.View>
      <ControlButton
        progress={progress}
        onSubmitPress={reset}
        onEditPress={switchToEdit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  box: {
    height: 54,
    backgroundColor: '#F4F4F8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontWeight: '700',
    color: '#000000',
    minWidth: 20
  },
  placeholder: {
    fontWeight: '700',
    color: '#A8A8B2'
  }
});
