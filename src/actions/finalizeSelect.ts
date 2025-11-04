import type { Point } from "../interface/point"
import normalizeRect from "../utils/normalizeRect"
import type { SelectionState } from "../state/state"

export default function finalizeSelect(state: SelectionState, mouse: Point) {
  if (!state.startPosition) return;

  state.currentPosition = mouse;
  if (state.startPosition && state.currentPosition) {
    state.finalSelection = normalizeRect(state.startPosition, state.currentPosition);
  }

  // transition state machine, then clean up
  state.startPosition = null;
  state.currentPosition = null;
  state.endPosition = null;
  state.mode = 'idle';

}