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
