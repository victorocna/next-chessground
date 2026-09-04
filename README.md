# Next Chessground

Declarative React chessboard built on Lichess [chessground](https://github.com/lichess-org/chessground) and [chessops](https://github.com/niklasf/chessops). Supports legal move validation, pawn promotion, premoves, and chess variants out of the box.

---

## Live Demo

[https://next-chessground.vercel.app](https://next-chessground.vercel.app)

---

## Key Features

* **Strict Move Validation:** Enforces legal moves via `chessops`. The application maintains position state and receives full move payloads: `{ from, to, promotion, uci, san, fen }`.
* **Interactive Controls:** Includes an on-board pawn promotion picker, premove support, and automatic snap-back on illegal moves.
* **Variant Support:** Out-of-the-box support for Standard, Chess960, King of the Hill, and Three-check variants.
* **Customization:** Includes 5 board themes, 5 piece sets, move sound effects, and user preference persistence via `localStorage`. Includes optional on-board settings and flip controls.
* **Unified Component:** Serves live games, analysis, and static board previews through a single component. Exports utility hooks and helpers for custom implementations.
* **Developer Experience:** Ships with TypeScript definitions, ESM support, React 18 & 19 compatibility, and Server-Side Rendering (SSR) support.

---

## Installation

Install the package via your preferred package manager:

```bash
npm i next-chessground
# or
yarn add next-chessground

```

Import the required stylesheets at your application's entry point (e.g., `pages/_app.js` or `app/layout.js`):

```js
import 'next-chessground/styles.css';
import 'next-chessground/pieces.css';

```

---

## Integration Examples

### Standard Board Implementation

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

### Engine Integration

To integrate an engine response, set the user color via `playerColor="white"` and process incoming engine responses with `uciMove`. This function validates the UCI string against the current position state:

```js
import { uciMove } from 'next-chessground';

const reply = uciMove(fen, 'e7e5'); // Returns null if the move is illegal
if (reply) onMove(reply);

```

> **Sizing Note:** The `Chessboard` component expands to fill its parent container. Sizing must be applied to the wrapper element.

---

## API Reference

| Category | Properties / Parameters |
| --- | --- |
| **Position & Rules** | `fen`, `lastMove`, `playerColor` (`"white"`, `"black"`, `"both"`), `variant` (`"standard"`, `"chess960"`, `"kingOfTheHill"`, `"threeCheck"`) |
| **Display & Layout** | `orientation`, `defaultOrientation`, `onOrientationChange`, `coordinates`, `labels`, `className`, `children` |
| **Board Interaction** | `locked`, `viewOnly`, `premove`, `onMove` |
| **Annotations** | `shapes`, `autoShapes`, `onShapesChange` |
| **Configuration** | `controls`, `settings`, `settingsOpen`, `onSettingsOpenChange` |

*Omitting `playerColor` disables move input and sets the board to static mode.*
