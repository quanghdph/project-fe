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
  Tabs,
  TabsProps,
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
import { deleteBill, getListBill } from "src/features/sale/bill/action";
import type { ColumnsType } from "antd/es/table";
import { useDebounce } from "use-debounce";
import Title from "antd/lib/skeleton/Title";
import { formatPriceVND } from "src/helper/currencyPrice";
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
    fixed: "left",
  },
  {
    title: "Khách hàng",
    dataIndex: "customer_name",
    ellipsis: true,
    key: "customer_name",
    width: "13%",
  },
  // {
  //   title: "Tên nhân viên",
  //   dataIndex: "employee_name",
  //   ellipsis: true,
  //   key: "employee_name",
  //   width: "15%",
  // },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    ellipsis: true,
    key: "phoneNumber",
    width: "10%",
  },
  {
    title: "Tổng tiền",
    dataIndex: "total",
    ellipsis: true,
    key: "total",
    width: "15%",
  },
  {
    title: "Loại đơn hàng",
    dataIndex: "paymentType",
    ellipsis: true,
    key: "paymentType",
    width: "15%",
  },
  {
    title: "Phí vận chuyển",
    dataIndex: "transportFee",
    ellipsis: true,
    key: "transportFee",
    width: "9%",
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    ellipsis: true,
    key: "note",
    width: "13%",
  },
  {
    title: "Ngày tạo",
    dataIndex: "createDate",
    ellipsis: true,
    key: "createDate",
    width: "13%",
  },
  // {
  //   title: "Hoạt động",
  //   dataIndex: "status",
  //   key: "status",
  //   width: "10%",
  //   render: (status: number) => {
  //     return (
  //       <Tag color={status == 1 ? "green" : "gold"}>
  //         {status == 1 ? "Hoạt động" : "Vô hiệu hóa"}
  //       </Tag>
  //     );
  //   },
  // },
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

const items = (
  setIsModalOpen,
  billDelete,
  setBillDelete,
  navigate,
  dataRender,
  bill,
  handleOnChangePagination,
  handleOnShowSizeChange,
) => [
  {
    key: "1",
    label: "Tất cả",
    children: (
      <Card>
        <Table
          bordered
          columns={columns(setIsModalOpen, billDelete, setBillDelete, navigate)}
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
    ),
  },
  {
    key: "2",
    label: "Chờ thanh toán",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Chờ xử lí",
    children: "Content of Tab Pane 3",
  },
  {
    key: "4",
    label: "Chờ xác thực",
    children: "Content of Tab Pane 3",
  },
  {
    key: "5",
    label: "Đã xác thực",
    children: "Content of Tab Pane 3",
  },
  {
    key: "6",
    label: "Chờ giao hàng",
    children: "Content of Tab Pane 3",
  },
  {
    key: "7",
    label: "Đang giao hàng",
    children: "Content of Tab Pane 3",
  },
  {
    key: "8",
    label: "Đã nhận hàng",
    children: "Content of Tab Pane 3",
  },
  {
    key: "9",
    label: "Đã hoàn thành",
    children: "Content of Tab Pane 3",
  },
  {
    key: "10",
    label: "Đã hủy",
    children: "Content of Tab Pane 3",
  },
];

const Bill = () => {
  // ** State
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [status, setStatus] = useState<number>(-1);
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
        filter,
        status
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
          // employee_name: `${bill.employee.firstName} ${bill.employee.lastName}`,
          phoneNumber: bill.phoneNumber,
          transportFee: formatPriceVND(Number(bill.transportFee)),
          note: bill.note,
          paymentType: bill.paymentType == 1 ? <Tag color="success">Tại quầy</Tag> :  <Tag color="processing">Bán hàng Online</Tag>,
          createDate: bill.createDate,
          // status: bill.status,
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
      message,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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

  const onChange = (key: string) => {
    // console.log(key);
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
            {/* <Col span={24}>
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
            </Col> */}
            <Divider />
            <Col span={24}>
              <Title>Danh sách hóa đơn</Title>
              <Tabs
                defaultActiveKey="1"
                items={items(
                  setIsModalOpen,
                  billDelete,
                  setBillDelete,
                  navigate,
                  dataRender,
                  bill,
                  handleOnChangePagination,
                  handleOnShowSizeChange,
                )}
                onChange={onChange}
              />
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
