import type { ReactNode } from 'react';
import { FlipIcon, GearIcon } from './icons';

export interface BoardControlsProps {
  /** Shows the gear button; called on click. */
  onSettings?: () => void;
  /** Shows the flip button; called on click. */
  onFlip?: () => void;
  icons?: { settings?: ReactNode; flip?: ReactNode };
  labels?: { settings?: string; flip?: string };
  className?: string;
  classNames?: { button?: string };
}

const classes = (...names: (string | undefined | false)[]): string =>
  names.filter(Boolean).join(' ');

/** Buttons under the board. Each one appears only when its callback is given. */
export const BoardControls = ({
  className,
  classNames,
  icons,
  labels,
  onFlip,
  onSettings,
}: BoardControlsProps) => {
  const button = classes('next-chessground-control', classNames?.button);
  const settings = labels?.settings ?? 'Board settings';
  const flip = labels?.flip ?? 'Flip board';

  return (
    <div className={classes('next-chessground-controls', className)}>
      {onSettings && (
        <button
          aria-label={settings}
          className={button}
          data-control="settings"
          onClick={onSettings}
          title={settings}
          type="button"
        >
          {icons?.settings ?? <GearIcon />}
        </button>
      )}
      {onFlip && (
        <button
          aria-label={flip}
          className={button}
          data-control="flip"
          onClick={onFlip}
          title={flip}
          type="button"
        >
          {icons?.flip ?? <FlipIcon />}
        </button>
      )}
    </div>
  );
};
