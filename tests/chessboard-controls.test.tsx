// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Chessboard } from '../src/components/Chessboard';
import { resetPrefsCache } from '../src/prefs/store';

const control = (container: HTMLElement, name: string) =>
  container.querySelector<HTMLButtonElement>(`[data-control="${name}"]`);
const orientation = (container: HTMLElement) =>
  container.querySelector('.cg-wrap')?.classList.contains('orientation-black') ? 'black' : 'white';

describe('Chessboard controls', () => {
  beforeEach(() => {
    localStorage.clear();
    resetPrefsCache();
  });
  afterEach(cleanup);

  it('renders no frame and no bar without the controls prop', () => {
    const { container } = render(<Chessboard />);
    expect(container.querySelector('.next-chessground-frame')).toBeNull();
    expect(container.querySelector('.next-chessground-controls')).toBeNull();
    expect(container.firstElementChild?.classList.contains('next-chessground')).toBe(true);
  });

  it('wraps the board in a frame with the two buttons', () => {
    const { container } = render(<Chessboard controls />);
    const frame = container.querySelector('.next-chessground-frame');
    expect(frame?.firstElementChild?.classList.contains('next-chessground')).toBe(true);
    expect(frame?.lastElementChild?.classList.contains('next-chessground-controls')).toBe(true);
    expect(control(container, 'settings')).not.toBeNull();
    expect(control(container, 'flip')).not.toBeNull();
  });

  it('passes the controls options through', () => {
    const { container } = render(
      <Chessboard controls={{ className: 'my-bar', labels: { flip: 'Rotire' } }} />
    );
    expect(container.querySelector('.next-chessground-controls.my-bar')).not.toBeNull();
    expect(control(container, 'flip')?.getAttribute('aria-label')).toBe('Rotire');
  });

  it('flips the board and reports it when orientation is uncontrolled', () => {
    const onOrientationChange = vi.fn();
    const { container } = render(<Chessboard controls onOrientationChange={onOrientationChange} />);
    expect(orientation(container)).toBe('white');

    fireEvent.click(control(container, 'flip') as HTMLButtonElement);
    expect(orientation(container)).toBe('black');
    expect(onOrientationChange).toHaveBeenCalledExactlyOnceWith('black');

    fireEvent.click(control(container, 'flip') as HTMLButtonElement);
    expect(orientation(container)).toBe('white');
    expect(onOrientationChange).toHaveBeenLastCalledWith('white');
  });

  it('starts from defaultOrientation', () => {
    const { container } = render(<Chessboard controls defaultOrientation="black" />);
    expect(orientation(container)).toBe('black');
  });

  it('only reports the flip when orientation is controlled', () => {
    const onOrientationChange = vi.fn();
    const { container } = render(
      <Chessboard controls onOrientationChange={onOrientationChange} orientation="white" />
    );
    fireEvent.click(control(container, 'flip') as HTMLButtonElement);
    expect(onOrientationChange).toHaveBeenCalledExactlyOnceWith('black');
    expect(orientation(container)).toBe('white');
  });

  it('hides the flip button when a controlled orientation cannot change', () => {
    const { container } = render(<Chessboard controls orientation="black" />);
    expect(control(container, 'flip')).toBeNull();
    expect(control(container, 'settings')).not.toBeNull();
  });

  it('opens and closes the settings overlay from the gear', () => {
    const onSettingsOpenChange = vi.fn();
    const { container } = render(
      <Chessboard controls onSettingsOpenChange={onSettingsOpenChange} />
    );
    expect(container.querySelector('.next-chessground-settings')).toBeNull();

    fireEvent.click(control(container, 'settings') as HTMLButtonElement);
    const overlay = container.querySelector('.next-chessground-settings');
    expect(overlay).not.toBeNull();
    // The overlay lives inside the board root, so it covers the squares and nothing else.
    expect(overlay?.parentElement?.classList.contains('next-chessground')).toBe(true);
    expect(onSettingsOpenChange).toHaveBeenCalledExactlyOnceWith(true);

    fireEvent.click(container.querySelector('.next-chessground-settings-close') as Element);
    expect(container.querySelector('.next-chessground-settings')).toBeNull();
    expect(onSettingsOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('passes the settings options through to the overlay', () => {
    const { container } = render(
      <Chessboard controls settings={{ labels: { title: 'Setari' }, sections: ['board'] }} />
    );
    fireEvent.click(control(container, 'settings') as HTMLButtonElement);
    expect(container.querySelector('.next-chessground-settings-title')?.textContent).toBe('Setari');
    expect(container.querySelectorAll('.next-chessground-settings [data-section]')).toHaveLength(1);
  });

  it('takes a controlled settingsOpen, without controls', () => {
    const onSettingsOpenChange = vi.fn();
    const { container, rerender } = render(
      <Chessboard onSettingsOpenChange={onSettingsOpenChange} settingsOpen />
    );
    expect(container.querySelector('.next-chessground-frame')).toBeNull();
    expect(container.querySelector('.next-chessground-settings')).not.toBeNull();

    fireEvent.click(container.querySelector('.next-chessground-settings-close') as Element);
    expect(onSettingsOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    // Still open: the state belongs to the app now.
    expect(container.querySelector('.next-chessground-settings')).not.toBeNull();

    rerender(<Chessboard onSettingsOpenChange={onSettingsOpenChange} settingsOpen={false} />);
    expect(container.querySelector('.next-chessground-settings')).toBeNull();
  });
});
