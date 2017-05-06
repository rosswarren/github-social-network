import React from 'react';
import { Link } from 'react-router-dom';

export default function Menu() {
  return (
    <nav className="nav menu">
      <div className="nav-left">
        <Link
          className="nav-item"
          to={{
            pathname: '/'
          }}
        >
          Github Social Network
        </Link>
      </div>

      <div className="nav-center">
        <a className="nav-item" href="https://github.com/rosswarren/github-social-network">
          <span className="icon">
            <i className="fa fa-github" />
          </span>
        </a>
      </div>
    </nav>
  );
}
