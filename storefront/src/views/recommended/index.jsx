import React from 'react';
import { MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import bannerImg from '@/images/banner-girl-1.png';

const RecommendedProducts = () => {
  useDocumentTitle('Recommended Products | YoungBoy');
  useScrollTop();

  // const {
  //   recommendedProducts,
  //   fetchRecommendedProducts,
  //   isLoading,
  //   error
  // } = useRecommendedProducts();

  const recommendedProducts = [];
  const fetchRecommendedProducts = () => {};
  const error = false;
  const isLoading = false;

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>Recommended Products</h1>
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
                action={fetchRecommendedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid
                products={recommendedProducts}
                skeletonCount={6}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RecommendedProducts;
