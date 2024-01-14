import React from 'react';
import { MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import bannerImg from '@/images/banner-guy.png';

const FeaturedProducts = () => {
  useDocumentTitle('Featured Products | YoungBoy');
  useScrollTop();

  // const {
  //   featuredProducts,
  //   fetchFeaturedProducts,
  //   isLoading,
  //   error
  // } = useFeaturedProducts();

  const featuredProducts = [];
  const fetchFeaturedProducts = () => {};
  const isLoading = false;
  const error = false;

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>Featured Products</h1>
          </div>
          <div className="banner-img">
            <img src={bannerImg} alt="" />
          </div>
        </div>
        <div className="display">
          <div className="product-display-grid">
            {(error && !isLoading) ? (
              <MessageDisplay
                message={error}
                action={fetchFeaturedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid
                products={featuredProducts}
                skeletonCount={6}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default FeaturedProducts;
