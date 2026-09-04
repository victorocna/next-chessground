import type { Prefs } from '../../board/types';
import type { SettingsClassNames, SettingsLabels } from './types';

const TOGGLES = ['showDests', 'highlight', 'coordinates'] as const;

type ToggleKey = (typeof TOGGLES)[number];

export interface SettingsTogglesProps {
  classNames: SettingsClassNames;
  labels: Required<SettingsLabels>;
  onToggle: (key: ToggleKey, value: boolean) => void;
  prefs: Prefs;
}

const classes = (...names: (string | undefined | false)[]): string =>
  names.filter(Boolean).join(' ');

/**
 * The three board switches: legal moves, last-move highlight, coordinates. One row of the board
 * menu, stacked into a sub-row per switch instead of a name and a control.
 */
export const SettingsToggles = ({ classNames, labels, onToggle, prefs }: SettingsTogglesProps) => (
  <div
    className={classes('next-chessground-settings-row', classNames.row, classNames.section)}
    data-section="toggles"
  >
    {TOGGLES.map((key) => (
      <div
        className={classes('next-chessground-settings-toggle-row', classNames.toggleRow)}
        key={key}
      >
        <span className={classes('next-chessground-settings-toggle-label', classNames.toggleLabel)}>
          {labels[key]}
        </span>
        <button
          aria-checked={prefs[key]}
          aria-label={labels[key]}
          className={classes('next-chessground-settings-toggle', classNames.toggle)}
          data-toggle={key}
          onClick={() => onToggle(key, !prefs[key])}
          role="switch"
          type="button"
        >
          <span className="next-chessground-settings-toggle-thumb" />
        </button>
      </div>
    ))}
  </div>
);
