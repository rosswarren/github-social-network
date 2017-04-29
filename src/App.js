import React, { Component } from 'react';
import vis from 'vis';
import getPullRequests from './data';

import './App.css';

function renderVis(element, nodes, edges) {
  return new vis.Network(
    element,
    {
      nodes,
      edges
    },
    {
      autoResize: true,
      height: '100%',
      width: '100%',
      nodes: {
        shape: 'dot',
        scaling: {
          customScalingFunction(min, max, total, value) {
            return value / total;
          },
          min: 5,
          max: 150
        }
      }
    }
  );
}

// df11df6ca1d562568a5127cae0c8182b4a48ed88

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      reviews: []
    };
  }

  componentDidMount() {
    getPullRequests({
      user: 'sky-uk',
      repo: 'atlas-web-and-tv'
    }).then(result => this.setState({
      users: result.users,
      reviews: result.reviews
    }));
  }

  componentDidUpdate() {
    renderVis(
      this.container,
      this.state.users.map(user => ({ id: user, value: '1', label: user })),
      this.state.reviews
    );
  }

  render() {
    return (
      <div className="App">
        <div className="graph" ref={(node => this.container = node)} />
      </div>
    );
  }
}

export default App;
