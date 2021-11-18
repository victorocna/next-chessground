# Next Chessground

Next gen wrapper for Chessground packed with features and pawn promotion logic out of the box.

Built by chess players in React and Next.js

## Live Demo

[https://next-chessground.vercel.app](https://next-chessground.vercel.app)

## Features

- legal chess moves only with built in support from `chess.js`
- pawn promotion logic
- custom chess board, chess pieces, move sounds and other chess settings
- flip and resize the chess board

## Installation

```bash
npm i next-chessground
# or
yarn add next-chessground
```

## Usage

```js
import NextChessground from 'next-chessground';

const App = () => {
  return (
    <div className="bg-white rounded shadow">
      <NextChessground />
    </div>
  );
};

export default App;
```
