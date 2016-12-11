require('styles/App.css');

import { default as React } from 'react';
import { Container } from 'flux/utils';
import { AppStore } from '../stores/AppStore';
import { Dispatcher } from '../dispatcher/Dispatcher';

import { Grid } from './Grid/Grid';
import { List } from 'immutable';

import { Calendar } from './widgets/Calendar';

const Store = new AppStore(Dispatcher);

class AppComponent extends React.Component {

  static getStores(){
    return [ Store ];
  }

  static calculateState(){
    return {
      store: Store.getState()
    }
  }

  render() {
    return (
      <Grid
        columns={4}
        rows={4}
        components={
          this.state.store.currentState.get('content')
        }
      />
    );
  }
}

AppComponent.defaultProps = {
};


export default Container.create(AppComponent);
