import React from 'react';
import PropTypes from 'prop-types';

export default function Controls(props) {
  return (
    <form>
      <div className="field is-grouped">
        <div className="control">
          <label className="label" htmlFor="limit">
            Last
            {' '}<span>{props.limit}</span>{' '}
            pull requests
          </label>
        </div>
        <div className="control">
          <input
            id="limit"
            type="range"
            min={30}
            max={360}
            step={30}
            value={props.limit}
            onChange={event => props.updateLimit(event.target.value)}
          />
        </div>
        <div className="control">
          <label htmlFor="approvals">Approvals</label>
        </div>
        <div className="control">
          <input
            className="checkbox"
            id="approvals"
            type="checkbox"
            checked={props.stateFilters.approvals}
            onChange={event => props.updateStateFilters({ approvals: event.target.checked })}
          />
        </div>
        <div className="control">
          <label htmlFor="requested-changes">Requested Changes</label>
        </div>
        <div className="control">
          <input
            className="checkbox"
            id="requested-changes"
            type="checkbox"
            checked={props.stateFilters.requestedChanges}
            onChange={event => props.updateStateFilters({ requestedChanges: event.target.checked })}
          />
        </div>
        <div className="control">
          <label htmlFor="comments">Comments</label>
        </div>
        <div className="control">
          <input
            className="checkbox"
            id="comments"
            type="checkbox"
            checked={props.stateFilters.comments}
            onChange={event => props.updateStateFilters({ comments: event.target.checked })}
          />
        </div>
      </div>
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
  }).isRequired
};
