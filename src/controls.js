import React from 'react';
import PropTypes from 'prop-types';

import './controls.css';

function splitRepo(repo) {
  const parts = repo.split('/');

  return {
    user: parts[0],
    repository: parts[1]
  };
}

export default function Controls(props) {
  return (
    <form className="controls">
      <label htmlFor="repo">
        <span>Repo</span>
        <input
          id="repo"
          value={`${props.repositoryInfo.user}/${props.repositoryInfo.repository}`}
          onChange={event => props.updateRepositoryInfo(splitRepo(event.target.value))}
        />
      </label>
      <label htmlFor="limit">
        Number of Pull Requests
        <input
          id="limit"
          type="range"
          min={30}
          max={360}
          step={30}
          value={props.limit}
          onChange={event => props.updateLimit(event.target.value)}
        />
        <span>{props.limit}</span>
      </label>
      <label htmlFor="approvals">
        <span>Approvals</span>
        <input
          id="approvals"
          type="checkbox"
          checked={props.stateFilters.approvals}
          onChange={event => props.updateStateFilters({ approvals: event.target.checked })}
        />
      </label>
      <label htmlFor="requested-changes">
        <span>Requested Changes</span>
        <input
          id="requested-changes"
          type="checkbox"
          checked={props.stateFilters.requestedChanges}
          onChange={event => props.updateStateFilters({ requestedChanges: event.target.checked })}
        />
      </label>
      <label htmlFor="comments">
        <span>Comments</span>
        <input
          id="comments"
          type="checkbox"
          checked={props.stateFilters.comments}
          onChange={event => props.updateStateFilters({ comments: event.target.checked })}
        />
      </label>
    </form>
  );
}

Controls.propTypes = {
  limit: PropTypes.number.isRequired,
  updateLimit: PropTypes.func.isRequired,
  updateStateFilters: PropTypes.func.isRequired,
  stateFilters: PropTypes.shape({
    approvals: PropTypes.bool.isRequired,
    requestedChanges: PropTypes.bool.isRequired,
    comments: PropTypes.bool.isRequired
  }).isRequired,
  repositoryInfo: PropTypes.shape({
    user: PropTypes.string.isRequired,
    repository: PropTypes.string.isRequired
  }).isRequired,
  updateRepositoryInfo: PropTypes.func.isRequired
};
