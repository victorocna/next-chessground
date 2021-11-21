import dynamic from 'next/dynamic';

const NextChessground = dynamic(() => import('next-chessground'), {
  ssr: false,
});

export default NextChessground;
