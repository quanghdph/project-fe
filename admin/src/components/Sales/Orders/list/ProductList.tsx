import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Box, Flex } from "@chakra-ui/react";
import { Button, Image, InputNumber, Modal, Space, Table, Tag } from "antd";
import { PaginationProps } from "antd/es/pagination";
import { ColumnsType } from "antd/lib/table";
import Title from "antd/lib/typography/Title";
import React, { Fragment, useEffect, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { getListProduct } from "src/features/catalog/product/actions";
import { createAxiosJwt } from "src/helper/axiosInstance";
import ModalProductDetail from "./ModalProductDetail";

const columns = (
  // setIsModalOpen: (open: boolean) => void,
  // productDelete: { id: number; name: string } | undefined,
  // setProductDelete: ({ id, name }: { id: number; name: string }) => void,
  navigate: NavigateFunction,
  // onInputChange,
  cart: any,
  setCart: any,
  setActiveModalProductDetail: any,
  setIdProductDetail: any,
): any => [
  {
    title: "#",
    dataIndex: "id",
    ellipsis: true,
    key: "id",
    width: "8%",
    fixed: "left",
  },
  {
    title: "Sản phẩm",
    dataIndex: "product",
    key: "product",
    width: "50%",
    render: (product, record) => {
      return (
        <Flex justifyContent={"flex-start"} gap={4}>
           <Image
              style={{ width: "100%", maxWidth: "150px", maxHeight: "75%" }}
              onError={(e) => {
                e.target.src = 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg';
              }}
              src={`${import.meta.env.VITE_BACKEND_URL}/product/${
                record.id
              }/image-main`}
            />

          <Flex direction={"column"} gap={1}>
            <Box
              style={{ fontWeight: "bold" }}
            >
              {product.productName}
            </Box>
            <Box>{product.productCode}</Box>
            <Box>Thương hiệu: {product.brand?.brandName}</Box>
          </Flex>
        </Flex>
      );
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    ellipsis: true,
    key: "status",
  },
  {
    title: "Hành động",
    key: "action",
    width: "150px",
    // fixed: "right",
    render: (_, record) => {
      return (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setActiveModalProductDetail(true);
              setIdProductDetail(record.id);
            }}
          >
            Chọn
          </Button>
        </Space>
      );
    },
  },
];

function ProductList({ navigate, cart, setCart, setPage, setLimit, page }) {
  const [filter, setFilter] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeModalProductDetail, setActiveModalProductDetail] = useState(false);
  const [idProductDetail, setIdProductDetail] = useState(false);

  const product = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // useEffect(() => {
   
  // }, [page, limit]);

  const dataRender = (): any => {
    if (!product.list.loading && product.list.result?.list) {
      return product.list.result?.list.map((product, index: number) => {
        return {
          key: index,
          id: product.id,
          product: {
            productName: product.productName,
            color: "Màu đỏ",
            productCode: product.productCode,
            size: "10",
            brand: product.brand,
            waistband: product.waistband,
            mainImage: product.mainImage,
          },
          status: <Tag color={product.status== 1 ? 'green' : 'gold'}>{product.status == 1 ? 'Hoạt động' : 'Vô hiệu hóa'}</Tag>
        };
      });
    } else if(!product.list.loading &&product.list.result) {
      return product.list?.result.map((product, index: number) => {
          return {
            key: index,
            id: product.id,
            product: {
              productName: product.productName,
              color: "Màu đỏ",
              productCode: product.productCode,
              size: "10",
              brand: product.brand,
              waistband: product.waistband,
              mainImage: product.mainImage,
            },
          };
        });
  } else {
      return []
  }
  };

  const onInputChange = (value, recordKey) => {
    console.log(`Quantity changed for record with key ${recordKey}: ${value}`);
    // You can use the value and recordKey as needed, for example, update the state.
  };

  const handleOnChangePagination = (e: number) => {
    setPage(e);
  };

  const handleOnShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize,
  ) => {
    setPage(current);
    setLimit(pageSize);
  };

  return (
    <Fragment>
      <Table
        bordered
        columns={columns(
          navigate,
          cart,
          setCart,
          setActiveModalProductDetail,
          setIdProductDetail,
        )}
        dataSource={dataRender()}
        loading={product.list?.loading}
        pagination={{
          total: product.list.result?.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: handleOnChangePagination,
          onShowSizeChange: handleOnShowSizeChange,
          responsive: true,
          pageSize: page
        }}
        scroll={{ x: true }}
        // style={{maxWidth: 600}}
      />
       <ModalProductDetail
          activeModalProductDetail={activeModalProductDetail}
          setActiveModalProductDetail={setActiveModalProductDetail}
          id={idProductDetail}
          cart={cart}
          setCart={setCart}
        />
     
    </Fragment>
  );
}

export default ProductList;
