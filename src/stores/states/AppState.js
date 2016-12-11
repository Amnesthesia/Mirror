import { Record, Stack } from 'immutable';

import { ContentRecord } from '../../sources/immutables/ContentRecord';

export const AppState = new Record({
  currentState: new ContentRecord(),
  history: new Stack()
});
