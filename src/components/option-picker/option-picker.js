import PropTypes from 'prop-types';
import React from 'react';

export const OptionPicker = ({ name, options, onChange, selected }) => {
  if (options.length < 2) return null;
  return (
    <div>
      <label htmlFor={name.toLowerCase()}>
        <div>{name}</div>
        <select
          onChange={onChange}
          value={selected}
          id={name.toLowerCase()}
          className="form-select"
        >
          {options.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

OptionPicker.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.any,
  selected: PropTypes.any,
};
