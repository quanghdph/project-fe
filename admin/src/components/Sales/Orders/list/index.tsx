import { Box, CardHeader, Flex, Text } from "@chakra-ui/react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  PaginationProps,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  TabsProps,
  Tag,
  message,
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
import { currency, formatPriceVND } from "src/helper/currencyPrice";
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
import vnpayLogo from "src/assets/Icon-VNPAY.webp";
import moneyLogo from "src/assets/money.png";
import TextArea from "antd/lib/input/TextArea";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  getDistrictAddress,
  getProvinceAddress,
  getWardAddress,
} from "src/features/address/action";
import { createSelloff } from "src/features/sale/saleoff/action";
import { createCheckout } from "src/features/sale/checkout/action";

const Orders = () => {
  // ** State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [filter, setFilter] = useState("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [value] = useDebounce(search, 1000);
  const [status, setStatus] = useState<string>("all");
  const [provinceOption, setProvinceOption] = useState();
  const [districtOption, setDistrictOption] = useState();
  const [wardOption, setWardOption] = useState();
  const [billVisible, setBillVisible] = useState(false);
  const [districtVisible, setDistrictVisible] = useState(true);
  const [wardVisible, setWardVisible] = useState(true);
  const [totalAmount, setTotalAmount] = useState();
  const [delivery, setDelivery] = useState(false);
  const [customerSelect, setCustomerSelect] = useState();
  const [tempPrice, setTempPrice] = useState();
  const [surplusMoney, setSurplusMoney] = useState();

  const [cart, setCart] = useState([
    { id: 1, items: [] },
    { id: 2, items: [] },
    { id: 3, items: [] },
    { id: 4, items: [] },
    { id: 5, items: [] },
  ]);
  const [orderList, setOrderList] = useState([]);
  const [currentTab, setCurrentTab] = useState(1);

  // ** Third party
  const navigate = useNavigate();

  // ** Variables
  const order = useAppSelector((state) => state.order);
  const address = useAppSelector((state) => state.address);
  const selloff = useAppSelector((state) => state.selloff);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    control,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm();

  const watchProvince = useWatch({ control, name: "province" });
  const watchDistrict = useWatch({ control, name: "district" });

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
  }, [page, limit, value]);

  // ** Function handle
  const handleOnChangePagination = (e: number) => {
    setPage(e);
  };

  const onChangeStatus = (value: string) => {
    setStatus(value);
  };

  useEffect(() => {
    getProvinceAddress({ dispatch });
  }, []);

  useEffect(() => {
    if (address.province.result && !address.province.loading) {
      const listOption = address.province.result.map((item) => ({
        value: item.ProvinceID,
        label: item.ProvinceName,
      }));
      setProvinceOption(listOption);
    }
  }, [address.province.result, address.province.loading]);

  // const watchProvince = watch("province");

  useEffect(() => {
    if (watchProvince) {
      getDistrictAddress({
        province_id: watchProvince,
        dispatch,
      });
    }
  }, [watchProvince]);

  useEffect(() => {
    if (watchProvince && address.district.result && !address.district.loading) {
      const listOption = address.district.result.map((item) => ({
        value: item.DistrictID,
        label: item.DistrictName,
      }));
      setDistrictOption(listOption);
      setDistrictVisible(false);
    }
  }, [watchProvince, address.district.result, address.district.loading]);

  // const watchDistrict = watch("district");

  useEffect(() => {
    if (watchDistrict) {
      getWardAddress({
        district_id: watchDistrict,
        dispatch,
      });
    }
  }, [watchDistrict]);

  useEffect(() => {
    if (watchDistrict && address.ward.result && !address.ward.loading) {
      const listOption = address.ward.result.map((item) => ({
        value: item.WardCode,
        label: item.WardName,
      }));
      setWardOption(listOption);
      setWardVisible(false);
    }
  }, [watchDistrict, address.ward.result, address.ward.loading]);

  const onSubmit = (data) => {
    console.log("Submitted data:", data);
    // Add your form submission logic here
  };

  const showBillModal = () => {
    handleSubmit((data) => {
      // If the form is valid, show the modal
      if (isValid) {
        trigger();
        setBillVisible(true);
      }
    })();
  };

  const handleBillCancel = () => {
    setBillVisible(false);
  };

  const handleBillOk = (values) => {
    trigger().then((isValid) => {
      if (isValid && customerSelect) {
        // If form is valid, you can access the form data here
        const formData = getValues();

        const findCart: any = cart.find(item => item.id == currentTab)

        const cartArr = findCart && findCart.items.map((item) => {
          return {
            id: item.id,
            quantity: item.cartQuantity,
          };
        }).flat();

        console.log(cartArr);

        formData &&
          createSelloff({
            params: {
              idKhachHang: customerSelect.id,
              thanhToan: Number(formData.paymentMethod),
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

  const updateTotalAmount = (updatedCart) => {
    const newTotalAmount = updatedCart.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0,
    );
    setTotalAmount(newTotalAmount);
  };

  useEffect(() => {
    if(cart) {
      cart.map(item => item.id == currentTab && updateTotalAmount(item.items))
    }
    
  }, [cart, setCart]);

  const onDelivery = () => {
    setDelivery(!delivery);
  };

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (
      !selloff?.create?.loading &&
      selloff?.create?.result &&
      paymentMethod == 1
    ) {
      createCheckout({
        billID: selloff.create.result,
        dispatch,
        axiosClientJwt,
      });
    }
  }, [selloff.create.loading, selloff.create.result]);

  useEffect(() => {
    if (tempPrice && totalAmount) {
      const result = tempPrice - totalAmount;
      setSurplusMoney(result);
    }
  }, [tempPrice, totalAmount]);

      // validate 
      const validateNoWhiteSpace = (value) => {
        const regexLeadingWhitespace = /^\s/;
        const regexTrailingWhitespace = /\s$/;
        const maxLength =50;
        if (regexLeadingWhitespace.test(value)) {
          return "Không được chứa khoảng trắng ở đầu!";
        } else if (regexTrailingWhitespace.test(value)) {
          return "Không được chứa khoảng trắng ở cuối!";
        }else if(value.length > maxLength) {
           return `Độ dài không được vượt quá ${maxLength} kí tự`;
        }
        return true;
      };

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
              page={limit}
              orderList={orderList}
              currentTab={currentTab}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Title level={5}></Title>
            <CreateOrder
              cart={cart}
              setCart={setCart}
              setCustomerSelect={setCustomerSelect}
              setOrderList={setOrderList}
              setCurrentTab={setCurrentTab}
              currentTab={currentTab}
            />
          </Card>
        </Col>
      </Row>
      <Col span="24" style={{ marginTop: 10 }}>
        <Card>
          <Form
            layout="vertical"
            autoComplete="off"
            onFinish={handleSubmit(onSubmit)}
          >
            <Row gutter={[20, 16]}>
              <Col span={12}>
                {/* {delivery && (
                  <>
                    <Title level={5}>Thông tin thanh toán</Title>
                    <Flex gap={5}>
                      <Form.Item
                        name="fullname"
                        label="Họ và tên"
                        labelCol={{ span: 24 }}
                        validateStatus={errors.fullname ? "error" : ""}
                        help={errors.fullname ? errors.fullname.message : ""}
                        style={{ width: "50%" }}
                      >
                        <Input
                          {...register("fullname", {
                            required: "Vui lòng nhập họ và tên",
                          })}
                          onChange={(e) => setValue("fullname", e.target.value)}
                          placeholder="Nguyễn Văn A"
                        />
                      </Form.Item>

                      <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                        labelCol={{ span: 24 }}
                        validateStatus={errors.phoneNumber ? "error" : ""}
                        help={
                          errors.phoneNumber ? errors.phoneNumber.message : ""
                        }
                        style={{ width: "50%" }}
                      >
                        <Input
                          {...register("phoneNumber", {
                            required: "Vui lòng nhập số điện thoại",
                          })}
                          onChange={(e) =>
                            setValue("phoneNumber", e.target.value)
                          }
                          placeholder="0932384746"
                        />
                      </Form.Item>
                    </Flex>
                    <Flex gap={3}>
                      <Form.Item
                        name="province"
                        label={
                          <span>
                            Tỉnh/thành phố
                            {errors.province && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          </span>
                        }
                        labelCol={{ span: 24 }}
                        validateStatus={errors.province ? "error" : ""}
                        help={errors.province ? errors.province.message : ""}
                        style={{ width: "31.7%" }}
                      >
                        <Select
                          placeholder="Chọn tỉnh thành phố"
                          {...register("province", {
                            required: "Vui lòng chọn tỉnh thành phố",
                          })}
                          onChange={(value: any) => setValue("province", value)}
                          options={provinceOption}
                        />
                      </Form.Item>
                      <Form.Item
                        name="district"
                        label={
                          <span>
                            Quận/Huyện
                            {errors.district && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          </span>
                        }
                        labelCol={{ span: 24 }}
                        validateStatus={errors.district ? "error" : ""}
                        help={errors.district ? errors.district.message : ""}
                        style={{ width: "31.7%" }}
                      >
                        <Select
                          placeholder="Chọn quận huyện"
                          {...register("district", {
                            required: "Vui lòng chọn quận huyện",
                          })}
                          disabled={districtVisible}
                          onChange={(value: any) => setValue("district", value)}
                          options={districtOption}
                        />
                      </Form.Item>
                      <Form.Item
                        name="ward"
                        label={
                          <span>
                            Xã/Phường/Thị Trấn
                            {errors.ward && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          </span>
                        }
                        labelCol={{ span: 24 }}
                        validateStatus={errors.ward ? "error" : ""}
                        help={errors.ward ? errors.ward.message : ""}
                        style={{ width: "31.7%" }}
                      >
                        <Select
                          placeholder="Chọn xã phường thị trân"
                          {...register("ward", {
                            required: "Vui lòng chọn xã phường thị trân",
                          })}
                          onChange={(value: any) => setValue("ward", value)}
                          disabled={wardVisible}
                          options={wardOption}
                        />
                      </Form.Item>
                    </Flex>
                    <Form.Item
                      name="address"
                      label="Địa chỉ cụ thể"
                      labelCol={{ span: 24 }}
                      validateStatus={errors.address ? "error" : ""}
                      help={errors.address ? errors.address.message : ""}
                      style={{ width: "50%" }}
                    >
                      <Input
                        {...register("address", {
                          required: "Vui lòng nhập địa chỉ cụ thể",
                        })}
                        onChange={(e) => setValue("address", e.target.value)}
                        placeholder="Số nhà 20,.."
                      />
                    </Form.Item>
                  </>
                )} */}
              </Col>
              <Col span={12}>
                {/* <Flex gap={2}>
                  <Switch checked={delivery} onChange={onDelivery} />
                  <Text>Giao hàng</Text>
                </Flex> */}
                <Flex justifyContent={"space-between"}>
                  <Text>Tổng tiền:</Text>
                  <Text>{formatPriceVND(Number(totalAmount))}</Text>
                </Flex>
                {paymentMethod == 0 && (
                  <>
                    <Box mb={4}>
                      <Text>Tiền khách đưa:</Text>
                      <InputNumber
                        onChange={(e) => setTempPrice(e)}
                        prefix="VND"
                        style={{ width: "100%" }}
                      />
                    </Box>
                    <Flex justifyContent={"space-between"}>
                      <Text>Tiền dư:</Text>
                      <Text>
                        {surplusMoney
                          ? formatPriceVND(Number(surplusMoney))
                          : surplusMoney > 0
                          ? `Số tiền phải lớn hơn tổng tiền`
                          : null}
                      </Text>
                    </Flex>
                  </>
                )}

                <Flex direction={"column"} justifyContent={"space-between"}>
                  <Text>Chọn phương thức thanh toán</Text>
                  <Form.Item name="paymentMethod">
                    <Controller
                      name="paymentMethod"
                      control={control}
                      defaultValue="0" // Set default value if needed
                      render={({ field }) => (
                        <Radio.Group
                          size="large"
                          buttonStyle="solid"
                          defaultValue="0"
                          onChange={(e) => {
                            setValue("paymentMethod", e.target.value);
                          }}
                        >
                          <Radio.Button value="0" checked>
                            <Image
                              src={moneyLogo}
                              width={20}
                              height={20}
                              preview={false}
                            />
                            Tiền mặt
                          </Radio.Button>
                          <Radio.Button value="1">
                            <Image
                              src={vnpayLogo}
                              width={20}
                              height={20}
                              preview={false}
                            />
                            Chuyển khoản
                          </Radio.Button>
                        </Radio.Group>
                      )}
                    />
                  </Form.Item>
                </Flex>

                <Form.Item
                  name="note"
                  label="Ghi chú"
                >
                  <Controller
                    name="note"
                    control={control}
                    rules={{ 
                      validate: validateNoWhiteSpace
                    }}
                    render={({ field }) => {
                      return (
                        <div>
                          <TextArea
                            {...register("note",  { maxLength: 50 })}
                            onChange={(e) => setValue("note", e.target.value)}
                            rows={4}
                            placeholder="Nhập ghi chú"
                          />
                              {errors?.note ? <Box as="div" mt={1} textColor="red.600">{errors.note?.message}</Box> : null}
                        </div>
                      );
                    }}
                  />
                </Form.Item>

                <Button
                  // htmlType="submit"
                  type="primary"
                  // loading={selloff?.create?.loading}
                  onClick={showBillModal}
                >
                  Hoàn thành
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
      <Modal
        open={billVisible}
        title="Hóa đơn"
        okText="Đồng ý"
        cancelText="Hủy"
        onOk={handleBillOk}
        onCancel={handleBillCancel}
      >
        <p>Bạn có muốn thanh toán hóa đơn không?</p>
      </Modal>
    </Fragment>
  );
};

export default Orders;
