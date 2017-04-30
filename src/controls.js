import React from 'react';
import PropTypes from 'prop-types';

import './controls.css';

export default function Controls(props) {
  return (
    <form className="controls">
      <label htmlFor="limit">
        <span>{props.limit}</span>
        <input
          id="limit"
          type="range"
          min={30}
          max={360}
          step={30}
          value={props.limit}
          onChange={event => props.updateLimit(event.target.value)}
        />
      </label>
      <label htmlFor="approvals">
        <span>Approvals</span>
        <input
          id="approvals"
          type="checkbox"
        />
      </label>
      <label htmlFor="requested-changes">
        <span>Requested Changes</span>
        <input
          id="requested-changes"
          type="checkbox"
        />
      </label>
      <label htmlFor="comments">
        <span>Comments</span>
        <input
          id="comments"
          type="checkbox"
        />
      </label>
    </form>
  );
}

Controls.propTypes = {
  limit: PropTypes.number.isRequired,
  updateLimit: PropTypes.func.isRequired
};
