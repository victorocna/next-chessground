// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Chessboard } from '../src/components/Chessboard';
import { resetPrefsCache } from '../src/prefs/store';

const orientation = (container: HTMLElement) =>
  container.querySelector('.cg-wrap')?.classList.contains('orientation-black') ? 'black' : 'white';

describe('Chessboard', () => {
  beforeEach(() => {
    localStorage.clear();
    resetPrefsCache();
  });
  afterEach(cleanup);

  it('renders children inside the board root, over the squares', () => {
    const { container } = render(
      <Chessboard>
        <div data-testid="overlay" />
      </Chessboard>
    );
    const overlay = container.querySelector('[data-testid="overlay"]');
    expect(overlay?.parentElement?.classList.contains('next-chessground')).toBe(true);
  });

  it('takes the orientation from the prop', () => {
    const { container, rerender } = render(<Chessboard />);
    expect(orientation(container)).toBe('white');

    rerender(<Chessboard orientation="black" />);
    expect(orientation(container)).toBe('black');
  });

  it('renders the bare board, with no chrome around it', () => {
    const { container } = render(<Chessboard />);
    expect(container.querySelector('.next-chessground-frame')).toBeNull();
    expect(container.firstElementChild?.classList.contains('next-chessground')).toBe(true);
  });
});
