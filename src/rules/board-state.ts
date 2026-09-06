import type { Position } from 'chessops/chess';
import { chessgroundDests } from 'chessops/compat';
import type { BoardState, Dests, PlayerColor, Variant } from '../board/types';
import { readPosition, turnColorOf } from './position';

export interface BoardStateInput {
  fen: string;
  variant?: Variant;
  playerColor?: PlayerColor;
  locked?: boolean;
  premove?: boolean;
}

const destsOf = (pos: Position, variant: Variant): Dests =>
  chessgroundDests(pos, { chess960: variant === 'chess960' });

/** Legal targets grouped by origin, in chessground's format. Empty when the position is not legal. */
export const toDests = (fen: string, variant: Variant = 'standard'): Dests => {
  const { pos } = readPosition(fen, variant);
  return pos ? destsOf(pos, variant) : new Map();
};

// Chessground's premove rule: movable.color is mine, turnColor is the opponent's, dests is
// empty, so every click becomes a premove. `both` is always my turn, so it never premoves.
export const boardState = ({
  fen,
  variant = 'standard',
  playerColor,
  locked = false,
  premove = true,
}: BoardStateInput): BoardState => {
  const { displayable, pos } = readPosition(fen, variant);
  const turnColor = pos ? pos.turn : turnColorOf(fen);
  const check = pos && pos.isCheck() ? turnColor : false;
  const isOver = pos ? pos.isEnd() : false;
  const movableColor = pos && playerColor && !locked && !isOver ? playerColor : undefined;
  const myTurn = playerColor === 'both' || turnColor === playerColor;
  const dests: Dests = pos && movableColor && myTurn ? destsOf(pos, variant) : new Map();

  return {
    turnColor,
    check,
    dests,
    movableColor,
    premovable: premove && !!movableColor && !myTurn,
    isOver,
    isDisplayable: displayable,
  };
};
