import { Flex } from "@chakra-ui/react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Modal,
  PaginationProps,
  Row,
  Space,
  Table,
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
import type { ColumnsType } from "antd/es/table";
import { deleteMaterial, getListMaterial } from "src/features/catalog/material/action";

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
  materialDelete: { id: number; name: string } | undefined,
  setMaterialDelete: ({ id, name }: { id: number; name: string }) => void,
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
    dataIndex: "material_name",
    ellipsis: true,
    key: "material_name",
    width: "15%",
  },
  {
    title: "Mã chất liệu",
    dataIndex: "material_code",
    ellipsis: true,
    key: "material_code",
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
               setMaterialDelete({
                  ...materialDelete,
                  id: record.id,
                  name: record.material_name,
                });
            }}
          />
        </Space>
      );
    },
  },
];

const Material = () => {
  // ** State
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [filter, setFilter] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [materialDelete, setMaterialDelete] = useState<{
    id: number;
    name: string;
  }>();
  const [refresh, setRefresh] = useState<boolean>(false);

  // ** Variables
  const material = useAppSelector((state) => state.material);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // ** Third party
  const navigate = useNavigate();

  // ** Effect
  useEffect(() => {
    getListMaterial({
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
    if (!material.list.loading && material.list.result) {
      return material.list.result.listMaterials.map((material, index: number) => {
        return {
          key: index,
          id: material.id,
          material_code: material.materialCode,
          material_name: material.materialName,
        };
      });
    }
    return [];
  };

  const handleOk = async () => {
    await deleteMaterial({
        axiosClientJwt,
        dispatch,
        navigate,
        id: materialDelete?.id!,
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
            <Breadcrumb.Item>Chất liệu</Breadcrumb.Item>
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
                  Thêm mới chất liệu
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
                    materialDelete,
                    setMaterialDelete,
                    navigate,
                  )}
                  dataSource={dataRender()}
                  scroll={{ x: "100vw" }}
                  loading={material.list.loading}
                  pagination={{
                    total: material.list.result?.total,
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
        confirmLoading={material.delete.loading}
      >
        <p>
          Bạn có muốn xóa trường này (
          <span style={{ fontWeight: "bold" }}>{materialDelete?.name}</span>)?
        </p>
      </Modal>
    </Fragment>
  );
};

export default Material;
