import { Breadcrumb, Button, Card, Col, Divider, Row, Tabs } from "antd";
import React, { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import ProductDetail from "./ProductDetail";
// import ProductVariant from "./ProductVariant";

const ProductDetailUpdate = () => {
  // ** Third party
  const params = useParams();
  const { id } = params;

  return (
    <Fragment>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Card>
          <ProductDetail />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ProductDetailUpdate;
