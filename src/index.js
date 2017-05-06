import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';

import App from './App';

if (!Cookies.get('github-access-token')) {
  window.location.href = '/auth/github';
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
