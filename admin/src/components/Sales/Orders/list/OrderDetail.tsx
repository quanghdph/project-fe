import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Box, Flex } from "@chakra-ui/react";
import { Avatar, Button, Card, Modal, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import Title from "antd/lib/typography/Title";
import React, { Fragment, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ModalProduct from "./ModalProduct";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns = (
  setIsModalOpen: (open: boolean) => void,
  productDelete: { id: number; name: string } | undefined,
  setProductDelete: ({ id, name }: { id: number; name: string }) => void,
  navigate: NavigateFunction,
): ColumnsType<DataType> => [
  {
    title: "#",
    dataIndex: "id",
    ellipsis: true,
    key: "id",
    width: "5%",
  },
  {
    title: "Ảnh",
    dataIndex: "mainImage",
    key: "mainImage",
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Danh mục",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Thương hiệu",
    dataIndex: "brand",
    key: "brand",
  },
  {
    title: "Hoạt động",
    dataIndex: "active",
    key: "active",
    width: "180px",
    render: (active: number) => {
      return (
        <Tag color={active ? "green" : "gold"}>
          {active ? "Hoạt động" : "Vô hiệu hóa"}
        </Tag>
      );
    },
  },
  {
    title: "Hành động",
    key: "action",
    width: "150px",
    render: (_, record) => {
      return (
        <Space size="middle">
          <Button
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => navigate(`detail-update/${record.id}`)}
          />
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalOpen(true);
              setProductDelete({
                ...productDelete,
                id: record.id,
                name: record.name,
              });
            }}
          />
        </Space>
      );
    },
  },
];

function OrderDetail(props: any) {
  const { orderCode } = props;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productDelete, setProductDelete] = useState<{
    id: number;
    name: string;
  }>();
  const [open, setOpen] = useState(false);

  // ** Third party
  const navigate = useNavigate();

  const dataRender = (): any => {
    // if (!product.list.loading && product.list.result?.list) {
    //   return product.list.result?.list.map((product, index: number) => {
    //     return {
    //       key: index,
    //       id: product.id,
    //       name: product.productName,
    //       category: product.category?.categoryName,
    //       brand: product.brand?.brandName,
    //       url: product?.mainImage,
    //       active: product.status,
    //     };
    //   });
    // } else if(!product.list.loading &&product.list.result) {
    //     return product.list?.result.map((product, index: number) => {
    //         return {
    //           key: index,
    //           id: product.id,
    //           name: product.productName,
    //           // url: product?.featured_asset?.url,
    //           active: product.status,
    //         };
    //       });
    // } else {
    //     return []
    // }
    return [];
  };

  const handleAddProduct = () => {
    setOpen(true);
  };

  return (
    <Fragment>
      <Flex justifyContent={"space-between"} mb={5}>
        <Title level={5}>Đơn hàng {`#${orderCode}`}</Title>
        <Button className="primary" onClick={handleAddProduct}>
          Thêm sản phẩm
        </Button>
      </Flex>
      <Flex direction={"column"} gap={3}>
        <Card>
          <Table
            bordered
            columns={columns(
              setIsModalOpen,
              productDelete,
              setProductDelete,
              navigate,
            )}
            dataSource={dataRender()}
            // loading={product.list.loading}
            // pagination={{
            //   total: product.list.result?.total,
            //   showTotal: (total, range) =>
            //     `${range[0]}-${range[1]} of ${total} items`,
            //   onChange: handleOnChangePagination,
            //   onShowSizeChange: handleOnShowSizeChange,
            //   responsive: true,
            // }}
          />
        </Card>
        <Card>
          <Flex justifyContent={"space-between"}>
            <Title level={5}>Thông tin khách hàng</Title>
            <Button>Thêm mới khách hàng</Button>
          </Flex>
          <Box>Tên khách hàng: </Box>
          <Box>Email: </Box>
          <Box>Số điện thoaị: </Box>
        </Card>

        <Card>
          <Flex justifyContent={"space-between"}>
            <Title level={5}>Thông tin thanh toán</Title>
          </Flex>
        </Card>
      </Flex>
      <ModalProduct navigate={navigate} setOpen={setOpen} open={open} />
    </Fragment>
  );
}

export default OrderDetail;
