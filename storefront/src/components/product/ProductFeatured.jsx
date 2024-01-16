import PropType from 'prop-types';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import { ImageLoader } from '@/components/common';

const ProductFeatured = ({ product }) => {
  const history = useHistory();
  const onClickItem = () => {
    if (!product) return;

    history.push(`/product/${product.id}`);
  };

  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div className="product-display" onClick={onClickItem} role="presentation">
        <div className="product-display-img">
          {/* {product.mainImage ? (
            <ImageLoader
              className="product-card-img"
              src={product.mainImage}
            />
          ) : <Skeleton width="100%" height="100%" />} */}
           <ImageLoader
              className="product-card-img"
              src={`http://localhost:8080/product/${product.id}/image-main`}
            />
        </div>
        <div className="product-display-details">
          <h2>{product.productName || <Skeleton width={80} />}</h2>
          <p className="text-subtle text-italic">
            {product.brand?.brandName || <Skeleton width={40} />}
          </p>
        </div>
      </div>
    </SkeletonTheme>
  );
};

ProductFeatured.propTypes = {
  product: PropType.shape({
    mainImage: PropType.string,
    productName: PropType.string,
    id: PropType.number,
    brand: PropType.shape({
      id: PropType.number,
      brandCode: PropType.string,
      brandName: PropType.string
    })
  }).isRequired
};

export default ProductFeatured;
