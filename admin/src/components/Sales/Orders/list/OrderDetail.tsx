import {
  DeleteOutlined,
  EditOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  Avatar,
  Button,
  Card,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import Title from "antd/lib/typography/Title";
import React, { Fragment, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ModalProduct from "./ModalProduct";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  createCustomerFast,
  getListCustomer,
  getListSearchCustomer,
  getListSearchPhoneNumberCustomer,
} from "src/features/customer/action";
import { createAxiosJwt } from "src/helper/axiosInstance";
import TextArea from "antd/lib/input/TextArea";
import { useDebounce } from "use-debounce";
import { Controller, useForm } from "react-hook-form";
import {
  caculateSelloff,
  createSelloff,
} from "src/features/sale/saleoff/action";
import { Inotification } from "src/common";
import ModalCreateCustomer from "./ModalCreateCustomer";
import { formatPriceVND } from "src/helper/currencyPrice";
import ModalCreateBill from "./ModalCreateBill";
import vnpayLogo from "src/assets/Icon-VNPAY.webp";
import moneyLogo from "src/assets/money.png";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns = (
  cart: any,
  setCart: any,
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
    width: "70%",
    render: (product, record) => {
      return (
        <Flex justifyContent={"flex-start"} gap={4}>
          {/* <Avatar src={<img src={record.url} style={{ width: 40 }} />} /> */}

          <Image
            width={150}
            height={100}
            onError={(e) => {
              e.target.src =
                "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg";
            }}
            preview={false}
            src={`${import.meta.env.VITE_BACKEND_URL}/product/${
              record.id
            }/image-main`}
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
  {
    title: "Số lượng",
    dataIndex: "renderQuantity",
    ellipsis: true,
    key: "renderQuantity",
  },
  {
    title: "Số lượng tồn kho",
    dataIndex: "inventory",
    ellipsis: true,
    key: "inventory",
  },
  {
    title: "Biến thể",
    dataIndex: "variant",
    ellipsis: true,
    key: "variant",
  },
  {
    title: "Đơn giá",
    dataIndex: "price",
    key: "price",
    render: (price, record) => {
      return <Box>{price}</Box>;
    },
  },
  {
    title: "Tổng tiền",
    dataIndex: "total",
    key: "total",
    render: (total, record) => {
      return <Box>{total}</Box>;
    },
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
              const updatedCartData = cart.filter(
                (product) => product.id !== record.id,
              );
              // Update the cart data
              setCart(updatedCartData);
              Inotification({
                type: "success",
                message: "Xóa khỏi giỏ thành công!",
              });
            }}
          />
        </Space>
      );
    },
  },
];

