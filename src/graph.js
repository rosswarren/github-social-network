import React, { Component } from 'react';
import PropTypes from 'prop-types';
import vis from 'vis';

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
  componentDidUpdate() {
    renderVis(
      this.container,
      this.props.users.map(user => ({ id: user.name, value: user.value, label: user.name })),
      this.props.reviews.map(review => ({ ...review, arrows: { to: { scaleFactor: 0.5 } } }))
    );
  }

  render() {
    return (
      <div className="graph" ref={(node => this.container = node)} />
    );
  }
}

Graph.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired
};
