import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import type { Color, Key, PromotionRole } from '../board/types';
import { promotionSquares } from '../rules/promotion-squares';
import { useBoardOrientation } from './board-context';
import { CloseIcon } from './icons';

export type PromotionLabels = Partial<Record<PromotionRole | 'dialog' | 'cancel', string>>;

export interface PromotionProps {
  color: Color;
  dest: Key;
  onPick: (role: PromotionRole) => void;
  onCancel: () => void;
  orientation?: Color;
  labels?: PromotionLabels;
}

const DEFAULT_LABELS: Required<PromotionLabels> = {
  queen: 'Queen',
  rook: 'Rook',
  bishop: 'Bishop',
  knight: 'Knight',
  dialog: 'Promotion',
  cancel: 'Cancel',
};
const SIZE = { height: '12.5%', width: '12.5%' };

/** `labels={{ queen: undefined }}` must keep the English default, so undefined never merges. */
const given = (labels: PromotionLabels = {}): PromotionLabels =>
  Object.fromEntries(Object.entries(labels).filter(([, value]) => value !== undefined));

/** Tiles pop in one after another down the column; two class names rule out :nth-of-type. */
const delay = (index: number): CSSProperties => ({ animationDelay: `${index * 30}ms` });

/** Promotion picker drawn over the board on the pawn's file; backdrop click or Escape cancels. */
export const Promotion = ({
  color,
  dest,
  labels,
  onCancel,
  onPick,
  orientation,
}: PromotionProps) => {
  const boardOrientation = useBoardOrientation();
  const { cancel, left, squares } = promotionSquares(dest, orientation ?? boardOrientation);
  const text = { ...DEFAULT_LABELS, ...given(labels) };

  const pick = (event: MouseEvent, role: PromotionRole) => {
    event.stopPropagation();
    onPick(role);
  };
  const dismiss = (event: MouseEvent) => {
    event.stopPropagation();
    onCancel();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      aria-label={text.dialog}
      aria-modal="true"
      className="next-chessground-promotion"
      onClick={onCancel}
      onKeyDown={onKeyDown}
      role="dialog"
      tabIndex={-1}
    >
      {squares.map(({ role, top }, index) => (
        <button
          aria-label={text[role]}
          autoFocus={role === 'queen'}
          className="next-chessground-promotion-choice"
          data-role={role}
          key={role}
          // React warns about the unknown <piece> tag in JSX, so the piece is set as markup.
          // Safe: role and color come from closed string unions, never from user input.
          dangerouslySetInnerHTML={{ __html: `<piece class="${role} ${color}"></piece>` }}
          onClick={(event) => pick(event, role)}
          style={{ ...SIZE, ...delay(index), left, top }}
          type="button"
        />
      ))}
      <button
        aria-label={text.cancel}
        className="next-chessground-promotion-cancel"
        data-role="cancel"
        onClick={dismiss}
        style={{ ...SIZE, ...delay(squares.length), left, top: cancel.top }}
        type="button"
      >
        <CloseIcon />
      </button>
    </div>
  );
};
