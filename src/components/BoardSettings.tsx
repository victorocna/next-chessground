import type { KeyboardEvent, MouseEvent } from 'react';
import { useId } from 'react';
import { useBoardPrefs } from '../hooks/use-board-prefs';
import { playSound } from '../sound/play';
import { CloseIcon } from './icons';
import { resolveLabels } from './settings/labels';
import { SettingsOptions } from './settings/SettingsOptions';
import { SettingsToggles } from './settings/SettingsToggles';
import type { BoardSettingsProps, SettingsSection } from './settings/types';

export type {
  BoardSettingsProps,
  SettingsClassNames,
  SettingsLabels,
  SettingsOptionLabels,
  SettingsSection,
} from './settings/types';

const DEFAULT_SECTIONS: SettingsSection[] = ['board', 'pieces', 'sound', 'toggles'];

const classes = (...names: (string | undefined | false)[]): string =>
  names.filter(Boolean).join(' ');

/**
 * Board menu drawn over the board, not over the page: it is a child of `Board`, whose root is
 * the positioning context. A frosted dark panel of one row per preference. Backdrop click,
 * Escape and the close button all dismiss it.
 */
export const BoardSettings = ({
  className,
  classNames = {},
  icons,
  labels,
  onClose,
  open,
  optionLabels,
  sections = DEFAULT_SECTIONS,
}: BoardSettingsProps) => {
  const [prefs, setPrefs] = useBoardPrefs();
  const titleId = useId();
  if (!open) {
    return null;
  }
  const text = resolveLabels(labels);

  const select = (kind: 'board' | 'pieces' | 'sound', value: string) => {
    if (kind === 'sound') {
      setPrefs({ sound: value });
      // Play the chosen set once so the choice can be heard.
      playSound(value);
    } else {
      setPrefs(kind === 'board' ? { board: value } : { pieces: value });
    }
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };
  const keepOpen = (event: MouseEvent) => event.stopPropagation();

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className={classes('next-chessground-settings', className, classNames.backdrop)}
      onClick={onClose}
      onKeyDown={onKeyDown}
      role="dialog"
      tabIndex={-1}
    >
      <div
        className={classes('next-chessground-settings-panel', classNames.panel)}
        onClick={keepOpen}
      >
        <header className={classes('next-chessground-settings-header', classNames.header)}>
          <h2 className={classes('next-chessground-settings-title', classNames.title)} id={titleId}>
            {text.title}
          </h2>
          <button
            aria-label={text.close}
            autoFocus
            className={classes('next-chessground-settings-close', classNames.close)}
            onClick={onClose}
            title={text.close}
            type="button"
          >
            {icons?.close ?? <CloseIcon />}
          </button>
        </header>
        {sections.map((section) =>
          section === 'toggles' ? (
            <SettingsToggles
              classNames={classNames}
              key={section}
              labels={text}
              onToggle={(key, value) => setPrefs({ [key]: value })}
              prefs={prefs}
            />
          ) : (
            <SettingsOptions
              classNames={classNames}
              key={section}
              kind={section}
              onSelect={(value) => select(section, value)}
              optionLabels={optionLabels}
              title={text[section]}
              value={prefs[section]}
            />
          )
        )}
      </div>
    </div>
  );
};
