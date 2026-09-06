# next-chessground examples

A small Next.js (pages router) app that exercises the 2.0 board. One page per demo: a sidebar lists
them all, and each page puts the board and the code that draws it on one row inside a single card.

Every page is one `<Demo>` — `components/Demo.jsx` renders the shell, the title, the description,
the board column (children, plus whatever `controls` it is given) and the code column:

```jsx
<Demo title="Basic example" description="One sentence." code={sample} controls={<BoardControls … />}>
  <Chessboard … />
</Demo>
```

Styling is one local stylesheet, `css/site.css`: CSS variables on `:root`, classes prefixed `site-`
(the shell) and `demo-` (the template and the board chrome). No CSS framework. The package's own
`styles.css` and `pieces.css` and the highlight.js theme are imported from `node_modules` in
`pages/_app.js`; the icons are Font Awesome 5 from the CDN link listed in `site.config.js`, rendered
by `AppHead` as in the 1.x demo.

| Page      | What it shows                                                                       |
| --------- | ----------------------------------------------------------------------------------- |
| `/`       | The basic board, plus the demo's own flip button and settings panel.                |
| `/rook`   | A rook endgame as a custom `fen` start position.                                    |
| `/queen`  | A queen endgame, black to move.                                                     |
| `/pawn`   | Pawn promotion: push c7-c8 and the board asks which piece to promote to.            |
| `/shapes` | `viewOnly` board with the circles a PGN comment carries, parsed by `chess-moments`. |
| `/play`   | Play white against Stockfish; premoves are on by default.                           |
| `/watch`  | Nobody may move: Stockfish plays both sides.                                        |
| `/undo`   | The app keeps the positions it visited and sets an earlier `fen` to undo.           |

## Chrome is the app's

The package draws the board and nothing else. `components/BoardControls.jsx` (flip and settings
buttons) and `components/BoardSettings.jsx` (the preferences dialog) are demo components: the panel
is passed as a child of `<Chessboard>` so it covers the board, and it reads and writes the shared
preferences through the package's `useBoardPrefs()`, over the `BOARDS`, `PIECES` and `SOUNDS` lists
and `playSound()`. Orientation is a plain `orientation` prop the page owns.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` produces a production build in `out/`, and
`npm start` serves it on port 8080.

## How the package is installed

The demo installs `next-chessground` from the tarball built in the repository root, so it exercises
exactly what `npm pack` would publish:

```json
"next-chessground": "file:../next-chessground-2.0.0.tgz"
```

Build the tarball with `npm pack` in the repository root (its `prepack` runs the build) whenever the
package changes, then `npm install` here again. A `file:..` symlink would give the demo a second copy
of React and break hooks, so the tarball is deliberate.

Once 2.0 is published, switch the dependency to the registry version and reinstall:

```bash
npm pkg set dependencies.next-chessground=^2.0.0
npm install
```

React stays on 18.3 here on purpose: the package declares `react` `^18 || ^19` as a peer and this app
is the check that 18 still works.

## Stockfish

`/play` and `/watch` drive the asm.js Stockfish build in `public/stockfish.asm.js` over a Web Worker.
`lib/stockfish.js` is a small UCI client (`init`, `set_position`, `go_time`, `quit`) and
`lib/engine-move.js` turns `bestmove e2e4 ponder e7e5` into the UCI string the board takes. The engine
is demo code: it is not part of next-chessground 2.0.

The worker URL comes from `STOCKFISH_PATH`, exposed through `next.config.js` and defaulting to
`/stockfish.asm.js`. Point it somewhere else to try another build:

```bash
STOCKFISH_PATH=/my-stockfish.js npm run dev
```

## The chess.js override

`package.json` pins `chess.js` through `overrides`:

```json
"overrides": {
  "chess.js": "github:brobert1/chess.js#e7d0b75a366fcc0b0fbea4520dec8960983b8ea1"
}
```

`chess-moments` (used only by `/shapes`) depends on `github:brobert1/chess.js#master`, and that
branch has since dropped `getGlyph()`. Without the override the parser throws, `flat()` returns an
empty array and `/shapes` has nothing to render. Drop the override once `chess-moments` ships against
a working chess.js.

`lodash` is in `dependencies` for the same reason: `chess-moments/functions/parser.js` requires it
without declaring it, so the build fails to resolve it unless this app installs it. It is not used by
any demo code — drop it once `chess-moments` declares its own.
