import { Box, Flex } from "@chakra-ui/react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Input,
  PaginationProps,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  TabsProps,
  Tag,
} from "antd";
import React, { Fragment, useState, useEffect } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { getListOrder } from "src/features/sale/order/action";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/helper/axiosInstance";
import { useDebounce } from "use-debounce";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { currency } from "src/helper/currencyPrice";
import { StatusOrder } from "src/types";
import { Promotion } from "src/types/promotion";
import Title from "antd/lib/typography/Title";
import CreateOrder from "./CreateOrder";
import BillList from "./BillList";
import ProductList from "./ProductList";
import ModalProductDetail from "./ModalProductDetail";
import { getListProduct, getListSearchProduct } from "src/features/catalog/product/actions";
import { getListCustomer } from "src/features/customer/action";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

interface DataType {
  key: number;
  id: number;
  status: string;
  created_date: string;
  modified_date: string;
  total_price: number;
  customer_name: string;
  users_id: number;
  payment_method: string;
  code: string;
  quantity: number;
  price: number;
  origin_price: number;
  promotion: Promotion;
  payment: boolean;
}

const columns = (navigate: NavigateFunction): ColumnsType<DataType> => [
  // {
  //     title: 'Mã đơn hàng',
  //     ellipsis: true,
  //     dataIndex: 'code',
  //     key: 'code',
  //     width: '15%',
  //     fixed: 'left'
  // },
  // {
  //     title: 'Khách hàng',
  //     dataIndex: 'customer_name',
  //     ellipsis: true,
  //     width: '15%',
  //     key: 'customer_name',
  //     render: (customer_name: string, record) => {
  //         return (
  //             <Flex alignItems={"center"}>
  //                 <UserOutlined />
  //                 <Link to={`/customers/update/${record.users_id}`} style={{ marginLeft: "5px" }}>{customer_name}</Link>
  //             </Flex>
  //         )
  //     }
  // },
  // {
  //     title: 'Trạng thái',
  //     dataIndex: 'status',
  //     ellipsis: true,
  //     key: 'status',
  //     width: '100px',
  //     render: (status: string) => {
  //         return (
  //             <span>
  //                 {(() => {
  //                     switch (status) {
  //                         case StatusOrder.Confirm:
  //                             return <Tag color="cyan">Xác nhận</Tag>
  //                         case StatusOrder.Shipped:
  //                             return <Tag color="orange">Đang vận chuyển</Tag>
  //                         case StatusOrder.Completed:
  //                             return <Tag color="green">Hoàn thành</Tag>
  //                         case StatusOrder.Cancel:
  //                             return <Tag color="red">Hủy</Tag>
  //                         case StatusOrder.Refund:
  //                             return <Tag color="magenta">Hoàn trả</Tag>
  //                         default:
  //                             return <Tag color="blue">Mở</Tag>
  //                     }
  //                 })()}
  //             </span>
  //         )
  //     }
  // },
  // {
  //     title: 'Giá gốc',
  //     dataIndex: 'origin_price',
  //     ellipsis: true,
  //     key: 'origin_price',
  //     width: '150px',
  //     render: (origin_price: number) => {
  //         return (
  //             <span>{currency(origin_price)}</span>
  //         )
  //     }
  // },
  // {
  //     title: 'Giá bán',
  //     dataIndex: 'price',
  //     ellipsis: true,
  //     key: 'price',
  //     width: '100px',
  //     render: (price: number) => {
  //         return (
  //             <span>{currency(price)}</span>
  //         )
  //     }
  // },
  // {
  //     title: 'Số lượng',
  //     dataIndex: 'quantity',
  //     ellipsis: true,
  //     key: 'quantity',
  //     width: '100px',
  //     render: (quantity: number) => {
  //         return (
  //             <span>{quantity}</span>
  //         )
  //     }
  // },
  // {
  //     title: 'Tổng giá',
  //     dataIndex: 'total_price',
  //     ellipsis: true,
  //     key: 'total_price',
  //     width: '100px',
  //     render: (total_price: number) => {
  //         return (
  //             <span>{currency(total_price)}</span>
  //         )
  //     }
  // },
  // {
  //     title: 'Lợi nhuận',
  //     ellipsis: true,
  //     key: 'profit',
  //     width: '100px',
  //     render: (_, record) => {
  //         return (
  //             <span style={{ color: record.payment ? 'green' : 'red' }}>+{currency((record.total_price - (record.origin_price * record.quantity)))}</span>
  //         )
  //     }
  // },
  // {
  //     title: 'Phương thức thanh toán',
  //     dataIndex: 'payment_method',
  //     ellipsis: true,
  //     key: 'payment_method',
  //     width: '100px',
  //     render: (payment_method: string) => {
  //         return (
  //             <span>
  //                 <Tag>{payment_method === 'Standard' ? "Thanh toán thường" : "Paypal"}</Tag>
  //             </span>
  //         )
  //     }
  // },
  {
    title: "Mã đơn hàng",
    ellipsis: true,
    dataIndex: "code",
    key: "code",
    width: "15%",
    fixed: "left",
  },
  {
    title: "Hành động",
    key: "action",
    width: "100px",
    fixed: "right",
    render: (_, record) => {
      return (
        <Space size="middle">
          <Button
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate(`detail/${record.id}`)}
          >
            Xem chi tiết
          </Button>
        </Space>
      );
    },
  },
];

const Orders = () => {
  // ** State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [value] = useDebounce(search, 1000);
  const [status, setStatus] = useState<string>("all");

  const [cart, setCart] = useState([]);

  // ** Third party
  const navigate = useNavigate();

  // ** Variables
  const order = useAppSelector((state) => state.order);
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
  }, [page, limit, value, refresh]);

  useEffect(() => {
    getListCustomer({
      params: {},
      navigate,
      axiosClientJwt,
      dispatch,
  })
  })

  // ** Function handle
  const handleOnChangePagination = (e: number) => {
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

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tạo mới",
      children: <CreateOrder />,
    },
    {
      key: "2",
      label: "Danh sách hóa đơn",
      children: <BillList />,
    },
  ];

  return (
    <Fragment>
      <Row gutter={[10, 16]}>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Card>
                <Title level={5}>Quản lý đơn hàng</Title>
              </Card>
            </Col>

          </Row>
        </Col>
        <Col span={12}>
          <Card>
            <Flex justifyContent={"space-between"} mb={5}>
              <Title level={5}>Sản phẩm</Title>
              <Box  flexBasis={"40%"}>
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm theo tên"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </Box>
            </Flex>
            <ProductList navigate={navigate} cart={cart} setCart={setCart} setPage={setPage} setLimit={setLimit}  />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Title level={5}></Title>
            <CreateOrder cart={cart} setCart={setCart} />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Orders;