function OrderDetail(props: any) {
  const { orderCode, cart, setCart, setCustomerSelect, currentTab } = props;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productDelete, setProductDelete] = useState<{
    id: number;
    name: string;
  }>();
  const [open, setOpen] = useState(false);
  const [customerOption, setCustomerOption] = useState();
  const [currentCustomer, setCurrentCustomer] = useState();
  const [search, setSearch] = useState<string>("");
  const [value] = useDebounce(search, 1000);
  const [totalAmount, setTotalAmount] = useState();
  const [visible, setVisible] = useState(false);
  const [billVisible, setBillVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    register,
    reset,
    trigger,
    formState: { errors },
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      paymentMethod: 0,
    },
  });

  const customer = useAppSelector((state) => state.customer);
  const selloff = useAppSelector((state) => state.selloff);

  // ** Third party
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  const dataRender = (): any => {
    return cart
      .map((data: any, index: any) => {
        const { items, id } = data;

        // Check if the currentTab matches the cart item id and if there are items
        if (id === currentTab && items && items.length > 0) {
          // Use map to transform each product item
          return items.map((product) => ({
            key: index,
            id: product.id,
            product: {
              productName: product.product.productName,
              productCode: product.product.productCode,
              brand: product.product.brand,
            },
            quantity: product.cartQuantity,
            total: formatPriceVND(product.price * product.cartQuantity),
            price: formatPriceVND(product.price),
            renderQuantity: (
              <InputNumber
                min={1}
                max={product.quantity}
                formatter={(value) =>
                  value ? String(value).replace(/\D/g, "") : ""
                }
                parser={(value) => (value ? parseInt(value, 10) : undefined)}
                value={product.cartQuantity}
                onChange={(value) => handleQuantityChange(value, product)}
                precision={0} // Set precision to 0 for integers
              />
            ),
            inventory: product.quantity,
            variant: `${product?.color?.colorName} - ${product?.size?.sizeName}`,
          }));
        }

        // If the conditions are not met, return an empty array
        return [];
      })
      .flat(); // Use flat() to flatten the nested arrays
  };

  const handleQuantityChange = (value, record) => {
    // const updatedCart = cart.map((item) =>
    //   item.id === record.id ? { ...item, cartQuantity: value } : item,
    // );
    // setCart(updatedCart);
    const cartIndex = cart.findIndex((item) => item.id === currentTab);
    // If the cart item is found, update its items array by adding a new item
    if (cartIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[cartIndex] = {
        ...updatedCart[cartIndex],
        // items: [
        //   ...updatedCart[cartIndex].items,
        //   { ...productVariant, cartQuantity: 1 },
        // ],
        items: updatedCart[cartIndex].items.map((item) =>
          item.id === record.id ? { ...item, cartQuantity: value } : item,
        ),
      };
      setCart(updatedCart);
    }
  };
  const onCustomerChange = (value: string) => {
    if (!customer?.list?.loading && customer.list.result?.listCustomer) {
      const currentCustomerSelect = customer.list.result?.listCustomer.filter(
        (e) => value == e.id,
      );
      setCustomerSelect(currentCustomerSelect[0]);
      setValue("customer", currentCustomerSelect[0]);
      setCurrentCustomer(currentCustomerSelect[0]);
    }
  };

  const onCustomerSearch = (value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchFunction = value
        ? getListSearchPhoneNumberCustomer
        : getListCustomer;

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
    if (!customer?.list?.loading && customer?.list?.result) {
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

  const filterCustomerOption = (): any => {
    return customerOption;
  };

  const onSubmit = (data) => {
    // Handle the form data here
    const cartArr = cart.map((item) => {
      return {
        id: item.id,
        quantity: item.cartQuantity,
      };
    });

    createSelloff({
      params: {
        idKhachHang: data.customer.id,
        thanhToan: data.paymentMethod,
        trangThaiTT: 1,
        note: data.note,
        sanPhams: cartArr ? cartArr : [],
      },
      dispatch,
      axiosClientJwt,
      navigate,
      message,
    }).then((data) => {
      setTimeout(() => {
        setValue("note", null);
        setTotalAmount(0);
        setValue("customer", null);
      }, 1000);
    });
  };

  const onNoteChange = (e) => {
    const value = e.target.value;
    setValue("note", value);
  };

  //  useEffect(() => {
  //   const formData = watch(["note", "paymentMethod", "customer"]);
  //   console.log(formData);
  //  }, [watch])

  // const formDataBefore = watch(["note", "paymentMethod", "customer"]);

  // useEffect(() => {
  //   const cartArr = cart.map((item) => {
  //     return {
  //       id: item.id,
  //       quantity: item.quantity,
  //     };
  //   });

  //   cartArr.length > 0 &&
  //     formDataBefore[2] &&
  //     formDataBefore[0] &&
  //     formDataBefore[1] &&
  //     caculateSelloff({
  //       params: {
  //         idKhachHang: formDataBefore[2]?.customer.id,
  //         thanhToan: formDataBefore[1],
  //         trangThaiTT: 1,
  //         note: formDataBefore[0],
  //         sanPhams: cartArr ? cartArr : [],
  //       },
  //       dispatch,
  //       axiosClientJwt,
  //       navigate,
  //       message,
  //     });
  // }, [formDataBefore]);

  const updateTotalAmount = (updatedCart) => {
    const newTotalAmount = updatedCart.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0,
    );
    setTotalAmount(newTotalAmount);
  };

  useEffect(() => {
    updateTotalAmount(cart);
  }, [cart, setCart]);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCreate = (values) => {
    // Handle the creation of the customer with the form values
    const { email, firstName, lastName, gender, phoneNumber } = values;
    createCustomerFast({
      customer: {
        email,
        firstName,
        lastName,
        gender,
        phoneNumber,
      },
      dispatch,
      axiosClientJwt,
      navigate,
      message,
    });
    setVisible(false);
  };

  const showBillModal = () => {
    trigger();
    setBillVisible(true);
  };

  const handleBillCancel = () => {
    setBillVisible(false);
  };

  const handleBillOk = (values) => {
    trigger().then((isValid) => {
      if (isValid) {
        // If form is valid, you can access the form data here
        const formData = getValues();

        const cartArr = cart.map((item) => {
          return {
            id: item.id,
            quantity: item.cartQuantity,
          };
        });

        formData &&
          createSelloff({
            params: {
              idKhachHang: formData.customer.id,
              thanhToan: formData.paymentMethod,
              trangThaiTT: 1,
              note: formData.note,
              sanPhams: cartArr ? cartArr : [],
            },
            dispatch,
            axiosClientJwt,
            navigate,
            message,
          });
      }
    });
    setBillVisible(false);
  };

  return (
    <Fragment>
      <Form
        // onFinish={handleSubmit(onSubmit)}
        // onFinish={(data) => console.log('Form data in Form component:', data)}
        layout="vertical"
        autoComplete="off"
      >
        <Flex justifyContent={"space-between"} mb={5}>
          <Title level={5}>Đơn hàng {`#${orderCode}`}</Title>
        </Flex>
        <Flex direction={"column"} gap={3}>
          <Table
            title={() => "Giỏ hàng"}
            bordered
            columns={columns(
              cart,
              setCart,
              setIsModalOpen,
              productDelete,
              setProductDelete,
              navigate,
              handleQuantityChange,
            )}
            dataSource={dataRender()}
            // loading={product.list.loading}
            pagination={false}
            scroll={{ x: true }}
          />

          <Card>
            <Flex direction={"column"} justifyContent={"space-between"} mb={3}>
              <Title level={5}>Thông tin khách hàng</Title>
              <Flex gap={2} width={400}>
                <Box flex={1}>
                  <Form.Item name="customer">
                    <Controller
                      name="customer"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => {
                        return (
                          <div>
                            <Select
                              showSearch
                              placeholder="Tìm kiếm khách hàng theo sdt"
                              optionFilterProp="children"
                              loading={customer.list.loading}
                              onChange={onCustomerChange}
                              onSearch={onCustomerSearch}
                              filterOption={filterCustomerOption}
                              style={{ width: "100%" }}
                              options={customerOption}
                            />
                          </div>
                        );
                      }}
                    />
                  </Form.Item>
                </Box>
                <Button type="primary" onClick={showModal}>
                  Thêm mới khách hàng
                </Button>
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

          {/* {cart.length > 0 && (
            <Card>
              <Flex justifyContent={"space-between"}>
                <Title level={5}>Thông tin thanh toán</Title>
              </Flex>
              <Flex justifyContent={"space-between"}>
                <Text>Tổng tiền:</Text>
                <Text>{formatPriceVND(totalAmount)}</Text>
              </Flex>
              <Box mb={4}>
                <Text>Tiền khách đưa:</Text>
                <InputNumber prefix="VND" style={{ width: "100%" }} />
              </Box>
              <Flex justifyContent={"space-between"}>
                <Text>Tiền dư:</Text>
                <Text>500.000đ</Text>
              </Flex>
              <Flex direction={"column"} justifyContent={"space-between"}>
                <Text>Chọn phương thức thanh toán</Text>
                <Form.Item name="paymentMethod" >
                  <Radio.Group
                    size="large"
                    buttonStyle="solid"
                    onChange={(value) => setValue("paymentMethod", value.target.value)}
                    defaultValue={0}
                  >
                    <Radio.Button value="0" checked>
                    <Image src={moneyLogo} width={20} height={20} preview={false} />
                     Tiền mặt
                    </Radio.Button>
                    <Radio.Button value="1" >
                      <Image src={vnpayLogo} width={20} height={20} preview={false} />
                      Chuyển khoản
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Flex>
              <Box mb={2}>
                <Form.Item
                  name="note"
                  label="Ghi chú"
                  rules={[{ required: true, message: "Điền ghi chú" }]}
                >
                  <TextArea
                    {...register("note")}
                    onChange={onNoteChange}
                    rows={4}
                    placeholder="Ghi chú"
                  />
                </Form.Item>
              </Box>

              <Button
                // htmlType="submit"
                type="primary"
                // loading={selloff?.create?.loading}
                onClick={showBillModal}
              >
                Hoàn thành
              </Button>
            </Card>
          )} */}
        </Flex>
      </Form>
      {/* <ModalProduct navigate={navigate} setOpen={setOpen} open={open} /> */}
      <ModalCreateCustomer
        visible={visible}
        onCreate={handleCreate}
        onCancel={handleCancel}
      />
      {/* <Modal
        open={billVisible}
        title="Hóa đơn"
        okText="Đồng ý"
        cancelText="Hủy"
        onOk={handleBillOk}
        onCancel={handleBillCancel}
      >
        <p>Bạn có muốn thanh toán hóa đơn không?</p>
      </Modal> */}
    </Fragment>
  );
}

export default OrderDetail;
