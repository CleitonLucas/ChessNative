import { Piece, GameHistory } from './types';
import { isInCheck } from './checkLogic';
import { getValidMoves } from './chessLogic';


// ✅ 1. Stalemate (impasse)
export function isStalemate(color: 'white' | 'black', board: Piece[]): boolean {
  if (isInCheck(color, board)) return false;

  return board
    .filter(p => p.color === color)
    .every(p => getValidMoves(p, board, null).length === 0);
}


// ✅ 2. Empate por material insuficiente
export function isInsufficientMaterial(board: Piece[]): boolean {
  const pieces = board.filter(p => p.type !== 'king');

  if (pieces.length === 0) {
    return true; // Rei vs Rei
  }

  if (pieces.length === 1) {
    const p = pieces[0];
    if (p.type === 'bishop' || p.type === 'knight') {
      return true; // Rei + Bispo ou Rei + Cavalo vs Rei
    }
  }

  if (pieces.length === 2) {
    const bishops = pieces.filter(p => p.type === 'bishop');
    if (
      bishops.length === 2 &&
      bishops[0].color !== bishops[1].color
    ) {
      return true; // Rei + Bispo (casa clara) vs Rei + Bispo (casa escura)
    }
  }

  return false;
}


// ✅ 3. Regra dos 50 lances (sem captura ou movimento de peão)
export function isFiftyMoveRule(halfmoveClock: number): boolean {
  return halfmoveClock >= 100; // 100 half-moves = 50 lances completos
}


// ✅ 4. Três repetições da mesma posição
export function isThreefoldRepetition(history: GameHistory[]): boolean {
  const positions: Record<string, number> = {};

  for (const entry of history) {
    const key = serializeBoard(entry.board);
    positions[key] = (positions[key] || 0) + 1;
    if (positions[key] >= 3) {
      return true;
    }
  }

  return false;
}


// ✅ 5. Xeque perpétuo (não é uma regra formal, mas é considerado empate na prática)
export function isPerpetualCheck(
  color: 'white' | 'black',
  history: GameHistory[]
): boolean {
  // Verifica se nos últimos N movimentos o adversário ficou em cheque consecutivamente
  const lastChecks = history.slice(-6); // Cheque contínuo por 3 lances de cada lado

  if (lastChecks.length < 6) return false;

  return lastChecks.every(entry => isInCheck(entry.turn === 'white' ? 'black' : 'white', entry.board));
}


// ✅ 6. Empate acordado
export function isAgreedDraw(): boolean {
  // Lógica depende do frontend. Geralmente é feito via botão "Oferecer empate".
  return false; // Simples placeholder.
}


// 🔧 Utilitário para serializar o tabuleiro
function serializeBoard(board: Piece[]): string {
  const sorted = board
    .map(p => `${p.type[0]}${p.color[0]}${p.row}${p.col}`)
    .sort()
    .join('');
  return sorted;
}
