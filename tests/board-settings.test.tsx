// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BoardSettings } from '../src/components/BoardSettings';
import type { BoardSettingsProps } from '../src/components/BoardSettings';
import { DEFAULT_PREFS } from '../src/prefs/options';
import { readPrefs, resetPrefsCache } from '../src/prefs/store';

class FakeAudio {
  static created: FakeAudio[] = [];
  currentTime = 1;
  play = vi.fn(() => Promise.resolve());
  constructor(public src: string) {
    FakeAudio.created.push(this);
  }
}

const setup = (props: Partial<BoardSettingsProps> = {}) => {
  const onClose = vi.fn();
  const { container } = render(<BoardSettings onClose={onClose} open {...props} />);
  const query = (selector: string) => container.querySelector(selector);
  const options = (section: string) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>(`[data-option="${section}"]`));
  const rows = () => Array.from(container.querySelectorAll<HTMLElement>('[data-section]'));
  return { container, onClose, options, query, rows };
};

describe('BoardSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    resetPrefsCache();
    FakeAudio.created = [];
    vi.stubGlobal('Audio', FakeAudio);
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<BoardSettings onClose={() => undefined} open={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the four rows with the preferences as the active options', () => {
    const { options, query, rows } = setup();
    expect(rows().map((row) => row.dataset.section)).toEqual([
      'board',
      'pieces',
      'sound',
      'toggles',
    ]);
    expect(rows().every((row) => row.classList.contains('next-chessground-settings-row'))).toBe(
      true
    );
    expect(query('.next-chessground-settings-title')?.textContent).toBe('Board settings');
    expect(options('board').map((button) => button.dataset.value)).toEqual([
      'green',
      'brown',
      'ruby',
      'purple',
      'teal',
    ]);
    const active = (section: string) =>
      options(section).find((button) => button.classList.contains('is-active'))?.dataset.value;
    expect(active('board')).toBe(DEFAULT_PREFS.board);
    expect(active('pieces')).toBe(DEFAULT_PREFS.pieces);
    expect(active('sound')).toBe(DEFAULT_PREFS.sound);
    expect(options('board')[0]?.getAttribute('aria-pressed')).toBe('true');
    expect(query('.next-chessground-swatch.board-green')).not.toBeNull();
    expect(query('.next-chessground-piece-preview.pieces-neo piece')?.getAttribute('class')).toBe(
      'knight white'
    );
  });

  it('writes the picked board and marks it active', () => {
    const { options } = setup();
    const brown = options('board').find((button) => button.dataset.value === 'brown');
    fireEvent.click(brown as HTMLButtonElement);
    expect(readPrefs().board).toBe('brown');
    expect(brown?.classList.contains('is-active')).toBe(true);
    expect(options('board')[0]?.classList.contains('is-active')).toBe(false);
  });

  it('writes the picked piece set', () => {
    const { options } = setup();
    fireEvent.click(options('pieces')[1] as HTMLButtonElement);
    expect(readPrefs().pieces).toBe('cburnett');
  });

  it('writes the picked sound and plays it as a sample', () => {
    const { options } = setup();
    const piano = options('sound').find((button) => button.dataset.value === 'piano');
    expect(piano?.classList.contains('next-chessground-settings-segment')).toBe(true);
    expect(piano?.closest('.next-chessground-settings-segmented')).not.toBeNull();
    expect(piano?.textContent).toBe('Piano');
    fireEvent.click(piano as HTMLButtonElement);
    expect(readPrefs().sound).toBe('piano');
    expect(FakeAudio.created).toHaveLength(1);
    expect(FakeAudio.created[0]?.play).toHaveBeenCalledTimes(1);
  });

  it('flips a toggle and its preference', () => {
    const { container } = setup();
    const toggle = container.querySelector<HTMLButtonElement>('[data-toggle="showDests"]');
    expect(toggle?.getAttribute('role')).toBe('switch');
    expect(toggle?.getAttribute('aria-checked')).toBe('true');
    expect(toggle?.querySelector('.next-chessground-settings-toggle-thumb')).not.toBeNull();
    fireEvent.click(toggle as HTMLButtonElement);
    expect(readPrefs().showDests).toBe(false);
    expect(toggle?.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(toggle as HTMLButtonElement);
    expect(readPrefs().showDests).toBe(true);
  });

  it('closes on Escape, on the backdrop and on the close button, but not inside the panel', () => {
    const { onClose, query } = setup();
    const backdrop = query('.next-chessground-settings') as Element;
    const panel = query('.next-chessground-settings-panel') as Element;

    fireEvent.click(panel);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(backdrop, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(2);

    fireEvent.click(query('.next-chessground-settings-close') as Element);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('renders only the sections it is asked for', () => {
    const { rows } = setup({ sections: ['board'] });
    expect(rows().map((row) => row.dataset.section)).toEqual(['board']);
  });

  it('applies the labels and option labels it is given', () => {
    const { container, options, query } = setup({
      labels: { close: 'Inchide', showDests: 'Mutari legale', title: 'Setari tabla' },
      optionLabels: { boards: { green: 'Verde' }, sounds: { silent: 'Fara sunet' } },
    });
    expect(query('.next-chessground-settings-title')?.textContent).toBe('Setari tabla');
    expect(query('.next-chessground-settings-close')?.getAttribute('aria-label')).toBe('Inchide');
    expect(
      container.querySelector('[data-section="board"] .next-chessground-settings-label')
        ?.textContent
    ).toBe('Board');
    expect(options('board')[0]?.getAttribute('aria-label')).toBe('Verde');
    expect(options('board')[1]?.getAttribute('aria-label')).toBe('Brown');
    expect(options('sound').at(-1)?.textContent).toBe('Fara sunet');
    expect(container.querySelector('[data-toggle="showDests"]')?.getAttribute('aria-label')).toBe(
      'Mutari legale'
    );
  });

  it('adds the class names it is given to the panel and its parts', () => {
    const { query } = setup({
      className: 'my-overlay',
      classNames: {
        control: 'my-control',
        label: 'my-label',
        option: 'my-option',
        panel: 'my-panel',
        row: 'my-row',
        segment: 'my-segment',
        toggle: 'my-toggle',
      },
    });
    expect(query('.next-chessground-settings')?.className).toBe(
      'next-chessground-settings my-overlay'
    );
    expect(query('.next-chessground-settings-panel')?.className).toBe(
      'next-chessground-settings-panel my-panel'
    );
    expect(query('.next-chessground-settings-option')?.classList.contains('my-option')).toBe(true);
    expect(query('.next-chessground-settings-toggle')?.classList.contains('my-toggle')).toBe(true);
    expect(query('.next-chessground-settings-row')?.classList.contains('my-row')).toBe(true);
    expect(query('.next-chessground-settings-label')?.classList.contains('my-label')).toBe(true);
    expect(query('.next-chessground-settings-control')?.classList.contains('my-control')).toBe(
      true
    );
    expect(query('.next-chessground-settings-segment')?.classList.contains('my-segment')).toBe(
      true
    );
  });

  it('keeps the 1.x class name slots working on the renamed elements', () => {
    const { query } = setup({
      classNames: {
        chip: 'my-chip',
        options: 'my-options',
        section: 'my-section',
        sectionTitle: 'my-title',
      },
    });
    expect(query('.next-chessground-settings-row')?.classList.contains('my-section')).toBe(true);
    expect(query('.next-chessground-settings-label')?.classList.contains('my-title')).toBe(true);
    expect(query('.next-chessground-settings-control')?.classList.contains('my-options')).toBe(
      true
    );
    expect(query('.next-chessground-settings-segment')?.classList.contains('my-chip')).toBe(true);
  });

  it('is a labelled modal dialog', () => {
    const { query } = setup();
    const backdrop = query('.next-chessground-settings');
    const title = query('.next-chessground-settings-title');
    expect(backdrop?.getAttribute('role')).toBe('dialog');
    expect(backdrop?.getAttribute('aria-modal')).toBe('true');
    expect(backdrop?.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(document.activeElement).toBe(query('.next-chessground-settings-close'));
  });
});
