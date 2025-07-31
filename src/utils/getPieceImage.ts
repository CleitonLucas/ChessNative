import { Piece } from './types';

const images = {
  w_pawn: require('../assets/whitePieces/w_pawn.png'),
  w_rook: require('../assets/whitePieces/w_rook.png'),
  w_knight: require('../assets/whitePieces/w_knight.png'),
  w_bishop: require('../assets/whitePieces/w_bishop.png'),
  w_queen: require('../assets/whitePieces/w_queen.png'),
  w_king: require('../assets/whitePieces/w_king.png'),
  b_pawn: require('../assets/blackPieces/b_pawn.png'),
  b_rook: require('../assets/blackPieces/b_rook.png'),
  b_knight: require('../assets/blackPieces/b_knight.png'),
  b_bishop: require('../assets/blackPieces/b_bishop.png'),
  b_queen: require('../assets/blackPieces/b_queen.png'),
  b_king: require('../assets/blackPieces/b_king.png'),
};

export const getPieceImage = (piece: Piece) => {
  const key = `${piece.color[0]}_${piece.type}` as keyof typeof images;
  return images[key];
};
