# Next Chessground

Declarative React chessboard on lichess [chessground](https://github.com/lichess-org/chessground) with
[chessops](https://github.com/niklasf/chessops) rules: legal moves, pawn promotion, premoves and chess variants out of
the box. Version 2 is a rewrite of the 1.x wrapper.

Built by chess players in React and Next.js

## Live Demo

[https://next-chessground.vercel.app](https://next-chessground.vercel.app)

## Features

- legal chess moves only, validated by `chessops`; the app owns the position and receives every move as
  `{ from, to, promotion, uci, san, fen }`
- pawn promotion picker drawn over the board, premoves, snap-back on illegal moves
- optional on-board settings panel and flip control, fully themeable
- variants: standard, Chess960, King of the Hill, Three-check
- five board themes, five piece sets, move sounds and board preferences persisted in `localStorage`
- one component for live games, analysis and static previews; hooks and helpers exported for custom boards
- TypeScript types included, ESM, React 18 and 19, safe to render on the server

## Installation

```bash
npm i next-chessground
# or
yarn add next-chessground
```

Import the two stylesheets once, for example in `pages/_app.js`:

```js
import 'next-chessground/styles.css';
import 'next-chessground/pieces.css';
```

## Usage

```jsx
import { useState } from 'react';
import { Chessboard, INITIAL_FEN } from 'next-chessground';

const App = () => {
  const [fen, setFen] = useState(INITIAL_FEN);
  const [lastMove, setLastMove] = useState(null);

  const onMove = (move) => {
    setFen(move.fen);
    setLastMove([move.from, move.to]);
  };

  return (
    <div className="max-w-lg">
      <Chessboard fen={fen} lastMove={lastMove} onMove={onMove} playerColor="both" />
    </div>
  );
};

export default App;
```

To play against an engine, give the user one colour (`playerColor="white"`) and apply the engine's reply with
`uciMove`, which validates the UCI string against the current position:

```js
import { uciMove } from 'next-chessground';

const reply = uciMove(fen, 'e7e5'); // null when the move is illegal
if (reply) onMove(reply);
```

`Chessboard` props: `fen`, `variant` (`standard`, `chess960`, `kingOfTheHill`, `threeCheck`), `playerColor`
(`white`, `black`, `both`; omit it for a board nobody moves), `locked`, `viewOnly`, `premove`, `orientation`,
`defaultOrientation`, `onOrientationChange`, `lastMove`, `shapes`, `autoShapes`, `onMove`, `onShapesChange`,
`coordinates`, `labels`, `controls`, `settingsOpen`, `onSettingsOpenChange`, `settings`, `className`, `children`.
The board fills its container, so size the wrapper.

## Settings and flip

`controls` adds a small bar under the board with a settings gear and a flip button:

```jsx
<Chessboard controls fen={fen} onMove={onMove} playerColor="both" />
```

The gear opens a board menu over the board (board theme, piece set, sound, legal moves, last-move highlight,
coordinates): a frosted light panel of one row per preference, with a backdrop on the squares, not on the page.
Orientation follows the usual React pattern: leave it to the board with `defaultOrientation` and listen with
`onOrientationChange`, or own it with `orientation`. The overlay is
the same: internal by default, yours through `settingsOpen` and `onSettingsOpenChange` when the trigger is your own
button, and `<BoardSettings>` is exported for a board built from `Board`.

Everything visible is replaceable. The default icons are the Font Awesome Free solid glyphs `cog`, `sync-alt` and
`times`, drawn as inline SVG (no dependency, no web font) and swapped through `icons`:
`controls={{ icons, labels, className, classNames }}` takes the gear and the flip icon (any `ReactNode`), their
`aria-label` and `title`, and adds class names; `settings={{ sections, labels, optionLabels, icons, className,
classNames }}` takes the close icon, chooses which rows appear and in which order (`board`, `pieces`, `sound`,
`toggles`), translates the panel and the option names, and carries one class name slot per element (`backdrop`,
`panel`, `header`, `title`, `close`, `row`, `label`, `control`, `option`, `optionActive`, `swatch`, `piecePreview`,
`segmented`, `segment`, `toggleRow`, `toggleLabel`, `toggle`; the older `section`, `sectionTitle`, `options` and `chip`
still land on the row, its label, the control and a sound segment). Without any of that, the CSS variables are enough:
`--controls-size` (`2rem`), `--controls-color` (`#6b7280`), `--controls-hover-bg` (`rgba(0, 0, 0, 0.06)`),
`--controls-radius` (`0.375rem`), `--controls-gap` (`0.25rem`), `--settings-backdrop` (`rgba(0, 0, 0, 0.45)`),
`--settings-panel-bg` (`rgba(255, 255, 255, 0.94)`), `--settings-panel-blur` (`16px`), `--settings-panel-color`
(`#111827`), `--settings-muted` (`#6b7280`), `--settings-panel-border` (`rgba(0, 0, 0, 0.08)`),
`--settings-panel-radius` (`0.875rem`), `--settings-panel-shadow` (`0 20px 50px rgba(0, 0, 0, 0.25)`),
`--settings-accent` (`#3b82f6`), `--settings-accent-contrast` (`#ffffff`), `--settings-switch-off` (`rgba(0, 0, 0, 0.18)`), `--settings-tile-bg`
(`rgba(0, 0, 0, 0.05)`), `--settings-option-size` (`1.75rem`) and `--settings-font`
(`system-ui, sans-serif`).

Preferences: `useBoardPrefs()` returns `[prefs, setPrefs]` for `board`, `pieces`, `sound`, `showDests`,
`highlight` and `coordinates`; the ids live in `BOARDS`, `PIECES` and `SOUNDS`. Themes are the classes
`board-<id>` and `pieces-<id>` on the root element, with the CSS variables `--board-bg`, `--coord-light`,
`--coord-dark`, `--board-radius`, `--board-font`, and for the promotion picker `--promotion-backdrop`,
`--promotion-tile-bg`, `--promotion-tile-hover-bg`, `--promotion-tile-radius`, `--promotion-tile-shadow`,
`--promotion-accent`, `--promotion-cancel-color` and `--promotion-piece-size`. The controls bar and the settings panel add `.next-chessground-frame`,
`.next-chessground-controls`, `.next-chessground-control` and the `.next-chessground-settings*` classes.

Lower level: `useChessBoard` with `Board`, `Promotion`, `BoardControls` and `BoardSettings` for custom boards, and the helpers `userMove`,
`uciMove`, `toDests`, `isPromotion`, `isValidFen`, `isDisplayableFen`, `turnColorOf` and `boardState`. The
`examples/` app shows play against Stockfish, analysis, shapes and undo.
