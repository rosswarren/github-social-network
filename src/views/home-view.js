import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import Menu from '../menu';

class HomeView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repository: ''
    };
  }


  onSubmit() {
    return (event) => {
      event.preventDefault();

      if (this.validateRepository()) {
        this.props.history.push({
          pathname: `/gh/${this.state.repository}`
        });
      }
    };
  }

  validateRepository() {
    return this.state.repository.match(/[^/\s]+\/[^/\s]+/);
  }

  render() {
    return (
      <div>
        <Menu />

        <section className="hero is-dark">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Github Social Network</h1>
              <h2 className="subtitle">
                Analyse your Github social interactions
              </h2>
            </div>
          </div>
        </section>

        {
          Cookies.get('github-access-token') ? (
            <section className="section">
              <div className="container">
                <div className="content">
                  <p>
                    Enter a repository in the format user/repository
                    or click one of the examples below
                  </p>
                </div>
                <form onSubmit={this.onSubmit()}>
                  <div className="field has-addons has-addons-centered">
                    <p className="control">
                      <input
                        id="repository"
                        className="input"
                        type="text"
                        placeholder="user/repository"
                        onChange={event => this.setState({
                          repository: event.target.value
                        })}
                      />
                    </p>
                    <p className="control">
                      <input type="submit" className="button is-primary" value="Go" />
                    </p>
                  </div>
                </form>
                <ul>
                  <li><Link to={'/gh/facebook/react'}>facebook/react</Link></li>
                  <li><Link to={'/gh/babel/babel'}>babel/babel</Link></li>
                </ul>
              </div>
            </section>
          ) : (
            <section className="section">
              <div className="container">
                <div className="content">
                  <p>
                    Welcome to Github Social Network.
                    This is a tool designed to help you analyse the interactions
                    around pull requests on Github repositories.
                  </p>

                  <p>
                    To begin, you will need to authenticate with Github so that your
                    browser can access your public and private repositories.
                  </p>

                  <p>
                    <a
                      className="button is-primary"
                      href="/auth/github"
                    >
                      Authenticate with Github
                    </a>
                  </p>
                </div>
              </div>
            </section>
          )
        }
      </div>
    );
  }
}

HomeView.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(HomeView);
