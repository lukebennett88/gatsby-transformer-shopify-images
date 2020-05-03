import React, { useState, useEffect, useMemo } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';

import { useAddItemToCart } from '../hooks';
import {
  prepareVariantsWithOptions,
  prepareVariantsImages,
} from '../utilities';
import { Layout, SEO, Alert, Thumbnail, OptionPicker } from '../components';

export default function ProductPage({ data: { shopifyProduct: product } }) {
  // Get available colours
  const colours =
    product.options.find((option) => option.name.toLowerCase() === 'colour')
      ?.values || [];

  // Get available sizes
  const sizes =
    product.options.find((option) => option.name.toLowerCase() === 'size')
      ?.values || [];

  // Format the data we get back from GraphQL for variants to be a little easier to work with
  // See comment in `prepare-variants-with-options.js`
  const variants = useMemo(() => prepareVariantsWithOptions(product.variants), [
    product.variants,
  ]);

  // Format the data we get back from GraphQL for images to be a little easier to work with
  // See comment in `prepare-variants-images.js`
  const images = useMemo(() => prepareVariantsImages(variants, 'size'), [
    variants,
  ]);

  // Keep variants in state, and set the default variant to be the first item
  const [variant, setVariant] = useState(variants[0]);

  // Keep different colour options in state
  const [colour, setColour] = useState(variant.colour);

  // Keep different sizes in state
  const [size, setSize] = useState(variant.size);

  // Manage add to cart alerts in state
  const [addedToCartMessage, setAddedToCartMessage] = useState(null);

  // Use a custom hook for adding items to cart
  const addItemToCart = useAddItemToCart();

  // Whenever we add an item to the cart, also create an alert to notify the customer of this
  // Note: we are hard coding the number of items to be added to cart as 1, we can add another useState instance to address this in the future if we need to
  function handleAddToCart() {
    addItemToCart(variant.shopifyId, 1);
    setAddedToCartMessage('Added to your cart!');
  }

  // This handles adding the correct variant to the cart
  useEffect(() => {
    const newVariant = variants.find((v) => {
      return v.size === size && v.colour === colour;
    });

    if (variant.shopifyId !== newVariant.shopifyId) {
      setVariant(newVariant);
    }
  }, [size, colour, variants, variant.shopifyId]);

  function Gallery() {
    if (images.length < 1) return null;
    return (
      <div className="grid grid-cols-5 gap-4">
        {images.map((image) => (
          <Thumbnail
            key={image.size}
            src={image.src}
            onClick={() => setSize(image.size)}
          />
        ))}
      </div>
    );
  }

  return (
    <Layout>
      <SEO title={product.title} />
      <div className="relative pt-16 pb-20">
        <div className="relative lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8">
          {addedToCartMessage && (
            <Alert
              message={addedToCartMessage}
              dismiss={() => setAddedToCartMessage(null)}
            />
          )}
          <div className="grid gap-4">
            <div className="h-96">
              <img
                src={variant.image?.originalSrc}
                alt=""
                className="object-cover w-full h-full overflow-hidden rounded-md shadow"
              />
            </div>
            <Gallery />
          </div>
          <div className="flex flex-col mt-16">
            <h1 className="text-2xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-3xl sm:leading-9">
              {product.title}
            </h1>
            <div
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              className="mt-4 text-base leading-6 text-gray-500 sm:mt-3"
            />
            <div className="grid grid-cols-2">
              <OptionPicker
                key="Colour"
                name="Colour"
                options={colours}
                selected={colour}
                handleChange={(event) => setColour(event.target.value)}
              />
              <OptionPicker
                name="Size"
                options={sizes}
                selected={size}
                onChange={(event) => setSize(event.target.value)}
              />
            </div>
            <div className="mt-6">
              <button
                onClick={handleAddToCart}
                type="button"
                className="flex items-center justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:shadow-outline"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

ProductPage.propTypes = {
  data: PropTypes.object,
};

export const ProductPageQuery = graphql`
  query productPage($productId: String!) {
    shopifyProduct(id: { eq: $productId }) {
      id
      title
      descriptionHtml
      options {
        name
        values
      }
      variants {
        availableForSale
        id
        price
        shopifyId
        sku
        title
        selectedOptions {
          name
          value
        }
        image {
          originalSrc
        }
      }
    }
  }
`;
