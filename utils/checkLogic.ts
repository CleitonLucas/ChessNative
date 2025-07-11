import { Piece } from './types';
import { getValidMoves } from './chessLogic';

export function isInCheck(color: 'white' | 'black', board: Piece[]): boolean {
  const king = board.find(p => p.type === 'king' && p.color === color);
  if (!king) return false;

  return board.some(p =>
    p.color !== color &&
    getValidMoves(p, board, null, true).some(
      m => m.row === king.row && m.col === king.col
    )
  );
}

export function isInCheckAfterMove(
  piece: Piece,
  move: { row: number; col: number },
  board: Piece[]
): boolean {
  const simulatedBoard = board
    .filter(p => !(p.row === move.row && p.col === move.col)) // remove peça capturada
    .map(p =>
      p.row === piece.row && p.col === piece.col
        ? { ...p, row: move.row, col: move.col }
        : p
    );

  return isInCheck(piece.color, simulatedBoard);
}

export function isCheckmate(color: 'white' | 'black', board: Piece[]): boolean {
  if (!isInCheck(color, board)) return false;

  return board
    .filter(p => p.color === color)
    .every(piece =>
      getValidMoves(piece, board, null).every(move => {
        const simulatedBoard = board
          .filter(p => !(p.row === move.row && p.col === move.col))
          .map(p =>
            p.row === piece.row && p.col === piece.col
              ? { ...p, row: move.row, col: move.col }
              : p
          );
        return isInCheck(color, simulatedBoard);
      })
    );
}
