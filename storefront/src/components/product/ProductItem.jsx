import { CheckOutlined } from "@ant-design/icons";
import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useHistory } from "react-router-dom";
import { Image } from "antd";

const ProductItem = ({ product, isItemOnBasket, addToBasket }) => {
  const history = useHistory();

  const onClickItem = () => {
    if (!product) return;

    if (product.id) {
      history.push(`/product/${product.id}`);
    }
  };

  const itemOnBasket = isItemOnBasket ? isItemOnBasket(product.id) : false;

  const handleAddToBasket = () => {
    if (addToBasket)
      addToBasket({ ...product, selectedSize: product.sizes[0] });
  };

  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div
        className={`product-card ${!product.id ? "product-loading" : ""}`}
        style={{
          border: product && itemOnBasket ? "1px solid #a6a5a5" : "",
          boxShadow:
            product && itemOnBasket ? "0 10px 15px rgba(0, 0, 0, .07)" : "none",
        }}
      >
        {itemOnBasket && (
          <CheckOutlined className="fa fa-check product-card-check" />
        )}
        <div
          className="product-card-content"
          onClick={onClickItem}
          role="presentation"
        >
          {/* <div className="product-card-img-wrapper">
            {product.image ? (
              <ImageLoader
                alt={product.name}
                className="product-card-img"
                src={product.image}
              />
            ) : <Skeleton width="100%" height="90%" />}
          </div> */}
          <Image
            // style={{ width: "100%", maxWidth: "300px", maxHeight: "75%" }}
            preview={false}
            onError={(e) => {
              e.target.src =
                "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg";
            }}
            src={`http://localhost:8080/product/${product.id}/image-main`}
          />
          <div className="product-details">
            <h5 className="product-card-name text-overflow-ellipsis margin-auto">
              {product?.productName || <Skeleton width={80} />}
            </h5>
            <p className="product-card-brand">
              {product?.brand?.brandName || <Skeleton width={60} />}
            </p>
            {/* <h4 className="product-card-price">
              {product.price ? (
                displayMoney(product.price)
              ) : (
                <Skeleton width={40} />
              )}
            </h4> */}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

ProductItem.defaultProps = {
  isItemOnBasket: undefined,
  addToBasket: undefined,
};

ProductItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  product: PropType.object.isRequired,
  isItemOnBasket: PropType.func,
  addToBasket: PropType.func,
};

export default ProductItem;
