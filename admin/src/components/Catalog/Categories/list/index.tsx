import { Box, Flex } from "@chakra-ui/react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
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
import React, { Fragment, useEffect, useState } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/helper/axiosInstance";
import {
  deleteCategory,
  getListCategory,
} from "src/features/catalog/category/action";
import type { ColumnsType } from "antd/es/table";
import { useDebounce } from "use-debounce";
interface DataType {
  key: number;
  id: number;
  category_name: string;
  category_code: string;
  description: string;
  active: boolean;
}

const columns = (
  setIsModalOpen: (open: boolean) => void,
  categoryDelete: { id: number; name: string } | undefined,
  setCategoriesDelete: ({ id, name }: { id: number; name: string }) => void,
  navigate: NavigateFunction,
): ColumnsType<DataType> => [
  {
    title: "ID",
    dataIndex: "id",
    ellipsis: true,
    key: "id",
    width: "15%",
  },
  {
    title: "Tên",
    dataIndex: "category_name",
    ellipsis: true,
    key: "category_name",
    width: "15%",
  },
  {
    title: "Mã danh mục",
    dataIndex: "category_code",
    ellipsis: true,
    key: "category_code",
    width: "15%",
  },
  {
    title: 'Hoạt động',
    dataIndex: 'status',
    key: 'status',
    width: '180px',
    render: (status: number) => {
        return (
            <Tag color={status == 1 ? 'green' : 'gold'}>{status ? 'Hoạt động' : 'Vô hiệu hóa'}</Tag>
        )
    }
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
            onClick={() => navigate(`update/${record.id}`)}
          />
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => {
               setIsModalOpen(true);
               setCategoriesDelete({
                  ...categoryDelete,
                  id: record.id,
                  name: record.category_name,
                });
            }}
          />
        </Space>
      );
    },
  },
];

const Categories = () => {
  // ** State
  // const [take, setTake] = useState<number>(10)
  // const [skip, setSkip] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [filter, setFilter] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [categoryDelete, setCategoriesDelete] = useState<{
    id: number;
    name: string;
  }>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  // ** Variables
  const category = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();
  console.log(category);
  // ** Third party
  const navigate = useNavigate();

  // ** Effect
  useEffect(() => {
    getListCategory({
        params: {
            page,
            limit,
            filter
        },
      navigate,
      axiosClientJwt,
      dispatch,
    });
  }, [page, limit, refresh]);

  // ** Function handle
  const dataRender = (): DataType[] => {
    if (!category.list.loading && category.list.result) {
      return category.list.result.listCategories.map((category, index: number) => {
        return {
          key: index,
          id: category.id,
          category_code: category.categoryCode,
          category_name: category.categoryName,
          status: category.status
        };
      });
    }
    return [];
  };

  const handleOk = async () => {
    await deleteCategory({
        axiosClientJwt,
        dispatch,
        navigate,
        id: categoryDelete?.id!,
        refresh,
        setIsModalOpen,
        setRefresh,
        message
    })
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOnChangePagination = (e: number) => {
    setPage(e)
  };

  const onChangeStatus = (value: string) => {
    setStatus(value);
  };

  const handleOnShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setPage(current)
    setLimit(pageSize)
  };

  return (
    <Fragment>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Danh mục</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Flex justifyContent={"flex-end"} alignItems={"center"}>
                <Button
                  style={{ textTransform: "uppercase" }}
                  type="primary"
                  onClick={() => navigate("create")}
                  icon={<PlusCircleOutlined />}
                >
                  Thêm mới danh mục
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
                    categoryDelete,
                    setCategoriesDelete,
                    navigate,
                  )}
                  dataSource={dataRender()}
                  scroll={{ x: "100vw" }}
                  loading={category.list.loading}
                  pagination={{
                    total: category.list.result?.total,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                     onChange: handleOnChangePagination,
                    // defaultPageSize: page,
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
        title="Xóa danh mục"
        okText={"Xóa"}
        cancelText={"Hủy"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        confirmLoading={category.delete.loading}
      >
        <p>
          Bạn có muốn xóa trường này (
          <span style={{ fontWeight: "bold" }}>{categoryDelete?.name}</span>)?
        </p>
      </Modal>
    </Fragment>
  );
};

export default Categories;
