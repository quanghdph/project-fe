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
  deleteBrand,
  getListBrand,
} from "src/features/catalog/brand/action";
import type { ColumnsType } from "antd/es/table";
import { useDebounce } from "use-debounce";
interface DataType {
  key: number;
  id: number;
  brand_name: string;
  brand_code: string;
  description: string;
  active: boolean;
}

const columns = (
  setIsModalOpen: (open: boolean) => void,
  brandDelete: { id: number; name: string } | undefined,
  setBrandDelete: ({ id, name }: { id: number; name: string }) => void,
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
    dataIndex: "brand_name",
    ellipsis: true,
    key: "brand_name",
    width: "15%",
  },
  {
    title: "Mã thương hiệu",
    dataIndex: "brand_code",
    ellipsis: true,
    key: "brand_code",
    width: "15%",
  },
  {
    title: 'Hoạt động',
    dataIndex: 'status',
    key: 'status',
    width: '180px',
    render: (status: number) => {
        return (
            <Tag color={status ? 'green' : 'gold'}>{status ? 'Hoạt động' : 'Vô hiệu hóa'}</Tag>
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
               setBrandDelete({
                  ...brandDelete,
                  id: record.id,
                  name: record.brand_name,
                });
            }}
          />
        </Space>
      );
    },
  },
];

const Brand = () => {
  // ** State
  // const [take, setTake] = useState<number>(10)
  // const [skip, setSkip] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [filter, setFilter] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [brandDelete, setBrandDelete] = useState<{
    id: number;
    name: string;
  }>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  // ** Variables
  const brand = useAppSelector((state) => state.brand);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();
  console.log(brand);
  // ** Third party
  const navigate = useNavigate();

  // ** Effect
  useEffect(() => {
    getListBrand({
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
    if (!brand.list.loading && brand.list.result) {
      return brand.list.result.listBrand.map((brand, index: number) => {
        return {
          key: index,
          id: brand.id,
          brand_code: brand.brandCode,
          brand_name: brand.brandName,
          status: brand.status
        };
      });
    }
    return [];
  };

  const handleOk = async () => {
    await deleteBrand({
        axiosClientJwt,
        dispatch,
        navigate,
        id: brandDelete?.id!,
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
            <Breadcrumb.Item>Thương hiệu</Breadcrumb.Item>
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
                  Thêm mới thương hiệu
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
                    brandDelete,
                    setBrandDelete,
                    navigate,
                  )}
                  dataSource={dataRender()}
                  scroll={{ x: "100vw" }}
                  loading={brand.list.loading}
                  pagination={{
                    total: brand.list.result?.total,
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
        title="Xóa thương hiệu"
        okText={"Xóa"}
        cancelText={"Hủy"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        confirmLoading={brand.delete.loading}
      >
        <p>
          Bạn có muốn xóa trường này (
          <span style={{ fontWeight: "bold" }}>{brandDelete?.name}</span>)?
        </p>
      </Modal>
    </Fragment>
  );
};

export default Brand;
