//utils/types.ts
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: PieceColor;
  row: number;
  col: number;
  hasMoved: boolean;
}

export type GameHistory = {
  board: Piece[];
  turn: 'white' | 'black';
  halfmoveClock: number; // Para regra dos 50 lances
};

export type GameMode = 'classic' | 'rapid' | 'blitz';