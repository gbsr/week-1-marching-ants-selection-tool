import type { Point } from "../interface/point"
import normalizeRect from "../utils/normalizeRect"
import type { SelectionState } from "../state/state"

export default function finalizeSelect(state: SelectionState, mouse: Point) {

  state.currentPosition = mouse;
  if (state.startPosition && state.currentPosition) {
    state.finalSelection = normalizeRect(state.startPosition, state.currentPosition);
  }

  // transition state machine, then clean up
  state.mode = 'idle';
  state.startPosition = null;
  state.endPosition = null;

}