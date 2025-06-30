import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ProgressBarProps {
  progress: Animated.Value;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const [progressText, setProgressText] = useState(0);

  useEffect(() => {
    const listenerId = progress.addListener(({ value }) => {
      setProgressText(Math.round(value));
    });
    return () => {
      progress.removeListener(listenerId);
    };
  }, [progress]);

  // Interpolate width for the progress bar fill
  const widthInterpolation = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  // Interpolate opacity to fade in the component as soon as dragging starts
  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.progressText}>{progressText}%</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, { width: widthInterpolation }]} />
      </View>
      <Text style={styles.hintText}>Pull up to start a call</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // Positioned above the input area
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 10,
  },
  track: {
    height: 8,
    width: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginTop: 10,
  },
  bar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 8,
  },
}); 