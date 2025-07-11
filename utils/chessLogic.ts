//chessLogic.ts
import { Piece } from "./types";
import { isInCheckAfterMove } from "./checkLogic";

export function getValidMoves(
  piece: Piece,
  board: Piece[],
  enPassantTarget: { row: number; col: number } | null,
  ignoreCheckValidation = false
): { row: number; col: number }[] {
  const moves: { row: number; col: number }[] = [];

  const isOccupied = (row: number, col: number) =>
    board.find((p) => p.row === row && p.col === col);

  const isEnemy = (row: number, col: number) => {
    const target = isOccupied(row, col);
    return target && target.color !== piece.color;
  };

  const addMove = (row: number, col: number) => {
    if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
      const target = isOccupied(row, col);
      if (!target || target.color !== piece.color) {
        moves.push({ row, col });
      }
    }
  };

  switch (piece.type) {
    case "pawn": {
      const dir = piece.color === "white" ? -1 : 1;
      const startRow = piece.color === "white" ? 6 : 1;

      const forward1 = piece.row + dir;
      const forward2 = piece.row + 2 * dir;

      if (!isOccupied(forward1, piece.col)) {
        moves.push({ row: forward1, col: piece.col });

        if (piece.row === startRow && !isOccupied(forward2, piece.col)) {
          moves.push({ row: forward2, col: piece.col });
        }
      }

      // Capturas
      for (const dc of [-1, 1]) {
        const r = forward1;
        const c = piece.col + dc;
        if (isEnemy(r, c)) {
          moves.push({ row: r, col: c });
        }
        // En passant
        if (
          enPassantTarget &&
          enPassantTarget.row === r &&
          enPassantTarget.col === c
        ) {
          moves.push({ row: r, col: c });
        }
      }
      break;
    }

    case "rook": {
      const directions = [
        { r: -1, c: 0 },
        { r: 1, c: 0 },
        { r: 0, c: -1 },
        { r: 0, c: 1 },
      ];
      for (const d of directions) {
        let r = piece.row + d.r;
        let c = piece.col + d.c;
        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
          if (!isOccupied(r, c)) {
            moves.push({ row: r, col: c });
          } else {
            if (isEnemy(r, c)) moves.push({ row: r, col: c });
            break;
          }
          r += d.r;
          c += d.c;
        }
      }
      break;
    }

    case "bishop": {
      const directions = [
        { r: -1, c: -1 },
        { r: -1, c: 1 },
        { r: 1, c: -1 },
        { r: 1, c: 1 },
      ];
      for (const d of directions) {
        let r = piece.row + d.r;
        let c = piece.col + d.c;
        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
          if (!isOccupied(r, c)) {
            moves.push({ row: r, col: c });
          } else {
            if (isEnemy(r, c)) moves.push({ row: r, col: c });
            break;
          }
          r += d.r;
          c += d.c;
        }
      }
      break;
    }

    case "queen": {
      const directions = [
        { r: -1, c: 0 },
        { r: 1, c: 0 },
        { r: 0, c: -1 },
        { r: 0, c: 1 },
        { r: -1, c: -1 },
        { r: -1, c: 1 },
        { r: 1, c: -1 },
        { r: 1, c: 1 },
      ];
      for (const d of directions) {
        let r = piece.row + d.r;
        let c = piece.col + d.c;
        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
          if (!isOccupied(r, c)) {
            moves.push({ row: r, col: c });
          } else {
            if (isEnemy(r, c)) moves.push({ row: r, col: c });
            break;
          }
          r += d.r;
          c += d.c;
        }
      }
      break;
    }

    case "knight": {
      const jumps = [
        { r: -2, c: -1 },
        { r: -2, c: 1 },
        { r: -1, c: -2 },
        { r: -1, c: 2 },
        { r: 1, c: -2 },
        { r: 1, c: 2 },
        { r: 2, c: -1 },
        { r: 2, c: 1 },
      ];
      for (const j of jumps) {
        addMove(piece.row + j.r, piece.col + j.c);
      }
      break;
    }

    case "king": {
      const directions = [
        { r: -1, c: 0 },
        { r: 1, c: 0 },
        { r: 0, c: -1 },
        { r: 0, c: 1 },
        { r: -1, c: -1 },
        { r: -1, c: 1 },
        { r: 1, c: -1 },
        { r: 1, c: 1 },
      ];
      for (const d of directions) {
        addMove(piece.row + d.r, piece.col + d.c);
      }

      // Roque
      if (!piece.hasMoved) {
        const row = piece.row;

        // Roque pequeno
        const rookKingside = isOccupied(row, 7);
        if (
          rookKingside &&
          rookKingside.type === "rook" &&
          !rookKingside.hasMoved &&
          !isOccupied(row, 5) &&
          !isOccupied(row, 6)
        ) {
          moves.push({ row, col: 6 });
        }

        // Roque grande
        const rookQueenside = isOccupied(row, 0);
        if (
          rookQueenside &&
          rookQueenside.type === "rook" &&
          !rookQueenside.hasMoved &&
          !isOccupied(row, 1) &&
          !isOccupied(row, 2) &&
          !isOccupied(row, 3)
        ) {
          moves.push({ row, col: 2 });
        }
      }
      break;
    }
  }

  // Validação de cheque
  if (ignoreCheckValidation) {
    return moves;
  }

  return moves.filter((move) =>
    !isInCheckAfterMove(piece, move, board)
  );
}
