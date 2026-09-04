import { createContext, useContext } from 'react';
import type { Color } from '../board/types';

export const BoardContext = createContext<{ orientation: Color }>({ orientation: 'white' });

/** Orientation of the enclosing Board, for overlays that place things on squares. */
export const useBoardOrientation = (): Color => useContext(BoardContext).orientation;
