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
          {/* <Avatar src={<img src={record.url} style={{ width: 40 }} />} /> */}

          {/* {record?.product?.mainImage ? (
            <Image
              width={100}
              height={100}
              src={`${import.meta.env.VITE_BACKEND_URL}/product/${
                record.id
              }/image-main`}
            />
          ) : (
            <Image
              width={100}
              height={100}
              src="error"
              fallback="data:image/png;base64,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"
            />
          )} */}
           <Image
              // width={100}
              // height={100}
              style={{ width: "100%", maxWidth: "150px", maxHeight: "75%" }}
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

function ProductList({ navigate, cart, setCart, setPage, setLimit }) {
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
