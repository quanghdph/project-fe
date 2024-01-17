import { useBasket } from "@/hooks";
import PropType from "prop-types";
import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import axios from "axios";
import { useFeaturedProducts } from "@/hooks";

const ProductGrid = () => {
  const { addToBasket, isItemOnBasket } = useBasket();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [filter, setFilter] = useState("");

  const {
    featuredProducts: products,
    fetchFeaturedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured,
  } = useFeaturedProducts({ page, limit, filter });

  return (
    <div className="product-grid">
      {products.length === 0
        ? new Array(12).fill({}).map((product, index) => (
            <ProductItem
              // eslint-disable-next-line react/no-array-index-key
              key={`product-skeleton ${index}`}
              product={product}
            />
          ))
        : products.map((product) => {
            return (
              <>
                {product.status == 1 && (
                  <ProductItem
                    key={product.id}
                    isItemOnBasket={isItemOnBasket}
                    addToBasket={addToBasket}
                    product={product}
                  />
                )}
              </>
            );
          })}
    </div>
  );
};

export default ProductGrid;
