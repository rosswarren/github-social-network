import React from 'react';

import { getData, calculateResults } from './data/data';
import Graph from './graph';
import Controls from './controls';
import Menu from './menu';

import './graph-view.css';

export default class GraphView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 12,
      users: [],
      reviews: [],
    };
  }

  componentDidMount() {
    getData({
      user: 'sky-uk',
      repository: 'atlas-web-and-tv'
    }, this.state.limit).then(calculateResults).then(result => this.setState({
      users: result.users,
      reviews: result.reviews
    }));
  }

  updateLimit() {
    return (limit) => {
      this.setState({
        limit: limit / 30
      });
    };
  }

  render() {
    return (
      <div className="graph-view">
        <Menu />
        <Controls
          updateLimit={this.updateLimit()}
          limit={this.state.limit * 30}
        />
        <Graph
          limit={this.state.limit}
          users={this.state.users}
          reviews={this.state.reviews}
        />
      </div>
    );
  }
}
