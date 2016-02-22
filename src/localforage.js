import { Map as IMap } from 'immutable'
import Promise from 'bluebird'
import { createInstance } from 'localforage'
import { Node, Edge } from './records'

const NAME = 'emma-toolkit';

const stores = {
  app: createInstance({
    name: NAME,
    storeName: 'app'
  }),
  graph: createInstance({
    name: NAME,
    storeName: 'graph'
  })
};

const app_persist = ['show_controls'];

export default {
  set(store, state) {
    stores[store].length()
      .then(n => {
        if (n === 0) {
          setStore(store, state);
        } else {
          stores[store].clear()
            .then(() => setStore(store, state));
        }
      });
  },
  load(state) {
    return loadType('app', state)
      .then(next_state => loadType('graph', next_state));
  }
};

function setStore(store, state) {
  switch (store) {
    case 'app':
      state.get('app').forEach((value, key) => {
        if (app_persist.indexOf(key) > -1) {
          stores[store].setItem(key, value)
        }
      });
      break;
    case 'graph':
      stores.graph.setItem('title', {
        type: 'meta',
        value: state.getIn(['graph', 'title'])
      });
      setElements('nodes', 'environment', state);
      setElements('nodes', 'chain', state);
      setElements('nodes', 'infrastructure', state);
      setElements('edges', 'chain', state);
      setElements('edges', 'infrastructure', state);
      break;
  }
}

function setElements(type, nodetype, state) {
  state.getIn([type, nodetype]).forEach((d, id) => {
    const obj = d.toObject();
    obj.type = type;
    stores.graph.setItem(String(id), obj);
  });
}

function loadType(type, state) {
  const store = stores[type];
  return store.length()
    .then(n => {
      if (n === 0) return state;
      return store.iterate(
        (value, key, i) => {
          let path, new_value;
          switch (type) {
            case 'app':
              path = ['app', key];
              new_value = value;
              break;
            case 'graph':
              if (value.type === 'meta') {
                path = ['graph', key];
                new_value = value.value;
              } else {
                path = [value.type, value.nodetype, key];
                const record = value.type === 'nodes' ? Node : Edge;
                new_value = record(value);
              }
              break;
          }
          state = state.setIn(path, new_value);
          if (i === n) return state;
        }
      )
    });
}