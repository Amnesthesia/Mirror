import { Dispatcher } from '../dispatcher/Dispatcher';
import { default as Immutable } from 'immutable';
import { ContentSerializer } from '../sources/immutables/ContentRecord';
import { ActionRecord } from '../sources/immutables/ActionRecord';
import { default as keyMirror } from 'keymirror';

export const ActionTypes = keyMirror({
  REPLACE_STATE: null
});

/**
 ** Actions triggered when receiving a message from RabbitMQ
 **/

class RefreshActions {

  /**
   * Replaces the state in AppStore causing new widgets to load
   *
   * @param newState
   * @constructor
   */
  static StateFromJSON(newState){
    Dispatcher.dispatch(new ActionRecord({
      type: ActionTypes.REPLACE_STATE,
      value: RefreshActions.SerializeJSON(JSON.parse(newState))
    }));
  }

  /**
   * Merges the current state with a received JSON state
   */
  static MergeStateFromJSON(newStateJSON){

  }

  /**
   * Turns JSON received into an application state using Immutable Records
   *
   * @param json
   * @constructor
   */
  static SerializeJSON(json){
    return Immutable.fromJS(json, ContentSerializer);
  }
}

export { RefreshActions };
