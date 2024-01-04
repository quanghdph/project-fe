import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  Avatar,
  Button,
  Card,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import Title from "antd/lib/typography/Title";
import React, { Fragment, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ModalProduct from "./ModalProduct";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { getListCustomer, getListSearchCustomer } from "src/features/customer/action";
import { createAxiosJwt } from "src/helper/axiosInstance";
import TextArea from "antd/lib/input/TextArea";
import { useDebounce } from "use-debounce";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns = (
  setIsModalOpen: (open: boolean) => void,
  productDelete: { id: number; name: string } | undefined,
  setProductDelete: ({ id, name }: { id: number; name: string }) => void,
  navigate: NavigateFunction,
  handleQuantityChange: any,
): ColumnsType<DataType> => [
  {
    title: "#",
    dataIndex: "id",
    ellipsis: true,
    key: "id",
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
          <Image
            width={100}
            height={100}
            src="error"
            fallback="data:image/png;base64,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"
          />
          <Flex direction={"column"} gap={1}>
            <Box style={{ fontWeight: "bold" }}>{product.productName}</Box>
            <Box>{product.productCode}</Box>
            <Box>Thương hiệu: {product.brand?.brandName}</Box>
          </Flex>
        </Flex>
      );
    },
  },
  // {
  //   title: "Số lượng",
  //   dataIndex: "quantity",
  //   key: "quantity",
  //   width: "50px",
  //   render: (_, record) => {
  //     console.log("quantity", record);
  //     return (
  //       <InputNumber
  //         min={1}
  //         value={record.quantity}
  //         defaultValue={1}
  //         onChange={(value) => handleQuantityChange(value, record.key)}
  //       />
  //     );
  //   },
  // },
  {
    title: "Số lượng",
    dataIndex: "renderQuantity",
    ellipsis: true,
    key: "renderQuantity",
  },
  {
    title: "Tổng tiền",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Hành động",
    key: "action",
    render: (_, record) => {
      return (
        <Space size="middle">
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

function OrderDetail(props: any) {
  const { orderCode, cart, setCart } = props;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productDelete, setProductDelete] = useState<{
    id: number;
    name: string;
  }>();
  const [open, setOpen] = useState(false);
  const [customerOption, setCustomerOption] = useState();
  const [currentCustomer, setCurrentCustomer] = useState();
  const [search, setSearch] = useState<string>('')
    const [value] = useDebounce(search, 1000);

  const customer = useAppSelector((state) => state.customer);

  // ** Third party
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  const dataRender = (): any => {
    return cart.map((product, index) => {
      return {
        key: index,
        id: product.id,
        product: {
          productName: product.product.productName,
          productCode: product.product.productCode,
          brand: product.product.brand,
        },
        quantity: product.quantity,
        renderQuantity: (
          <InputNumber
            min={1}
            value={product.quantity}
            onChange={(value) => handleQuantityChange(value, product)}
          />
        ),
      };
    });
    // return [];
  };

  const handleQuantityChange = (value, record) => {
    const updatedCart = cart.map((item) =>
      item.id === record.id ? { ...item, quantity: value } : item,
    );
    setCart(updatedCart);
  };

  const onCustomerChange = (value: string) => {
    if (!customer?.list.loading && customer.list.result?.listCustomer) {
      const currentCustomerSelect = customer.list.result?.listCustomer.filter(
        (e) => value == e.id,
      );
      setCurrentCustomer(currentCustomerSelect[0]);
    }
  };

  const onCustomerSearch = (value: string) => {
    setSearch(value)
  };



  useEffect(() => {
    const fetchData = async () => {
      const fetchFunction = value ? getListSearchCustomer : getListCustomer;

      try {
        const params = value ? { value: value } : {};
        await fetchFunction({
          params,
          navigate,
          axiosClientJwt,
          dispatch,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [value, search]);

  useEffect(() => {
    if (!customer.list.loading && customer.list.result) {
      const listOption = customer.list.result.listCustomer
        ? customer.list.result.listCustomer.map((item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          }))
        : customer.list.result.map((item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          }));
      if (!value) {
        setCustomerOption(listOption);
      } else {
        listOption && setCustomerOption(listOption);
      }
    }
  }, [customer.list.result, customer.list.loading, value]);


  const filterCustomerOption = () => {
    return customerOption;
  };

  return (
    <Fragment>
      <Flex justifyContent={"space-between"} mb={5}>
        <Title level={5}>Đơn hàng {`#${orderCode}`}</Title>
      </Flex>
      <Flex direction={"column"} gap={3}>
        <Table
          title={() => "Giỏ hàng"}
          bordered
          columns={columns(
            setIsModalOpen,
            productDelete,
            setProductDelete,
            navigate,
            handleQuantityChange,
          )}
          dataSource={dataRender()}
          // loading={product.list.loading}
          // pagination={{
          //   total: product.list.result?.total,
          //   showTotal: (total, range) =>
          //     `${range[0]}-${range[1]} of ${total} items`,
          //   onChange: handleOnChangePagination,
          //   onShowSizeChange: handleOnShowSizeChange,
          //   responsive: true,
          // }}
          pagination={false}
          scroll={{ x: true }}
        />
        <Card>
          <Flex justifyContent={"space-between"} mb={3}>
            <Title level={5}>Thông tin khách hàng</Title>
            <Flex gap={2} width={400}>
              <Box flex={1}>
                <Select
                  showSearch
                  placeholder="Tìm kiếm khách hàng"
                  optionFilterProp="children"
                  onChange={onCustomerChange}
                  onSearch={onCustomerSearch}
                  filterOption={filterCustomerOption}
                  style={{ width: "100%" }}
                  options={customerOption}
                />
              </Box>
              <Button type="primary">Thêm mới khách hàng</Button>
            </Flex>
          </Flex>
          {currentCustomer && (
            <Box width={300}>
              <Flex justifyContent={"space-between"}>
                <Text>Tên khách hàng:</Text>
                <Text>
                  {" "}
                  {`${currentCustomer?.firstName} ${currentCustomer?.lastName}`}
                </Text>
              </Flex>
              <Flex justifyContent={"space-between"}>
                <Text>Email:</Text>
                <Text> {currentCustomer?.email}</Text>
              </Flex>
              <Flex justifyContent={"space-between"}>
                <Text>Số điện thoaị:</Text>
                <Text> {currentCustomer?.phoneNumber}</Text>
              </Flex>
            </Box>
          )}
        </Card>

        <Card>
          <Flex justifyContent={"space-between"}>
            <Title level={5}>Thông tin thanh toán</Title>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>Tạm tính:</Text>
            <Text>500.000đ</Text>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>Tổng tiền:</Text>
            <Text>500.000đ</Text>
          </Flex>
          <Box mb={4}>
            <Text>Tiền khách đưa:</Text>
            <InputNumber prefix="VND" style={{ width: "100%" }} />
          </Box>
          <Flex justifyContent={"space-between"}>
            <Text>Tiền thừa:</Text>
            <Text>500.000đ</Text>
          </Flex>
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text>Chọn phương thức thanh toán</Text>
            <Select
              defaultValue="1"
              style={{ width: 220 }}
              onChange={() => {}}
              options={[
                { value: "1", label: "Thanh toán tiền mặt" },
                { value: "2", label: "Chuyển khoản" },
              ]}
            />
          </Flex>
          <Box mb={2}>
            <Text>Ghi chú: </Text>
            <TextArea rows={4} placeholder="Ghi chú" maxLength={6} />
          </Box>

          <Button type="primary">Tạo hóa đơn</Button>
        </Card>
      </Flex>
      <ModalProduct navigate={navigate} setOpen={setOpen} open={open} />
    </Fragment>
  );
}

export default OrderDetail;
