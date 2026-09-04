import { BOARDS, PIECES, SOUNDS } from '../../prefs/options';
import { optionLabel } from './labels';
import type { SettingsClassNames, SettingsOptionLabels } from './types';

/** Chessground paints `<piece>`, which React refuses to render as JSX: set it as markup. */
const PREVIEW_PIECE = '<piece class="knight white"></piece>';

const GROUPS = {
  board: { group: 'boards', ids: BOARDS },
  pieces: { group: 'pieces', ids: PIECES },
  sound: { group: 'sounds', ids: SOUNDS },
} as const;

export interface SettingsOptionsProps {
  classNames: SettingsClassNames;
  kind: keyof typeof GROUPS;
  onSelect: (value: string) => void;
  optionLabels?: SettingsOptionLabels;
  title: string;
  value: string;
}

const classes = (...names: (string | undefined | false)[]): string =>
  names.filter(Boolean).join(' ');

/**
 * One row of the board menu: its name on the left, the options on the right. Board and pieces
 * are picture tiles, sound is a segmented control of text labels. The active one is marked.
 */
export const SettingsOptions = ({
  classNames,
  kind,
  onSelect,
  optionLabels,
  title,
  value,
}: SettingsOptionsProps) => {
  const { group, ids } = GROUPS[kind];
  const segmented = kind === 'sound';

  return (
    <div
      className={classes('next-chessground-settings-row', classNames.row, classNames.section)}
      data-section={kind}
    >
      <span
        className={classes(
          'next-chessground-settings-label',
          classNames.label,
          classNames.sectionTitle
        )}
      >
        {title}
      </span>
      <div
        className={classes(
          segmented ? 'next-chessground-settings-segmented' : 'next-chessground-settings-control',
          segmented && classNames.segmented,
          classNames.control,
          classNames.options
        )}
      >
        {ids.map((id) => {
          const active = id === value;
          const label = optionLabel(group, id, optionLabels);
          return (
            <button
              aria-label={label}
              aria-pressed={active}
              className={classes(
                segmented
                  ? 'next-chessground-settings-segment'
                  : 'next-chessground-settings-option',
                active && 'is-active',
                segmented && classNames.segment,
                segmented && classNames.chip,
                classNames.option,
                active && classNames.optionActive
              )}
              data-option={kind}
              data-value={id}
              key={id}
              onClick={() => onSelect(id)}
              type="button"
            >
              {kind === 'board' && (
                <span
                  className={classes('next-chessground-swatch', `board-${id}`, classNames.swatch)}
                />
              )}
              {kind === 'pieces' && (
                <span
                  className={classes(
                    'next-chessground-piece-preview',
                    `pieces-${id}`,
                    classNames.piecePreview
                  )}
                  dangerouslySetInnerHTML={{ __html: PREVIEW_PIECE }}
                />
              )}
              {segmented && label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
