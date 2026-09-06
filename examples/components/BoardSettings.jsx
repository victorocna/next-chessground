import { useEffect } from 'react';
import { BOARDS, PIECES, SILENT, SOUNDS, playSound, useBoardPrefs } from 'next-chessground';
import { classnames } from '../lib';

const PREVIEW_PIECE = '<piece class="knight white"></piece>';

const TOGGLES = [
  { key: 'showDests', label: 'Show legal moves' },
  { key: 'highlight', label: 'Highlight last move' },
  { key: 'coordinates', label: 'Coordinates' },
];

const soundLabel = (id) => (id === SILENT ? 'Off' : id.charAt(0).toUpperCase() + id.slice(1));

const Row = ({ children, title }) => {
  return (
    <div className="demo-settings-row">
      <span className="demo-settings-row-label">{title}</span>
      <div className="demo-settings-row-options">{children}</div>
    </div>
  );
};

const Toggle = ({ checked, label, onChange }) => {
  return (
    <div className="demo-toggle">
      <span className="demo-toggle-label">{label}</span>
      <button
        aria-checked={checked}
        aria-label={label}
        className={classnames('demo-switch', checked && 'is-on')}
        onClick={() => onChange(!checked)}
        role="switch"
        type="button"
      >
        <span className="demo-switch-knob" />
      </button>
    </div>
  );
};

const BoardSettings = ({ onClose }) => {
  const [prefs, setPrefs] = useBoardPrefs();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const pickSound = (sound) => {
    setPrefs({ sound });
    playSound(sound);
  };

  return (
    <div className="demo-settings-backdrop" onClick={onClose}>
      <div
        aria-label="Board settings"
        aria-modal="true"
        className="demo-settings"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="demo-settings-header">
          <h2 className="demo-settings-title">Board settings</h2>
          <button
            aria-label="Close settings"
            autoFocus
            className="demo-settings-close"
            onClick={onClose}
            title="Close settings"
            type="button"
          >
            <i aria-hidden="true" className="fas fa-times" />
          </button>
        </div>

        <Row title="Board">
          {BOARDS.map((id) => (
            <button
              aria-label={id}
              aria-pressed={id === prefs.board}
              className={classnames('demo-tile', id === prefs.board && 'is-active')}
              key={id}
              onClick={() => setPrefs({ board: id })}
              type="button"
            >
              <span className={classnames('demo-swatch', `board-${id}`)} />
            </button>
          ))}
        </Row>

        <Row title="Pieces">
          {PIECES.map((id) => (
            <button
              aria-label={id}
              aria-pressed={id === prefs.pieces}
              className={classnames('demo-tile', id === prefs.pieces && 'is-active')}
              key={id}
              onClick={() => setPrefs({ pieces: id })}
              type="button"
            >
              <span
                className={classnames('demo-piece-preview', `pieces-${id}`)}
                dangerouslySetInnerHTML={{ __html: PREVIEW_PIECE }}
              />
            </button>
          ))}
        </Row>

        <Row title="Sound">
          <div className="demo-segmented">
            {SOUNDS.map((id) => (
              <button
                aria-pressed={id === prefs.sound}
                className={classnames('demo-segment', id === prefs.sound && 'is-active')}
                key={id}
                onClick={() => pickSound(id)}
                type="button"
              >
                {soundLabel(id)}
              </button>
            ))}
          </div>
        </Row>

        <div className="demo-toggles">
          {TOGGLES.map(({ key, label }) => (
            <Toggle
              checked={prefs[key]}
              key={key}
              label={label}
              onChange={(value) => setPrefs({ [key]: value })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardSettings;
