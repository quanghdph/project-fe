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
import { deleteColor, getListColor } from "src/features/catalog/color/action";

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
  colorDelete: { id: number; name: string } | undefined,
  setColorDelete: ({ id, name }: { id: number; name: string }) => void,
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
    dataIndex: "color_name",
    ellipsis: true,
    key: "color_name",
    width: "15%",
  },
  {
    title: "Mã màu",
    dataIndex: "color_code",
    ellipsis: true,
    key: "color_code",
    width: "15%",
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
               setColorDelete({
                  ...colorDelete,
                  id: record.id,
                  name: record.color_name,
                });
            }}
          />
        </Space>
      );
    },
  },
];

const Color = () => {
  // ** State
  // const [take, setTake] = useState<number>(10)
  // const [skip, setSkip] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [filter, setFilter] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [colorDelete, setColorDelete] = useState<{
    id: number;
    name: string;
  }>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("all");

  // ** Variables
  const color = useAppSelector((state) => state.color);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // ** Third party
  const navigate = useNavigate();

  useEffect(() => {
    getListColor({
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
    if (!color.list.loading && color.list.result) {
      return color.list.result.listColors.map((color, index: number) => {
        return {
          key: index,
          id: color.id,
          color_code: color.colorCode,
          color_name: color.colorName,
        };
      });
    }
    return [];
  };

  const handleOk = async () => {
    await deleteColor({
        axiosClientJwt,
        dispatch,
        navigate,
        id: colorDelete?.id!,
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
            <Breadcrumb.Item>Màu sắc</Breadcrumb.Item>
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
                  Thêm mới mã màu
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
                    colorDelete,
                    setColorDelete,
                    navigate,
                  )}
                  dataSource={dataRender()}
                  scroll={{ x: "100vw" }}
                  loading={color.list.loading}
                  pagination={{
                    total: color.list.result?.total,
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
        title="Xóa màu"
        okText={"Xóa"}
        cancelText={"Hủy"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        confirmLoading={color.delete.loading}
      >
        <p>
          Bạn có muốn xóa trường này (
          <span style={{ fontWeight: "bold" }}>{colorDelete?.name}</span>)?
        </p>
      </Modal>
    </Fragment>
  );
};

export default Color;
