import { Piece } from './types';

const images = {
  w_pawn: require('../assets/w_pawn.png'),
  w_rook: require('../assets/w_rook.png'),
  w_knight: require('../assets/w_knight.png'),
  w_bishop: require('../assets/w_bishop.png'),
  w_queen: require('../assets/w_queen.png'),
  w_king: require('../assets/w_king.png'),
  b_pawn: require('../assets/b_pawn.png'),
  b_rook: require('../assets/b_rook.png'),
  b_knight: require('../assets/b_knight.png'),
  b_bishop: require('../assets/b_bishop.png'),
  b_queen: require('../assets/b_queen.png'),
  b_king: require('../assets/b_king.png'),
};

export const getPieceImage = (piece: Piece) => {
  const key = `${piece.color[0]}_${piece.type}` as keyof typeof images;
  return images[key];
};
