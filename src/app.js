import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/root.jsx'
import store from './store'
import offline_plugin from 'offline-plugin/runtime'

if (process.env.NODE_ENV === 'production') {
  offline_plugin.install();
}

document.addEventListener('DOMContentLoaded', () => {
  // Append wrapper.
  const div = document.createElement('DIV');
  document.body.appendChild(div);

  // Render app.
  const root = React.createElement(Root, {store: store});
  ReactDOM.render(root, div);
});