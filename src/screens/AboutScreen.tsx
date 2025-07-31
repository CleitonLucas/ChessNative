import React from 'react';
import { View, Text, Linking, Pressable, StyleSheet, Image } from 'react-native';

export default function AboutScreen() {
  const developers = [
    {
      name: 'Gean Lima',
      handle: '@Foccuns169',
      url: 'https://github.com/Foccuns169',
      image: require('../assets/users/devs/Gean.png'),
    },
    {
      name: 'Cleiton Lucas',
      handle: '@CleitonLucas',
      url: 'https://github.com/CleitonLucas',
      image: require('../assets/users/devs/cleiton.jpg'),
    },
    {
      name: 'Emanoel Carvalho',
      handle: '@emanoelCarvalho',
      url: 'https://github.com/emanoelCarvalho',
      image: require('../assets/users/devs/emanoel.jpg'),
    },
    {
      name: 'Gabriel Vinicius',
      handle: '@Gabxxxx',
      url: 'https://github.com/Gabxxxx',
      image: require('../assets/users/devs/Gabriel.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Este aplicativo foi desenvolvido com o objetivo de proporcionar uma experiência divertida e intuitiva de partidas de xadrez, com estilo visual personalizado e navegação simples.
      </Text>

      {developers.map((dev, index) => (
        <View key={index} style={styles.devContainer}>
          <Image source={dev.image} style={styles.avatar} />
          <Text style={styles.name}>{dev.name}</Text>
          <Pressable onPress={() => Linking.openURL(dev.url)}>
            <Text style={styles.link}>{dev.handle}</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#deb887',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#4b2e1f',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
  devContainer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b2e1f',
  },
  link: {
    fontSize: 14,
    color: '#0000EE',
    textDecorationLine: 'underline',
  },
});
