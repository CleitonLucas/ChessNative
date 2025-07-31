import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Queue'>;

export default function QueueScreen({ route, navigation }: Props) {
  const { mode } = route.params;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Game', { mode });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [mode]);

  useEffect(() => {
    const animate = () => {
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => animate());
    };

    animate();
  }, [progressAnim]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/interface-elements/loadingIcon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Procurando partida</Text>

      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBarFill, { width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#deb887',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    color: '#4b2e1f',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  progressBarContainer: {
    width: 140,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff33',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
});
