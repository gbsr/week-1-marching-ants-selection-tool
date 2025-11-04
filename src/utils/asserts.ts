import type { SelectionState } from '../state/state';

export default function asserts(state: SelectionState) {

  switch (state.mode) {

    case 'idle':
      // selection may exist
      console.assert(!state.startPosition, 'idle: startPosition should be null');
      console.assert(!state.currentPosition, 'idle: currentPosition should be null');
      break;

    case 'select':
      // dragging new selection
      console.assert(Boolean(state.startPosition), 'select: missing startPosition');
      console.assert(Boolean(state.currentPosition), 'select: missing currentPosition');

      // finalSelection should not exist yet, still dragging
      console.assert(!state.finalSelection, 'select: already has finalSelection');
      break;

    case 'move':
      // dragging existing selection
      console.assert(Boolean(state.finalSelection), 'move: missing finalSelection');
      console.assert(Boolean(state.dragOffset), 'move: missing dragOffset');

      // start/currentPosition should not be used in move mode
      console.assert(!state.startPosition, 'move: startPosition should be null');
      console.assert(!state.currentPosition, 'move: currentPosition should be null');
      break;
  }
}