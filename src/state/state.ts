import type { Point } from "../interface/point"
import type { Rect } from "../interface/rect"
import type { Handle } from "../interface/handle"

export interface SelectionState {
  mode: 'idle' | 'select' | 'move' | 'resize';
  startPosition: Point | null;
  currentPosition: Point | null;
  endPosition: Point | null;
  finalSelection: Rect | null;
  dragOffset: { x: number; y: number } | null;
  resizeHandle: Handle | null;
  hoverHandle: Handle | null;
  isShiftPressed: boolean;
}

export const state: SelectionState = {
  mode: 'idle',
  startPosition: null,
  currentPosition: null,
  endPosition: null,
  finalSelection: null,
  dragOffset: null,
  resizeHandle: null,
  hoverHandle: null,
  isShiftPressed: false,
};