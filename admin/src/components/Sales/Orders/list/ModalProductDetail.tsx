import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  Button,
  Col,
  Divider,
  Image,
  InputNumber,
  Modal,
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
import {
  getListProduct,
  getProduct,
  getProductDetail,
  getProductImage,
} from "src/features/catalog/product/actions";
import { createAxiosJwt } from "src/helper/axiosInstance";

function ModalProductDetail({
  activeModalProductDetail,
  setActiveModalProductDetail,
  id,
}) {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  const product = useAppSelector((state) => state.product.detail);

  const handleOk = () => {
    setActiveModalProductDetail(false);
  };

  const handleCancel = () => {
    setActiveModalProductDetail(false);
  };

  useEffect(() => {
    // getListProduct({
    //   params: {
    //     page,
    //     limit,
    //     filter,
    //   },
    //   navigate,
    //   axiosClientJwt,
    //   dispatch,
    // });
    if (id) {
      getProductDetail({
        id: +id,
        dispatch,
        axiosClientJwt,
        navigate,
      });
      // getProductImage({
      //     axiosClientJwt,
      //     dispatch,
      //     id: +id,
      //     navigate
      // })
    }
  }, [id]);


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
     {
      !product.loading && product.result && product.result.product ? (
        <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          {/* Product Image */}
          <img
            src="https://via.placeholder.com/200x200"
            alt={product.result.product.productName}
            style={{ width: '100%', maxWidth: '200px' }}
          />
        </Col>
        <Col xs={24} sm={12} md={16} lg={18} xl={20}>
          {/* Product Details */}
          <Title level={3}>{product.result?.product?.productName}</Title>
          <Text  as='b'>{product.result?.product?.brand?.brandName}</Text>
          <Divider />
          <div dangerouslySetInnerHTML={{ __html: product.result?.product?.description }} />

          <Divider />

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text  as='b'>Giá:</Text> {product.result?.price}
            </Col>
            <Col span={12}>
              <Text  as='b'>Màu:</Text> {product.result?.color?.colorName}
            </Col>
            {/* <Col span={12}>
              <Text  as='b'>Size:</Text> {product.result.size}
            </Col> */}
            <Col span={12}>
              <Text  as='b'>Số lượng:</Text> {product.result?.quantity}
            </Col>
          </Row>
        </Col>
      </Row>
      ) : <Spin />
     }

      </Modal>
    </Fragment>
  );
}

export default ModalProductDetail;
