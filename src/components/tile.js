import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import { useGraphQL } from '../hooks';
import { resizeShopifyImage } from '../utilities';

export function Tile({ title, slug, price, image }) {
  const { placeholderImage } = useGraphQL();

  const imageSrc =
    resizeShopifyImage({ url: image, width: 600 }) ||
    placeholderImage.childImageSharp.fluid.src;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
      <div className="flex-shrink-0">
        <img src={imageSrc} className="w-full h-64" alt="" />
      </div>
      <div className="flex flex-col justify-between flex-1 p-6 bg-white">
        <div className="flex-1">
          <h2 className="mt-2 text-xl font-semibold leading-7 text-gray-900">
            {title}
          </h2>
          <p className="mt-3 text-base leading-6 text-gray-500">
            Starting from: ${price.toFixed(2)}
          </p>
        </div>
        <div className="mt-6 rounded-md shadow">
          <Link
            to={`/product/${slug}`}
            className="flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:shadow-outline"
          >
            Shop now
          </Link>
        </div>
      </div>
    </div>
  );
}

Tile.propTypes = {
  image: PropTypes.string,
  price: PropTypes.number,
  slug: PropTypes.string,
  title: PropTypes.string,
};

Tile.defaultProps = {
  title: "Men's Down Jacket",
  price: '50',
};
