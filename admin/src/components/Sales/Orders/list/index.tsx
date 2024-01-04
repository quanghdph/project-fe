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
import {
  getListProduct,
  getListSearchProduct,
} from "src/features/catalog/product/actions";
import { getListCustomer, getListSearchCustomer } from "src/features/customer/action";

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
              <Box flexBasis={"40%"}>
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm theo tên"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </Box>
            </Flex>
            <ProductList
              navigate={navigate}
              cart={cart}
              setCart={setCart}
              setPage={setPage}
              setLimit={setLimit}
            />
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
