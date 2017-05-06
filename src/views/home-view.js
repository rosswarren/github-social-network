import React from 'react';
import { Link } from 'react-router-dom';

import Menu from '../menu';

export default class HomeView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repository: ''
    };
  }

  validateRepository() {
    return this.state.repository.match(/[^/\s]+\/[^/\s]+/);
  }

  render() {
    return (
      <div className="home-view">
        <Menu />
        <h1>Github Social Network</h1>
        <p>Enter a repository in the format user/repository or click one of the examples below</p>
        <input
          onChange={event => this.setState({
            repository: event.target.value
          })}
        />
        {
          this.validateRepository() && (
            <Link to={`/graph/${this.state.repository}`}>Go</Link>
          )
        }
        <ul>
          <li><Link to={'/graph/facebook/react'}>facebook/react</Link></li>
          <li><Link to={'/graph/babel/babel'}>babel/babel</Link></li>
        </ul>
      </div>
    );
  }
}
