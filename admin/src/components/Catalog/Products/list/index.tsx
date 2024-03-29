import React, { Fragment, useState, useEffect } from "react";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Image,
  Input,
  Modal,
  PaginationProps,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { Flex } from "@chakra-ui/react";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/helper/axiosInstance";
import {
  deleteProduct,
  getListProduct,
  getListSearchProduct,
} from "src/features/catalog/product/actions";
import { Box } from "@chakra-ui/react";
import { useDebounce } from "use-debounce";
import ModalProductDetail from "src/components/Sales/Orders/list/ModalProductDetail";

interface DataType {
  key: number;
  id: number;
  name: string;
  url: string;
  active: boolean;
}

const columns = (
  setIsModalOpen: (open: boolean) => void,
  productDelete: { id: number; name: string } | undefined,
  setProductDelete: ({ id, name }: { id: number; name: string }) => void,
  navigate: NavigateFunction,
  setActiveModalProductDetail: any,
  setIdProductDetail: any,
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
    dataIndex: "image",
    ellipsis: true,
    key: "image",
    width: "10%",
    render: (product, record) => {
      return (
        <Image
          style={{ width: "100%", maxWidth: "300px", maxHeight: "75%" }}
          onError={(e) => {
            e.target.src = 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg';
          }}
          src={`${import.meta.env.VITE_BACKEND_URL}/product/${
            record.id
          }/image-main`}
        />
      );
    },
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (name, record) => {
      return (
        <Flex alignItems={"center"}>
          {/* <Avatar src={<img src={record.url} style={{ width: 40 }} />} /> */}
          <Box
            onClick={() => {
              setActiveModalProductDetail(true);
              setIdProductDetail(record.id);
            }}
            ml={2}
            cursor={"pointer"}
          >
            {name}
          </Box>
        </Flex>
      );
    },
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

const Products: React.FC = () => {
  // ** State
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productDelete, setProductDelete] = useState<{
    id: number;
    name: string;
  }>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [value] = useDebounce(search, 1000);
  const [status, setStatus] = useState<string>("all");

  const [activeModalProductDetail, setActiveModalProductDetail] =
    useState(false);
  const [idProductDetail, setIdProductDetail] = useState(false);

  // ** Third party
  const navigate = useNavigate();

  // ** Variables
  const product = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // ** Effect
  useEffect(() => {
    if (value && search !== "") {
      getListSearchProduct({
        params: {
          value,
        },
        navigate,
        axiosClientJwt,
        dispatch,
      });
    } else {
      getListProduct({
        params: {
          page,
          limit,
          filter,
        },
        navigate,
        axiosClientJwt,
        dispatch,
      });
    }
  }, [page, limit, refresh, value]);

  // ** Function handle
  const dataRender = (): any => {
    if (!product.list.loading && product.list.result?.list) {
      return product.list.result?.list.map((product, index: number) => {
        return {
          key: index,
          id: product.id,
          name: product.productName,
          category: product.category?.categoryName,
          brand: product.brand?.brandName,
          url: product?.mainImage,
          active: product.status,
        };
      });
    } else if (!product.list.loading && product.list.result) {
      return product.list?.result.map((product, index: number) => {
        return {
          key: index,
          id: product.id,
          name: product.productName,
          // url: product?.featured_asset?.url,
          active: product.status,
        };
      });
    } else {
      return [];
    }
  };

  const handleOk = async () => {
    await deleteProduct({
      axiosClientJwt,
      dispatch,
      navigate,
      id: productDelete?.id!,
      refresh,
      setIsModalOpen,
      setRefresh,
      message,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOnChangePagination = (e: number) => {
    // setSkip((e - 1) * take)
    setPage(e);
  };

  const onChangeStatus = (value: string) => {
    setStatus(value);
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
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Flex justifyContent={"flex-end"} alignItems={"center"}>
                <Box mr={3} flex={2}>
                  <Input
                    type="text"
                    placeholder="Tìm kiếm..."
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </Box>
                <Box mr={3} flex={1}>
                  <Select
                    value={status}
                    placeholder="Status"
                    onChange={onChangeStatus}
                    options={[
                      {
                        value: "all",
                        label: "Tất cả",
                      },
                      {
                        value: "active",
                        label: "Hoạt động",
                      },
                      {
                        value: "disabled",
                        label: "Vô hiệu hóa",
                      },
                    ]}
                  />
                </Box>
                <Button
                  style={{ textTransform: "uppercase" }}
                  type="primary"
                  onClick={() => navigate("create")}
                  icon={<PlusCircleOutlined />}
                >
                  Tạo sản phẩm mới
                </Button>
              </Flex>
            </Col>
            <Divider />
            <Col span={24}>
              <Card>
                <Table
                  bordered
                  columns={columns(
                    setIsModalOpen,
                    productDelete,
                    setProductDelete,
                    navigate,
                    setActiveModalProductDetail,
                    setIdProductDetail,
                  )}
                  dataSource={dataRender()}
                  loading={product.list.loading}
                  pagination={{
                    total: product.list.result?.total,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                    onChange: handleOnChangePagination,
                    onShowSizeChange: handleOnShowSizeChange,
                    responsive: true,
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title="Xóa sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        confirmLoading={product.delete.loading}
      >
        <p>
          Bản có muốn xóa sản phẩm này (
          <span style={{ fontWeight: "bold" }}>{productDelete?.name}</span>) ?
        </p>
      </Modal>

      <ModalProductDetail
        activeModalProductDetail={activeModalProductDetail}
        setActiveModalProductDetail={setActiveModalProductDetail}
        id={idProductDetail}
      />
    </Fragment>
  );
};

export default Products;
