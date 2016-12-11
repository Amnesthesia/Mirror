import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { RefreshActions } from './actions/RefreshActions';
import App from './components/Main';

const Stomp = require('stompjs');
const SockJS = require('sockjs-client');

var ws = new WebSocket('ws://127.0.0.1:15674/ws');
var client = Stomp.over(ws);

client.heartbeat.outgoing = 0;
client.heartbeat.incoming = 0;

var onDebug = function(m) {
  console.log('DEBUG', m);
};

var onConnect = function() {
  client.subscribe('/exchange/mirror/test', function(d) {
    console.log('RECEIVED MESSAGE', d);
    RefreshActions.StateFromJSON(d.body);

  });
};

var onError = function(e) {
  console.log('ERROR', e);
};

client.debug = onDebug;
client.connect('guest', 'guest', onConnect, onError, '/');


// Render the main component into the dom
ReactDOM.render(<App />, document.getElementById('app'));
