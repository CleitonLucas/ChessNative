import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Props {
  avatar: any;
  name: string;
  rank: string;
  time: string;
}

export default function PlayerProfile({ avatar, name, rank, time }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <View style={styles.divider} />
        <Text style={styles.rank}>{rank}</Text>
      </View>
      <View style={styles.timerBox}>
        <Text style={styles.time}>{time}</Text>
      </View>
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

