// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BoardControls } from '../src/components/BoardControls';

describe('BoardControls', () => {
  afterEach(cleanup);

  it('renders only the buttons whose callback is given', () => {
    const { container, rerender } = render(<BoardControls />);
    expect(container.querySelectorAll('button')).toHaveLength(0);
    expect(container.querySelector('.next-chessground-controls')).not.toBeNull();

    rerender(<BoardControls onFlip={() => undefined} />);
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.map((button) => button.dataset.control)).toEqual(['flip']);
  });

  it('calls the callback of the clicked button', () => {
    const onFlip = vi.fn();
    const onSettings = vi.fn();
    const { container } = render(<BoardControls onFlip={onFlip} onSettings={onSettings} />);
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.map((button) => button.dataset.control)).toEqual(['settings', 'flip']);

    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    expect(onSettings).toHaveBeenCalledTimes(1);
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('labels the buttons in English by default', () => {
    const { container } = render(
      <BoardControls onFlip={() => undefined} onSettings={() => undefined} />
    );
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Board settings',
      'Flip board',
    ]);
    expect(buttons.map((button) => button.getAttribute('title'))).toEqual([
      'Board settings',
      'Flip board',
    ]);
    // Font Awesome solid glyphs: filled paths on the 512-wide grid, no stroke.
    const svgs = buttons.map((button) => button.querySelector('svg'));
    expect(svgs.map((svg) => svg?.getAttribute('viewBox'))).toEqual(['0 0 512 512', '0 0 512 512']);
    expect(svgs.every((svg) => svg?.getAttribute('fill') === 'currentColor')).toBe(true);
    expect(svgs.every((svg) => svg?.querySelectorAll('path').length === 1)).toBe(true);
  });

  it('takes custom icons, labels and class names', () => {
    const { container } = render(
      <BoardControls
        className="my-bar"
        classNames={{ button: 'my-button' }}
        icons={{ flip: <i className="icon-flip" />, settings: <i className="icon-gear" /> }}
        labels={{ flip: 'Rotire', settings: 'Setari' }}
        onFlip={() => undefined}
        onSettings={() => undefined}
      />
    );
    const bar = container.querySelector('.next-chessground-controls');
    expect(bar?.className).toBe('next-chessground-controls my-bar');
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.map((button) => button.className)).toEqual([
      'next-chessground-control my-button',
      'next-chessground-control my-button',
    ]);
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Setari',
      'Rotire',
    ]);
    expect(container.querySelector('.icon-gear')).not.toBeNull();
    expect(container.querySelector('.icon-flip')).not.toBeNull();
    expect(container.querySelector('svg')).toBeNull();
  });
});
