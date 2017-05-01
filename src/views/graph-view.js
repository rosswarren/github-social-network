import React from 'react';

import { getData, calculateResults } from '../data/data';
import Menu from '../menu';
import debounce from '../utils/debounce';

import Graph from './graph';
import Controls from './controls';

import './graph-view.css';

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
      },
      repositoryInfo: {
        user: 'sky-uk',
        repository: 'atlas-web-and-tv'
      }
    };

    this.updateResults = debounce(() => {
      this.setState({
        calculatedData: calculateResults(this.state.data, this.state.stateFilters)
      });
    }, 500);

    this.updateData = debounce(() => {
      getData(this.state.repositoryInfo, this.state.limit)
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

  updateRepositoryInfo() {
    return (repositoryInfo) => {
      this.setState({
        repositoryInfo,
        data: null,
        calculatedData: null
      }, () => {
        this.updateData();
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
          stateFilters={this.state.stateFilters}
          updateStateFilters={this.updateStateFilters()}
          repositoryInfo={this.state.repositoryInfo}
          updateRepositoryInfo={this.updateRepositoryInfo()}
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
