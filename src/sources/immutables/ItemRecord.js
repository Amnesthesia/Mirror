import { Record, List } from 'immutable';

const ItemRecord = Record({
  components: new List(), // Component / Module name to load
  placement: new List(),  // Which grid items it should take up ([1,2], [1], [1,2,3])
  parameters: {}          // Parameters to ...spread on the component
});

export { ItemRecord };
