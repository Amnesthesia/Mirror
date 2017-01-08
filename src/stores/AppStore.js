import { ReduceStore } from 'flux/utils';
import { List, Map } from 'immutable';
import { ActionTypes } from '../actions/RefreshActions';
import { AppState } from './states/AppState';
import { ContentRecord } from '../sources/immutables/ContentRecord';
import { GridRecord } from '../sources/immutables/GridRecord';

class AppStore extends ReduceStore {

  getInitialState(){
    let state = new AppState({
      currentState: new ContentRecord({
        grid: new GridRecord({ x: 3, y: 4 }),
        content: new List([
          new Map({
            title: 'Test',
            components: new List([
              {
                class: 'Calendar',
                parameters: {
                  headerFontSize: '55px',
                  bodyFontSize: '200px'
                }
              }
            ]),
            placement: new List([0, 5])
          }),

          new Map({
            title: 'Weather',
            components: new List([
              {
                class: 'Weather',
                parameters: {
                  latitude: 59.9160732,
                  longitude: 10.7715068,
                  name: 'Oslo'
                }
              }
            ]),
            placement: new List([2,3])
          })
        ])
      })
    });

    console.log(JSON.stringify(state.toJS()));
    return state;
  }

  /**
   * {
   *  type: 'UPDATE_TITLE',
   *  value: 'New text'
   * }
   * @param state
   * @param action
   * @returns {*}
   */
  reduce(state, action){

    console.log(state.toJS());
    switch(action.type){
      case ActionTypes.REPLACE_STATE:
        console.log(action.value);
        console.log(action.value.toJS());
        let _state = state.set('history', state.get('history').push(state));
        return state.set('currentState', action.value);
    }

    return state;
  }
}

export { AppStore };
export default AppStore;
