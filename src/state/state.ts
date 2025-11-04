import type { Point } from "../interface/point"
import type { Rect } from "../interface/rect"

export interface SelectionState {
  mode: 'idle' | 'select' | 'move' | 'resize';
  startPosition: Point | null;
  currentPosition: Point | null;
  endPosition: Point | null;
  finalSelection: Rect | null;
  dragOffset: { x: number; y: number } | null
}

export const state: SelectionState = {
  mode: 'idle',
  startPosition: null,
  currentPosition: null,
  endPosition: null,
  finalSelection: null,
  dragOffset: null,
};