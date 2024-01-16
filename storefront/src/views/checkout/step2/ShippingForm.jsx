/* eslint-disable jsx-a11y/label-has-associated-control */
import { CustomInput, CustomMobileInput } from "@/components/formik";
import { Flex, Text } from "@chakra-ui/react";
import { Col, Form, Input, Row, Select } from "antd";
import { Field, Formik, useFormikContext } from "formik";
import React from "react";
// import * as Yup from "yup";

const ShippingForm = () => {
  const { values } = useFormikContext();
  // const validationSchema = Yup.object().shape({
  //   fullname: Yup.string().required("Vui lòng nhập họ và tên"),
  //   phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
  //   province: Yup.string().required("Vui lòng chọn tỉnh thành phố"),
  //   district: Yup.string().required("Vui lòng chọn quận huyện"),
  //   ward: Yup.string().required("Vui lòng chọn xã phường thị trân"),
  //   address: Yup.string().required("Vui lòng nhập địa chỉ cụ thể"),
  //   note: Yup.string().required("Điền ghi chú"),
  // });

  return (
    <div className="checkout-shipping-wrapper">
      <div className="checkout-shipping-form">
      <Form
            layout="vertical"
            autoComplete="off"
            onFinish={handleSubmit(onSubmit)}
          >
            <Row gutter={[20, 16]}>
              <Col span={12}>
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
                    help={errors.phoneNumber ? errors.phoneNumber.message : ""}
                    style={{ width: "50%" }}
                  >
                    <Input
                      {...register("phoneNumber", {
                        required: "Vui lòng nhập số điện thoại",
                      })}
                      onChange={(e) => setValue("phoneNumber", e.target.value)}
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
                        {errors.ward && <span style={{ color: "red" }}>*</span>}
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
              </Col>
              <Col span={12}>
                <Flex justifyContent={"space-between"}>
                  <Text>Tổng tiền:</Text>
                  <Text>{formatPriceVND(Number(totalAmount))}</Text>
                </Flex>
                <Box mb={4}>
                  <Text>Tiền khách đưa:</Text>
                  <InputNumber prefix="VND" style={{ width: "100%" }} />
                </Box>
                <Flex justifyContent={"space-between"}>
                  <Text>Tiền dư:</Text>
                  <Text>Tự đi mà tính</Text>
                </Flex>
                <Flex direction={"column"} justifyContent={"space-between"}>
                  <Text>Chọn phương thức thanh toán</Text>
                  <Form.Item name="paymentMethod">
                    <Radio.Group
                      size="large"
                      buttonStyle="solid"
                      onChange={(value) =>
                        setValue("paymentMethod", value.target.value)
                      }
                      defaultValue={0}
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
                  </Form.Item>
                </Flex>
                <Box mb={2}>
                  <Form.Item
                    name="note"
                    label="Ghi chú"
                    labelCol={{ span: 24 }}
                    rules={[{ required: true, message: "Điền ghi chú" }]}
                  >
                    <TextArea
                      // {...register("note")}
                      // onChange={onNoteChange}
                      rows={4}
                      placeholder="Nhập ghi chú"
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
              </Col>
            </Row>
          </Form>
      </div>
    </div>
  );
};

export default ShippingForm;
