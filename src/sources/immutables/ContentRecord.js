import { Record, List, default as Immutable } from 'immutable';

import { TitleRecord } from './TitleRecord';
import { GridRecord } from './GridRecord';

const ContentRecord = Record({
  title: new TitleRecord(),
  content: new List(),
  grid: new GridRecord(),
  duration: null
});

const ContentSerializer = (key, value) => {
  if(key === 'title')
    return new TitleRecord(value);

  if(key === 'content')
    return Immutable.fromJS(value.map(m => new Map(m)), List);

  if(key === 'grid')
    return new GridRecord(value);

  return value;
};

export { ContentRecord };
