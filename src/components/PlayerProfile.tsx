import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

interface Props {
  avatar: any;
  name: string;
  rank: string;
  time: string;
  isActiveTurn: boolean;
}

export default function PlayerProfile({ avatar, name, rank, time, isActiveTurn }: Props) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActiveTurn) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [isActiveTurn]);

  const borderColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#00C851', '#009432'], // verde claro -> verde escuro
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.profileBox, isActiveTurn && { borderColor }]}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <View style={styles.divider} />
        <Text style={styles.rank}>{rank}</Text>
      </Animated.View>

      <Animated.View style={[styles.timerBox, isActiveTurn && { borderColor }]}>
        <Text style={styles.time}>{time}</Text>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 6,
    marginTop: 6,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9e2b6',
    borderWidth: 2,
    borderColor: '#5C4033',
    borderRadius: 12,
    padding: 4,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 20,
    marginRight: 6,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#3C2F2F',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#5C4033',
    marginHorizontal: 8,
  },
  rank: {
    fontSize: 11,
    color: '#3C2F2F',
  },
  timerBox: {
    backgroundColor: '#f9e2b6',
    borderWidth: 2,
    borderColor: '#5C4033',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 16,
  },
  time: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3C2F2F',
  },
});
