import { Breadcrumb, Button, Card, Col, Divider, Row, Tabs } from "antd";
import React, { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import ProductVariant from "./ProductVariant";
import AddVariant from "./AddVariant";

const ProductDetailUpdate = () => {
  // ** Third party
  const params = useParams();
  const { id } = params;

  return (
    <Fragment>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/catalog/products">Sản phẩm</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Divider />

        <Col span={24}>
          <Card>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Chi tiết sản phẩm" key="1">
                <ProductDetail />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Các biến thể" key="2">
                <ProductVariant />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Thêm mới biến thể +" key="3">
                <AddVariant />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ProductDetailUpdate;
