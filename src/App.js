import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import HomeView from './views/home-view';
import GraphView from './views/graph-view';

import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={HomeView} />
        <Route exact path="/gh/:user/:repository" component={GraphView} />
      </div>
    </Router>
  );
}
