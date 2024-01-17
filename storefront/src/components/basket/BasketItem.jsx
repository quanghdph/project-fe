import { CloseOutlined } from '@ant-design/icons';
import { BasketItemControl } from '@/components/basket';
import { ImageLoader } from '@/components/common';
import { displayMoney } from '@/helpers/utils';
import PropType from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromBasket } from '@/redux/actions/basketActions';
import { displayActionMessage } from '@/helpers/utils';
import axios from 'axios';
import Input from 'antd/lib/input/Input';

const BasketItem = ({ product }) => {
  const dispatch = useDispatch();
  const onRemoveFromBasket = async () => {
    const access_token = localStorage.getItem("access_token")

    try {
     const response = await axios.delete(
       `/cart-detail/${product.id}`,{
         headers: {
           'Authorization': `Bearer ${access_token}`
         }
       }
     );
    dispatch(removeFromBasket(product.id))
    } catch (error) {
     error.response.data ?  displayActionMessage(`${error.response.data}`, 'error') : displayActionMessage(`Đã xảy ra lỗi`, 'error')
    }
    // return )
  };

  return (
    <div className="basket-item">
      <BasketItemControl product={product} />
      <div className="basket-item-wrapper">
        <div className="basket-item-img-wrapper">
          <ImageLoader
            alt={product.product.productName}
            className="basket-item-img"
            src={`http://localhost:8080/product/${product.product.id}/image-main`}
          />
        </div>
        <div className="basket-item-details">
          <Link to={`/product/${product.id.toString()}`} onClick={() => document.body.classList.remove('is-basket-open')}>
            <h4 className="underline basket-item-name">
              {product.product.productName}
            </h4>
          </Link>
          <div className="basket-item-specs">
            <div>
              <span className="spec-title">Số lượng</span>
              <h5 className="my-0">{product.cartQuantity}</h5>
            </div>
            <div>
              <span className="spec-title">Size</span>
              <h5 className="my-0">
                {product.size.sizeName}
                {' '}
              </h5>
            </div>
            <div>
              <span className="spec-title">Color</span>
              {/* <div style={{
                backgroundColor: product.selectedColor,
                width: '15px',
                height: '15px',
                borderRadius: '50%'
              }}
              /> */}
               <h5 className="my-0">
                {product.color.colorName}
                {' '}
              </h5>
            </div>
          </div>
        </div>
        <div className="basket-item-price">
          <h4 className="my-0">{displayMoney(product.price * product.cartQuantity)}</h4>
        </div>
        <button
          className="basket-item-remove button button-border button-border-gray button-small"
          onClick={onRemoveFromBasket}
          type="button"
        >
          <CloseOutlined />
        </button>
      </div>
    </div>
  );
};

BasketItem.propTypes = {
  product: PropType.shape({
    id: PropType.string,
    name: PropType.string,
    brand: PropType.string,
    price: PropType.number,
    quantity: PropType.number,
    maxQuantity: PropType.number,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    selectedSize: PropType.string,
    selectedColor: PropType.string,
    imageCollection: PropType.arrayOf(PropType.string),
    sizes: PropType.arrayOf(PropType.number),
    image: PropType.string,
    imageUrl: PropType.string,
    isFeatured: PropType.bool,
    isRecommended: PropType.bool,
    availableColors: PropType.arrayOf(PropType.string)
  }).isRequired
};

export default BasketItem;
