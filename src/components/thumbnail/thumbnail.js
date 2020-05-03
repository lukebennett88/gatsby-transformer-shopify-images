import PropTypes from 'prop-types';
import React from 'react';

import { resizeShopifyImage } from '../../utilities';

export const Thumbnail = ({ src, onClick }) => {
  const imgSrc = resizeShopifyImage({ url: src.originalSrc, width: 160 });
  return (
    <button onClick={onClick} type="button">
      <img src={imgSrc} alt="" className="overflow-hidden rounded-md shadow" />
    </button>
  );
};

Thumbnail.propTypes = {
  onClick: PropTypes.func,
  src: PropTypes.object,
};
