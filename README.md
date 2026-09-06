# Next Chessground

Declarative React chessboard built on Lichess [chessground](https://github.com/lichess-org/chessground) and [chessops](https://github.com/niklasf/chessops), with legal moves, pawn promotion, premoves and variants out of the box.

Built by chess players in React and Next.js

## Live Demo

[https://next-chessground.vercel.app](https://next-chessground.vercel.app)

## Features

- legal moves only, validated with `chessops`; every move arrives as `{ from, to, promotion, uci, san, fen }`
- pawn promotion picker, premoves and snap-back on illegal moves
- Standard, Chess960, King of the Hill and Three-check variants
- five board themes, five piece sets and move sounds, remembered in `localStorage`
- one component for live games, analysis and static positions
- TypeScript types, ESM, React 18 and 19, server-side rendering

## Installation

```bash
npm i next-chessground
# or
yarn add next-chessground
```

Import the stylesheets once, at the app entry point (`pages/_app.js` or `app/layout.js`):

```js
import 'next-chessground/styles.css';
import 'next-chessground/pieces.css';
```

## Usage

The app owns the position. The board reports validated moves through `onMove`, and the app feeds the new `fen` back in.

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

The board fills its parent, so size the wrapper element. Omit `playerColor` for a static board that accepts no input.

### Engine moves

Give the user one side with `playerColor="white"` and validate the engine's reply with `uciMove`. It returns the same move shape as `onMove`, or `null` when the move is illegal in the current position.

```js
import { uciMove } from 'next-chessground';

const reply = uciMove(fen, 'e7e5');
if (reply) onMove(reply);
```

### Preferences and controls

The package ships the board and its data, not the chrome. Build the flip button and the settings panel in your own design system and pass them as `children`; they render inside the board root and cover the squares and nothing else.

```jsx
import { useState } from 'react';
import { BOARDS, Chessboard, playSound, SOUNDS, useBoardPrefs } from 'next-chessground';

const Game = ({ fen, onMove }) => {
  const [prefs, setPrefs] = useBoardPrefs();
  const [orientation, setOrientation] = useState('white');

  return (
    <Chessboard fen={fen} onMove={onMove} orientation={orientation} playerColor="both">
      <div className="board-menu">
        <button onClick={() => setOrientation(orientation === 'white' ? 'black' : 'white')}>
          Flip
        </button>

        {BOARDS.map((board) => (
          <button key={board} aria-pressed={prefs.board === board} onClick={() => setPrefs({ board })}>
            <span className={`swatch board-${board}`} />
          </button>
        ))}

        {SOUNDS.map((sound) => (
          <button
            key={sound}
            aria-pressed={prefs.sound === sound}
            onClick={() => {
              setPrefs({ sound });
              playSound(sound);
            }}
          >
            {sound}
          </button>
        ))}
      </div>
    </Chessboard>
  );
};
```

- Preferences live in one store persisted under the `localStorage` key `next-chessground`. A change applies to every board on the page and survives a reload.
- `.board-<id>` sets `--board-bg` to the theme image, so `.swatch { background-image: var(--board-bg); background-size: 400% 400% }` previews a 2x2 corner of it.
- `.pieces-<id>` around `<piece class="knight white"></piece>` renders a piece of that set. The nearest `.pieces-<id>` ancestor wins, so previews work inside the board too.

## Theming

The stylesheets expose their look through CSS custom properties. Override them from your own CSS instead of forking `styles.css`.

| Property | Default | Purpose |
| --- | --- | --- |
| `--board-radius` | `0.25rem` | Corner radius of the board. |
| `--board-bg` | set per theme by `.board-<id>` | Board square image. |
| `--coord-light`, `--coord-dark` | set per theme by `.board-<id>` | Coordinate text colour on light and dark squares. |
| `--board-font` | `system-ui, sans-serif` | Font family of the rank and file coordinates. |
| `--promotion-backdrop` | `rgba(0, 0, 0, 0.35)` | Overlay behind the promotion picker. |
| `--promotion-tile-radius` | `0.5rem` | Corner radius of each promotion tile. |
| `--promotion-tile-bg` | `rgba(255, 255, 255, 0.96)` | Background of each promotion tile. The 1.x `--promotion-choice-bg` still applies when set. |
| `--promotion-tile-hover-bg` | `#ffffff` | Tile background on hover and focus. The 1.x `--promotion-choice-hover-bg` still applies when set. |
| `--promotion-tile-shadow` | `0 2px 10px rgba(0, 0, 0, 0.35)` | Drop shadow under the promotion tiles. |
| `--promotion-accent` | `#3b82f6` | Outline colour of a hovered or focused tile. |
| `--promotion-piece-size` | `82%` | Size of the piece inside a promotion tile. |
| `--promotion-cancel-color` | `#6b7280` | Icon colour of the cancel tile. |

Piece sets follow one pattern instead of individual properties: each `.pieces-<id>` class (`cburnett`, `classic`, `neo`, `alpha`, `bases`) defines twelve `--piece-<color>-<role>` variables such as `--piece-white-pawn` or `--piece-black-knight`. Override one variable on your own selector to swap a single piece.

### Class names

These class names are stable and safe to target from application CSS.

| Class | Element |
| --- | --- |
| `next-chessground` | Root element. Carries the `board-<id>`, `pieces-<id>` and `highlight` classes. |
| `next-chessground-board` | Element chessground mounts into. |
| `next-chessground-promotion`, `next-chessground-promotion-choice`, `next-chessground-promotion-cancel` | Promotion picker overlay and its tiles. |
| `board-<id>` | Board theme: `brown`, `green`, `purple`, `ruby`, `teal`. Also usable standalone on a swatch. |
| `pieces-<id>` | Piece set: `cburnett`, `classic`, `neo`, `alpha`, `bases`. |
| `highlight` | Last-move highlight toggle. Unprefixed for 1.x compatibility. |

### Network

`pieces.css` loads piece images from `images.chesscomfiles.com` and `lichess1.org`. An application with a Content Security Policy must allow both hosts in `img-src`. The stylesheets themselves are served locally with the package.

## API

### `<Chessboard>` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fen` | `string` | `INITIAL_FEN` | Position to display. |
| `variant` | `'standard' \| 'chess960' \| 'kingOfTheHill' \| 'threeCheck'` | `'standard'` | Rules used to validate moves. |
| `playerColor` | `'white' \| 'black' \| 'both'` | none | Side the user may move. Omit for a static board. |
| `orientation` | `'white' \| 'black'` | `'white'` | Side shown at the bottom. |
| `lastMove` | `[Key, Key] \| null` | `null` | Squares to highlight as the last move. |
| `onMove` | `(move: Move) => void` | | Called with `{ from, to, promotion, uci, san, fen }` after a legal move. |
| `locked` | `boolean` | `false` | Disables move input while keeping the board live, for example while waiting for the opponent. |
| `viewOnly` | `boolean` | `false` | Static picture: no dragging, drawing or sounds. |
| `premove` | `boolean` | `true` | Allows a move to be queued during the opponent's turn. |
| `coordinates` | `boolean` | from preferences | Shows rank and file labels. |
| `shapes` | `DrawShape[]` | | User-drawn arrows and circles. |
| `autoShapes` | `DrawShape[]` | | Program-drawn shapes, for example engine suggestions. |
| `onShapesChange` | `(shapes: DrawShape[]) => void` | | Called when the user draws or clears shapes. |
| `labels` | `PromotionLabels` | English | Texts of the promotion picker: `queen`, `rook`, `bishop`, `knight`, `dialog`, `cancel`. |
| `className` | `string` | | Extra class on the root element. |
| `children` | `ReactNode` | | Rendered over the board, inside the root element. |

### Also exported

- Components: `Board` (controlled board without rules), `Promotion` (the picker on its own).
- Hooks: `useChessboard`, `useBoardPrefs`, `useBoardSound`, `useMoveSound`, `useBoardOrientation`.
- Rules: `uciMove`, `userMove`, `isValidFen`, `isDisplayableFen`, `isPromotion`, `boardState`, `toDests`, `turnColorOf`, `promotionSquares`.
- Preferences and sound: `BOARDS`, `PIECES`, `SOUNDS`, `SILENT`, `DEFAULT_PREFS`, `STORAGE_KEY`, `readPrefs`, `writePrefs`, `subscribePrefs`, `playSound`.
- Constants and types: `INITIAL_FEN`, `EMPTY_FEN`, `Move`, `Prefs`, `BoardId`, `PieceSetId`, `SoundId`, `Variant`, `PlayerColor`, `Color`, `Key`, `Dests`, `DrawShape`.
