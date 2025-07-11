// components/Piece.tsx
import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Piece } from '../utils/types';

interface Props {
  piece: Piece;
  onSelect: () => void;
  isSelected: boolean;
}

const pieceImages = {
  white: {
    king: require('../assets/w_king.png'),
    queen: require('../assets/w_queen.png'),
    bishop: require('../assets/w_bishop.png'),
    knight: require('../assets/w_knight.png'),
    rook: require('../assets/w_rook.png'),
    pawn: require('../assets/w_pawn.png'),
  },
  black: {
    king: require('../assets/b_king.png'),
    queen: require('../assets/b_queen.png'),
    bishop: require('../assets/b_bishop.png'),
    knight: require('../assets/b_knight.png'),
    rook: require('../assets/b_rook.png'),
    pawn: require('../assets/b_pawn.png'),
  },
};

export default function PieceComponent({ piece, onSelect, isSelected }: Props) {
  const image = pieceImages[piece.color][piece.type];

  return (
    <TouchableOpacity
    onPress={onSelect}
      style={[
        styles.container,
        {
          top: piece.row * 40,
          left: piece.col * 40,
          borderWidth: isSelected ? 2 : 0,
          borderColor: isSelected ? 'yellow' : 'transparent',
          borderRadius: isSelected ? 6 : 0,
        },
      ]}
    >
      <Image source={image} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
});
