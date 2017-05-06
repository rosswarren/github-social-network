import React from 'react';
import PropTypes from 'prop-types';

import { getData, calculateResults } from '../data/data';
import Menu from '../menu';
import debounce from '../utils/debounce';

import Graph from './graph';
import Controls from './controls';

export default class GraphView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 3,
      data: null,
      calculatedData: null,
      stateFilters: {
        approvals: true,
        requestedChanges: true,
        comments: true
      }
    };

    this.updateResults = debounce(() => {
      this.setState({
        calculatedData: calculateResults(this.state.data, this.state.stateFilters)
      });
    }, 500);

    this.updateData = debounce(() => {
      getData({
        user: this.props.match.params.user,
        repository: this.props.match.params.repository
      }, this.state.limit)
      .then((data) => {
        this.setState({
          data
        }, () => {
          this.updateResults();
        });
      });
    }, 500);
  }

  componentDidMount() {
    this.updateData();
  }

  updateLimit() {
    return (limit) => {
      this.setState({
        limit: limit / 30,
        data: null,
        calculatedData: null
      }, () => {
        this.updateData();
      });
    };
  }

  updateStateFilters() {
    return (newStateFilters) => {
      this.setState({
        stateFilters: {
          ...this.state.stateFilters,
          ...newStateFilters
        },
        calculatedData: null
      }, () => {
        this.updateResults();
      });
    };
  }

  render() {
    return (
      <div>
        <Menu />
        <Controls
          updateLimit={this.updateLimit()}
          limit={this.state.limit * 30}
          stateFilters={this.state.stateFilters}
          updateStateFilters={this.updateStateFilters()}
        />
        {
          this.state.calculatedData ? (
            <Graph
              limit={this.state.limit}
              users={this.state.calculatedData.users}
              reviews={this.state.calculatedData.reviews}
            />
          ) : <div>Loading</div>
        }

      </div>
    );
  }
}

GraphView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.string.isRequired,
      repository: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
