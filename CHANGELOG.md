# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/).

## [2.0.0] - Unreleased

Complete rewrite as a controlled, declarative board on chessground 10 and chessops. The app owns
the position and receives validated moves; the board no longer keeps game state of its own.

### Breaking changes

- `NextChessground` is now `Chessboard` (default and named export). There is no `NextChessground` alias.
- Stylesheets are no longer injected on import. Import `next-chessground/styles.css` and
  `next-chessground/pieces.css` once, at the app entry point.
- The ref API is gone (`board`, `chess`, `undo`, `move`, `playPremove`, `cancelPremove`). Apply
  moves through data instead: `userMove(fen, from, to)` or `uciMove(fen, uci)` return a `Move`
  to hand to `onMove`; undo by setting a previous `fen`.
- `onMove` receives a `Move` object `{ from, to, promotion, uci, san, fen }` instead of a chess.js
  instance. `onFenChange`, `setPromoting`, `reset` and `skipValidation` are removed: read
  `move.fen` and control the position from state.
- `readOnly` is split into `viewOnly` (a static picture) and `locked` (an interactive board with
  input switched off). `premoves` is now `premove`. The `editing` and `check` overrides are
  removed; check is computed from the position.
- The built-in chrome (flip button, settings gear, settings modal, footer) is no longer part of
  the package. Build it in the app with `useBoardPrefs`, `BOARDS`, `PIECES` and `SOUNDS`, and
  pass it as `children`. Orientation is an app-controlled `orientation` prop.
- Removed exports: `NextEditor` and the editor UI (spare pieces, FEN options), `Stockfish`,
  `useChess`, `useChessground` (theme context), `constants`. `INITIAL_FEN` and `EMPTY_FEN` replace
  `constants.initialFen` and `constants.emptyFen`.
- Removed dependencies: `chess.js`, `react-pure-modal`, `lodash-es`, `merge-class-names`, `store2`.
  Added: `@lichess-org/chessground` ^10, `chessops` ^0.15.
- ESM only. Node 20 or newer. React 18 or 19 as peer dependencies.
- Preferences are stored under the `localStorage` key `next-chessground`. Values from 1.x are not
  migrated; unknown or stale values fall back to the defaults.
- Tailwind utility classes are gone from the markup. The public class names are
  `next-chessground`, `next-chessground-board`, `next-chessground-promotion*`, `board-<id>`,
  `pieces-<id>` and `highlight`.

### Added

- Rules engine on chessops: legal moves only; variants `standard`, `chess960`, `kingOfTheHill`
  and `threeCheck`; castling accepted as king-two-squares or king-onto-rook; two FEN validity
  levels (`isDisplayableFen`, `isValidFen`); terminal positions lock the board.
- Promotion picker drawn over the board on the promotion file, with Escape and backdrop cancel,
  a `labels` prop for translations and auto-queen on premove.
- Premoves that survive unrelated re-syncs of the board.
- Drawn arrows end on the square where the pointer is released (`shapes`, `autoShapes`,
  `onShapesChange`).
- Shared, validated preference store (`useBoardPrefs`, `readPrefs`, `writePrefs`,
  `subscribePrefs`) persisted in `localStorage`; move sounds (`useMoveSound`, `useBoardSound`,
  `playSound`, `SILENT`).
- Lower-level building blocks: `Board` (controlled board without rules), `Promotion`,
  `useChessboard`, `useBoardOrientation`, and the pure helpers `userMove`, `uciMove`, `toDests`,
  `boardState`, `isPromotion`, `promotionSquares`, `turnColorOf`.
- CSS custom properties for theming (`--board-*`, `--coord-*`, `--promotion-*`, `--piece-*`),
  documented in the README. The 1.x `--promotion-choice-bg` and `--promotion-choice-hover-bg`
  are still honored.
- TypeScript declarations shipped with the package (`Move`, `Prefs`, `BoardId`, `PieceSetId`,
  `SoundId`, `Variant`, `PlayerColor` and more) (#7).
- Build: ESM bundle via tsdown; `scripts/build-css.mjs` assembles `dist/styles.css` and inlines
  the board images from `assets/boards/`; `scripts/build-clips.mjs` generates the sound clips
  from `sounds/*.ogg`.
- vitest suite and GitHub Actions CI on Node 22 with React 18 and 19.

### Migrating from 1.x

| 1.x                                              | 2.0                                                                                      |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `import NextChessground from 'next-chessground'` | `import { Chessboard } from 'next-chessground'` (the default export also works)          |
| Styles injected on import                        | `import 'next-chessground/styles.css'` and `import 'next-chessground/pieces.css'`        |
| `onMove={(chess) => ...}`                        | `onMove={(move) => setFen(move.fen)}`                                                    |
| `ref.current.move(from, to)`                     | `const move = userMove(fen, from, to); if (move) onMove(move);`                          |
| `ref.current.undo()`                             | Keep a history in state and set the previous `fen`                                       |
| `ref.current.chess`                              | Derive from `fen` with `toDests`, `boardState`, `turnColorOf`, or your own chess library |
| `readOnly`                                       | `viewOnly` for a picture, `locked` for an interactive board with input off               |
| `premoves`                                       | `premove`                                                                                |
| Built-in flip button                             | `orientation` prop plus your own button passed as `children`                             |
| Settings modal                                   | `useBoardPrefs` with `BOARDS`, `PIECES`, `SOUNDS` in your own UI                         |
| `Stockfish`                                      | Removed. Drive your engine and apply replies with `uciMove(fen, uci)`                    |
| `NextEditor`                                     | Removed                                                                                  |
| `useChess`                                       | `useChessboard` (different API) or plain app state                                       |
| `constants.initialFen`, `constants.emptyFen`     | `INITIAL_FEN`, `EMPTY_FEN`                                                               |
| `isValidFen(fen)`                                | `isValidFen(fen, variant?)`, unchanged for standard chess                                |

## [1.5.2] and earlier

Not tracked in this file. See the git history.
