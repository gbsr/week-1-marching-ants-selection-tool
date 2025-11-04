import type { SelectionState } from '../state/state';

export default function asserts(where: string, state: SelectionState): void {
  const fail = (ok: boolean, msg: string) => {
    if (!ok) {
      console.error(`ASSERT FAILED @ ${where}: ${msg}`);
      console.log('State snapshot:', structuredClone(state));
      console.trace();
    }
  };

  switch (state.mode) {
    case 'idle':
      fail(!state.startPosition,  'idle: startPosition should be null');
      fail(!state.currentPosition,'idle: currentPosition should be null');
      break;

    case 'select':
      fail(!!state.startPosition, 'select: missing startPosition');
      fail(!!state.currentPosition,'select: missing currentPosition');
      fail(!state.finalSelection, 'select: already has finalSelection');
      break;

    case 'move':
      fail(!!state.finalSelection,'move: missing finalSelection');
      fail(!!state.dragOffset,    'move: missing dragOffset');
      fail(!state.startPosition,  'move: startPosition should be null');
      fail(!state.currentPosition,'move: currentPosition should be null');
      break;
  }
}