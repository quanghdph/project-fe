import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  Button,
  Col,
  Divider,
  Image,
  InputNumber,
  Modal,
  Radio,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import Paragraph from "antd/lib/skeleton/Paragraph";
import { ColumnsType } from "antd/lib/table";
import Title from "antd/lib/typography/Title";
import React, { Fragment, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { Inotification } from "src/common";
import {
  getListProduct,
  getProduct,
  getProductDetail,
  getProductImage,
  getVariantProductDetail,
} from "src/features/catalog/product/actions";
import { createAxiosJwt } from "src/helper/axiosInstance";
import { formatPriceVND } from "src/helper/currencyPrice";

function ModalProductDetail({
  activeModalProductDetail,
  setActiveModalProductDetail,
  id,
  cart,
  setCart,
}) {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  const product = useAppSelector((state) => state.product.detail);
  const variant = useAppSelector((state) => state.product.variant);

  const handleOk = () => {
    setActiveModalProductDetail(false);
  };

  const handleCancel = () => {
    setActiveModalProductDetail(false);
  };

  useEffect(() => {
    if (id) {
      getProductDetail({
        id: +id,
        dispatch,
        axiosClientJwt,
        navigate,
      });
      getVariantProductDetail({
        id: +id,
        dispatch,
        axiosClientJwt,
        navigate,
      });
    }
  }, [id]);

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  useEffect(() => {
    const sizes = variant.result && [
      ...new Set(
        variant.result.listProductDetail.map((product) => product.size),
      ),
    ];
    const colors = variant.result && [
      ...new Set(
        variant.result.listProductDetail.map((product) => product.color),
      ),
    ];

    const sizeIds = sizes && sizes.map(({ id }) => id);
    const sizeFiltered = sizes  && sizes.filter(
      ({ id }, index) => !sizeIds.includes(id, index + 1),
    );

    const colorsIds = colors && colors.map(({ id }) => id);
    const colorsFiltered = colors && colors.filter(
      ({ id }, index) => !colorsIds.includes(id, index + 1),
    );

    setUniqueSizes(sizeFiltered);
    setUniqueColors(colorsFiltered);
  }, [variant.result, variant.loading]);

  const selectedProduct =
    !variant.loading && variant.result &&   variant.result?.listProductDetail.length > 0 &&
    variant.result?.listProductDetail.find(
      (product) => {
        console.log(product)
        return  product.size.id === selectedSize && product.color.id === selectedColor
      }
       
    );

    

    console.log("selectedProduct", selectedProduct)
    console.log("variant",  variant.result?.listProductDetail)
    console.log("variant", selectedSize)

  return (
    <Fragment>
      <Modal
        open={activeModalProductDetail}
        title="Chi tiết sản phẩm"
        width={1000}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }: any): any => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        {!product.loading && product.result && product.result.product ? (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              {/* Product Image */}
              <img
                src="https://via.placeholder.com/200x200"
                alt={product.result.product.productName}
                style={{ width: "100%", maxWidth: "200px" }}
              />
            </Col>
            <Col xs={24} sm={12} md={16} lg={18} xl={20}>
              {/* Product Details */}
              <Title level={3}>{product.result?.product?.productName}</Title>
              <Text as="b">{product.result?.product?.brand?.brandName}</Text>
              <Divider />
              <Box
                dangerouslySetInnerHTML={{
                  __html: product.result?.product?.description,
                }}
              />

              <Divider />

              <Row gutter={[16, 16]}>
                {
                  variant.result?.listProductDetail.length > 0 && (
                    <Box>
                    <Box>
                      <Text>Kích thước: </Text>
                      <Radio.Group
                        onChange={handleSizeChange}
                        value={selectedSize}
                        style={{ marginRight: "8px" }}
                      >
                        {uniqueSizes.length &&
                          uniqueSizes.map((size) => (
                            <Radio.Button key={size.id} value={size.id}>
                              {size?.sizeName}
                            </Radio.Button>
                          ))}
                      </Radio.Group>
                    </Box>
                    <Box style={{ marginTop: 16 }}>
                      <Text>Màu sắc: </Text>
                      <Radio.Group
                        onChange={handleColorChange}
                        value={selectedColor}
                      >
                        {uniqueColors.length &&
                          uniqueColors.map((color) => (
                            <Radio.Button
                              key={`${color.id}-${color.colorName}`}
                              value={color.id}
                            >
                              {color?.colorName}
                            </Radio.Button>
                          ))}
                      </Radio.Group>
                    </Box>
                    <Box style={{ marginTop: 16 }}>
                      {selectedProduct ? (
                        <Box>
                          <Box>
                            <Text>
                              Giá: {formatPriceVND(selectedProduct.price)}
                            </Text>
                          </Box>
                          <Box>
                            Số lượng trong kho: {selectedProduct.quantity}
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          Chọn kích thước và màu để hiển thị giá và số lượng trong
                          kho!
                        </Box>
                      )}
                    </Box>
                  </Box>
                  )
                }
               
              </Row>

              <Divider />

              <Button
                type="primary"
                // disabled={!selectedProduct && true}
                onClick={() => {
                  const existingProductIndex = cart.findIndex(
                    (e: any) => e.id == id,
                  );

                  if (existingProductIndex !== -1 ) {
                    if (
                      cart[existingProductIndex].product.size.id === selectedProduct.size.id &&
                      cart[existingProductIndex].product.color.id === selectedProduct.color.id
                    ) {
                      const updatedCart = [...cart];
                      updatedCart[existingProductIndex].quantity += 1;
                      setTimeout(() => {
                        Inotification({
                          type: "success",
                          message: "Thêm vào giỏ hàng thành công!",
                        });
                      }, 200);
                      return setCart(updatedCart);
                    } else {
                      setTimeout(() => {
                        Inotification({
                          type: "success",
                          message: "Thêm vào giỏ hàng thành công!",
                        });
                      }, 200);
                      // Different variant, create a new cart item
                      return setCart([
                        ...cart,
                        {
                          id: id,
                          product: selectedProduct,
                          quantity: 1,
                        },
                      ]);
                    }
                
                    
                  } else {
                    if (selectedProduct && selectedProduct.quantity == 0) {
                      Inotification({
                        type: "error",
                        message: "Mặt hàng này hiện đã hết !",
                      });
                      return 
                    } else {
                      setTimeout(() => {
                        setActiveModalProductDetail(false);
                        Inotification({
                          type: "success",
                          message: "Thêm vào giỏ hàng thành công!",
                        });
                      }, 200);

                      return setCart([
                        ...cart,
                        {
                          id: id,
                          product: selectedProduct,
                          quantity: 1,
                        },
                      ]);
                    }

                  }
                }}
              >
                Thêm vào giỏ hàng
              </Button>
            </Col>
          </Row>
        ) : (
          <Spin />
        )}
      </Modal>
    </Fragment>
  );
}

export default ModalProductDetail;
