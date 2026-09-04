// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BoardContext } from '../src/components/board-context';
import type { PromotionLabels } from '../src/components/Promotion';
import { Promotion } from '../src/components/Promotion';

const setup = (labels?: PromotionLabels) => {
  const onCancel = vi.fn();
  const onPick = vi.fn();
  const { container } = render(
    <BoardContext.Provider value={{ orientation: 'white' }}>
      <Promotion color="white" dest="e8" labels={labels} onCancel={onCancel} onPick={onPick} />
    </BoardContext.Provider>
  );
  const buttons = Array.from(container.querySelectorAll('button'));
  const backdrop = container.querySelector('.next-chessground-promotion');
  const cancel = container.querySelector<HTMLButtonElement>('.next-chessground-promotion-cancel');
  return { backdrop, buttons, cancel, onCancel, onPick };
};

describe('Promotion rendering', () => {
  afterEach(cleanup);

  it('places the four choices on the pawn file, from the promotion rank inwards', () => {
    const { buttons } = setup();
    expect(buttons).toHaveLength(5);
    expect(buttons.map((button) => button.dataset.role)).toEqual([
      'queen',
      'knight',
      'rook',
      'bishop',
      'cancel',
    ]);
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Queen',
      'Knight',
      'Rook',
      'Bishop',
      'Cancel',
    ]);
    expect(buttons.map((button) => button.style.top)).toEqual([
      '0%',
      '12.5%',
      '25%',
      '37.5%',
      '50%',
    ]);
    expect(buttons.map((button) => button.style.left)).toEqual(['50%', '50%', '50%', '50%', '50%']);
  });

  it('paints each choice with a chessground piece element of the right set', () => {
    const { buttons } = setup();
    const pieces = buttons.map((button) => button.querySelector('piece')?.getAttribute('class'));
    expect(pieces).toEqual([
      'queen white',
      'knight white',
      'rook white',
      'bishop white',
      undefined,
    ]);
  });

  it('closes the column with a cancel tile holding a decorative cross', () => {
    const { cancel } = setup();
    expect(cancel?.style.top).toBe('50%');
    expect(cancel?.style.height).toBe('12.5%');
    const svg = cancel?.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('focusable')).toBe('false');
    // Font Awesome solid `times`: one filled path, no stroke.
    expect(svg?.getAttribute('viewBox')).toBe('0 0 352 512');
    expect(svg?.querySelectorAll('path')).toHaveLength(1);
    expect(svg?.getAttribute('fill')).toBe('currentColor');
  });

  it('picks a role without cancelling, and cancels on the backdrop', () => {
    const { backdrop, buttons, onCancel, onPick } = setup();
    fireEvent.click(buttons[1]);
    expect(onPick).toHaveBeenCalledExactlyOnceWith('knight');
    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.click(backdrop as Element);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('cancels once on the cancel tile, without picking or double-firing the backdrop', () => {
    const { cancel, onCancel, onPick } = setup();
    fireEvent.click(cancel as Element);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onPick).not.toHaveBeenCalled();
  });

  it('cancels on Escape', () => {
    const { backdrop, onCancel, onPick } = setup();
    fireEvent.keyDown(backdrop as Element, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onPick).not.toHaveBeenCalled();
  });

  it('translates the labels it is given and keeps the English default for the rest', () => {
    const { backdrop, buttons, cancel } = setup({ queen: undefined, dialog: 'Promovare' });
    expect(buttons[0].getAttribute('aria-label')).toBe('Queen');
    expect(cancel?.getAttribute('aria-label')).toBe('Cancel');
    expect(backdrop?.getAttribute('aria-label')).toBe('Promovare');
  });

  it('translates the cancel label on its own', () => {
    const { backdrop, buttons, cancel } = setup({ cancel: 'Anulează' });
    expect(cancel?.getAttribute('aria-label')).toBe('Anulează');
    expect(buttons[0].getAttribute('aria-label')).toBe('Queen');
    expect(backdrop?.getAttribute('aria-label')).toBe('Promotion');
  });
});
