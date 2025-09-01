import { NextChessground } from 'next-chessground';
import MoveModal from './MoveModal';
import PgnTree from './PgnTree';
import usePgnViewer from './use-pgn-viewer';
import useShapes from './use-shapes';

const PgnViewerLayout = ({ pgn }) => {
  const {
    tree,
    current,
    variations,
    goToMoment,
    onVariationChoice,
    onVariationsCancel,
  } = usePgnViewer(pgn);
  const { shapes, refocusModal } = useShapes({ current });

  return (
    <>
      <div className="relative w-full">
        <NextChessground fen={current.fen} shapes={shapes} viewOnly={true} />
      </div>
      <div className="relative overflow-hidden">
        <div className="overflow-y-auto rounded">
          <PgnTree tree={tree} current={current} onMoveClick={goToMoment} />
        </div>
        {variations && (
          <div
            className="absolute top-0 left-0 w-full h-full bg-black/50
          backdrop-blur-sm flex items-center justify-center z-50"
          >
            <MoveModal
              variations={variations}
              onChoice={onVariationChoice}
              onCancel={onVariationsCancel}
              onFocusChange={refocusModal}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PgnViewerLayout;
