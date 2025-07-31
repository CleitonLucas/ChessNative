import React from 'react';
import { View, StyleSheet, Image, Text, ImageBackground } from 'react-native';
import { Piece } from '../../utils/types';
import { getPieceImage } from '../../utils/getPieceImage';

interface Props {
  pieces: Piece[];
}

type Grouped = { [key: string]: { piece: Piece; count: number } };

export default function CapturedPieces({ pieces }: Props) {
  // Agrupa as peças por tipo + cor
  const grouped: Grouped = {};
  for (const piece of pieces) {
    const key = `${piece.color}_${piece.type}`;
    if (!grouped[key]) {
      grouped[key] = { piece, count: 1 };
    } else {
      grouped[key].count++;
    }
  }

  return (
    <ImageBackground
      source={require('../assets/textures/wood_texture.jpg')}
      resizeMode="cover"
      style={styles.container}
      imageStyle={styles.backgroundImage}>
      <View style={styles.borderLayer}>
        <View style={styles.innerContainer}>
          <View style={styles.piecesContainer}>
            {Object.values(grouped).map(({ piece, count }, index) => (
              <View key={index} style={styles.pieceGroup}>
                <Image
                  source={getPieceImage(piece)}
                  style={[
                    styles.image,
                    piece.type === 'king' && styles.kingHighlight
                  ]}
                  resizeMode="contain"
                />
                {count > 1 && <Text style={styles.countText}>×{count}</Text>}
              </View>
            ))}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#d9c3a0',
    padding: 8,
    borderRadius: 12,
    marginVertical: 8,
    minHeight: 48,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  pieceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  image: {
    width: 30,
    height: 30,
  },
  countText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  kingHighlight: {
    tintColor: 'red', // Destaque visual para o rei capturado
  },
  backgroundImage: {
    borderRadius: 14,
  },
  piecesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  borderLayer: {
    width: '95%',
    height: '100%',
    borderRadius: 12,
    padding: 2,
    backgroundColor: 'rgba(92, 49, 10, 0.3)', 
  },
  innerContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#B07A34',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
