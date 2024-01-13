import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';
import { ColorChooser, ImageLoader, MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { RECOMMENDED_PRODUCTS, SHOP } from '@/constants/routes';
import { displayMoney } from '@/helpers/utils';
import {
  useBasket,
  useDocumentTitle,
  useProduct,
  useScrollTop
} from '@/hooks';
import axios from 'axios';

const ViewProduct = () => {
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  useScrollTop();
  useDocumentTitle(`View ${product?.product?.productname || 'Item'}`);

  const [selectedImage, setSelectedImage] = useState(product?.image || '');

  const [productVariant, setProductVariant] = React.useState();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);

  const [selectedCartSize, setSelectedCartSize] = useState('');
  const [selectedCartColor, setSelectedCartColor] = useState('');

  // const {
  //   recommendedProducts,
  //   fetchRecommendedProducts,
  //   isLoading: isLoadingFeatured,
  //   error: errorFeatured
  // } = useRecommendedProducts(6);
  const colorOverlay = useRef(null);

  const recommendedProducts = [];
  const fetchRecommendedProducts = () => {};
  const errorFeatured = false;
  const isLoadingFeatured = false;

  useEffect(() => {
    setSelectedImage(product?.image);
  }, [product]);

  const onSelectedSizeChange = (newValue) => {
    setSelectedCartSize(newValue.value);
  };

  const onSelectedColorChange = (newValue) => {
    setSelectedCartColor(newValue.value);
  };

  // const onSelectedColorChange = (color) => {
  //   setSelectedColor(color);
  //   if (colorOverlay.current) {
  //     colorOverlay.current.value = color;
  //   }
  // };

  const handleAddToBasket = () => {
    console.log({ ...product, selectedColor: selectedCartColor, selectedSize: selectedCartSize });
    // addToBasket({ ...product, selectedColor: selectedCartColor, selectedSize: selectedCartSize });
  };

  // React.useEffect(() => {
  //   // axios.get(`/product-detail?idProduct=${id}`).then((res) => {
  //   //   const result = { ...res };
  //   // });
  //   setProductVariant(result.data);
  // }, []);

  useEffect(() => {
    const sizes = product && [
      ...new Set(
        product?.map((product) => product.size),
      ),
    ];
    const colors = product && [
      ...new Set(
        product?.map((product) => product.color),
      ),
    ];

    const sizeIds = sizes && sizes.map(({ id }) => id);
    const sizeFiltered =
      sizes &&
      sizes.filter(({ id }, index) => !sizeIds.includes(id, index + 1));

    const colorsIds = colors && colors.map(({ id }) => id);
    const colorsFiltered =
      colors &&
      colors.filter(({ id }, index) => !colorsIds.includes(id, index + 1));

    setUniqueSizes(sizeFiltered);
    setUniqueColors(colorsFiltered);
  }, [product]);

  const selectedProduct =
    product &&
    product?.length > 0 &&
    product?.find((product) => {
      return (
        product.size.id === selectedSize && product.color.id === selectedColor
      );
    });

  return (
    <main className="content">
      {isLoading && (
        <div className="loader">
          <h4>Tải dữ liệu sản phẩm...</h4>
          <br />
          <LoadingOutlined style={{ fontSize: '3rem' }} />
        </div>
      )}
      {error && (
        <MessageDisplay message={error} />
      )}
      {(product && !isLoading) && (
        <div className="product-view">
          <Link to={SHOP}>
            <h3 className="button-link d-inline-flex">
              <ArrowLeftOutlined />
              &nbsp; Back to shop
            </h3>
          </Link>
          <div className="product-modal">
            {/* {product.imageCollection.length !== 0 && (
              <div className="product-modal-image-collection">
                {product.imageCollection.map((image) => (
                  <div
                    className="product-modal-image-collection-wrapper"
                    key={image.id}
                    onClick={() => setSelectedImage(image.url)}
                    role="presentation"
                  >
                    <ImageLoader
                      className="product-modal-image-collection-img"
                      src={image.url}
                    />
                  </div>
                ))}
              </div>
            )} */}
            {/* <div className="product-modal-image-wrapper">
              {selectedColor && <input type="color" disabled ref={colorOverlay} id="color-overlay" />}
              <ImageLoader
                alt={product.name}
                className="product-modal-image"
                src={selectedImage}
              />
            </div> */}
            <div className="product-modal-details">
              <br />
              <span className="text-subtle">{product[0]?.brand?.brandName}</span>
              <h1 className="margin-top-0">{product[0]?.product?.productName}</h1>
              <span>{product[0]?.product?.description}</span>
              <br />
              <br />
              <div className="divider" />
              <br />
              <div>
                <span className="text-subtle">Màu sắc và Kích thước</span>
                <br />
                <br />
                <Select
                  placeholder="--Chọn kích thước--"
                  onChange={onSelectedSizeChange}
                  options={uniqueSizes?.map((size) => ({ label: `${size?.sizeName}`, value: size.id }))}
                  styles={{ menu: (provided) => ({ ...provided, zIndex: 10 }) }}
                />
              </div>
              <br />
              {/* {product.availableColors.length >= 1 && (
                <div>
                  <span className="text-subtle">Choose Color</span>
                  <br />
                  <br />
                  <ColorChooser
                    availableColors={product.availableColors}
                    onSelectedColorChange={onSelectedColorChange}
                  />
                </div>
              )} */}
               <Select
                  placeholder="--Chọn màu sắc--"
                  onChange={onSelectedColorChange}
                  options={uniqueColors?.map((color) => ({ label: `${color?.colorName}`, value: color.id }))}
                  styles={{ menu: (provided) => ({ ...provided, zIndex: 10 }) }}
                />
              <h1>{displayMoney(product?.price)}</h1>
              <div className="product-modal-action">
                <button
                  className={`button button-small ${isItemOnBasket(product.id) ? 'button-border button-border-gray' : ''}`}
                  onClick={handleAddToBasket}
                  type="button"
                >
                  {isItemOnBasket(product.id) ? 'Xóa khỏi giỏ' : 'Thêm vào giỏ hàng'}
                </button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '10rem' }}>
            <div className="display-header">
              <h1>Recommended</h1>
              <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
            </div>
            {errorFeatured && !isLoadingFeatured ? (
              <MessageDisplay
                message={error}
                action={fetchRecommendedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid products={recommendedProducts} skeletonCount={3} />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewProduct;
