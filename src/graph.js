import React, { Component } from 'react';
import vis from 'vis';

import getPullRequests from './data/data';

import './graph.css';

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

export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      reviews: [],
      limit: 12
    };
  }

  componentDidMount() {
    getPullRequests({
      user: 'sky-uk',
      repository: 'atlas-web-and-tv'
    }, this.state.limit).then(result => this.setState({
      users: result.users,
      reviews: result.reviews
    }));
  }

  componentDidUpdate() {
    renderVis(
      this.container,
      this.state.users.map(user => ({ id: user, value: '1', label: user })),
      this.state.reviews.map(review => ({ ...review, arrows: { to: { scaleFactor: 0.5 } } }))
    );
  }

  render() {
    return (
      <div className="graph" ref={(node => this.container = node)} />
    );
  }
}
