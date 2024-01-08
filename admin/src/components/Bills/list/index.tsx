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
  deleteBill,
  getListBill,
} from "src/features/sale/bill/action";
import type { ColumnsType } from "antd/es/table";
import { useDebounce } from "use-debounce";
interface DataType {
  key: number;
  id: number;
  bill_name: string;
  bill_code: string;
  description: string;
  active: boolean;
}

const columns = (
  setIsModalOpen: (open: boolean) => void,
  billDelete: { id: number; name: string } | undefined,
  setBillDelete: ({ id, name }: { id: number; name: string }) => void,
  navigate: NavigateFunction,
): ColumnsType<DataType> => [
  {
    title: "#",
    dataIndex: "id",
    ellipsis: true,
    key: "id",
    width: "5%",
    fixed: "left"
  },
  {
    title: "Tên khách hàng",
    dataIndex: "customer_name",
    ellipsis: true,
    key: "customer_name",
    width: "15%",
  },
  {
    title: "Tên nhân viên",
    dataIndex: "employee_name",
    ellipsis: true,
    key: "employee_name",
    width: "15%",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    ellipsis: true,
    key: "phoneNumber",
    width: "15%",
  },
  {
    title: "Phí vận chuyển",
    dataIndex: "transportFee",
    ellipsis: true,
    key: "transportFee",
    width: "15%",
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    ellipsis: true,
    key: "note",
    width: "15%",
  },
  {
    title: 'Hoạt động',
    dataIndex: 'status',
    key: 'status',
    width: '180px',
    render: (status: number) => {
        return (
            <Tag color={status ? 'green' : 'gold'}>{status == 1 ? 'Hoạt động' : 'Vô hiệu hóa'}</Tag>
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
            onClick={() => navigate(`/bills/update/${record.id}`)}
          />
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => {
               setIsModalOpen(true);
               setBillDelete({
                  ...billDelete,
                  id: record.id,
                  name: record.bill_name,
                });
            }}
          />
        </Space>
      );
    },
  },
];

const Bill = () => {
  // ** State
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [filter, setFilter] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [billDelete, setBillDelete] = useState<{
    id: number;
    name: string;
  }>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  // ** Variables
  const bill = useAppSelector((state) => state.bill);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();
  // ** Third party
  const navigate = useNavigate();

  // ** Effect
  useEffect(() => {
    getListBill({
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
    if (!bill.list.loading && bill.list.result) {
      return bill.list.result.listBill.map((bill, index: number) => {
        return {
          key: index,
          id: bill.id,
          customer_name: `${bill.customer.firstName} ${bill.customer.lastName}`,
          employee_name: `${bill.employee.firstName} ${bill.employee.lastName}`,
          phoneNumber: bill.phoneNumber,
          transportFee: bill.transportFee,
          note: bill.note,
          status: bill.status
        };
      });
    }
    return [];
  };

  const handleOk = async () => {
    await deleteBill({
        axiosClientJwt,
        dispatch,
        navigate,
        id: billDelete?.id!,
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
            <Breadcrumb.Item>Hóa đơn</Breadcrumb.Item>
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
                  Thêm mới hóa đơn
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
                    billDelete,
                    setBillDelete,
                    navigate,
                  )}
                  dataSource={dataRender()}
                  scroll={{ x: "100vw" }}
                  loading={bill.list.loading}
                  pagination={{
                    total: bill.list.result?.total,
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
        title="Xóa hóa đơn"
        okText={"Xóa"}
        cancelText={"Hủy"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        confirmLoading={bill.delete.loading}
      >
        <p>
          Bạn có muốn xóa trường này (
          <span style={{ fontWeight: "bold" }}>{billDelete?.name}</span>)?
        </p>
      </Modal>
    </Fragment>
  );
};

export default Bill;
