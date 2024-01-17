/* eslint-disable jsx-a11y/label-has-associated-control */
import { CustomInput, CustomMobileInput } from "@/components/formik";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Button, Card, Col, Form, Input, Radio, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { Field, Formik, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
// import * as Yup from "yup";
// import "antd/dist/antd.css";
import "antd-button-color/dist/css/style.css";

const ShippingForm = ({
  register,
  handleSubmit,
  setValue,
  watch,
  trigger,
  control,
  getValues,
  reset,
  errors,
  isValid,
}) => {
  // const { values } = useFormikContext();
  // const validationSchema = Yup.object().shape({
  //   fullname: Yup.string().required("Vui lòng nhập họ và tên"),
  //   phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
  //   province: Yup.string().required("Vui lòng chọn tỉnh thành phố"),
  //   district: Yup.string().required("Vui lòng chọn quận huyện"),
  //   ward: Yup.string().required("Vui lòng chọn xã phường thị trân"),
  //   address: Yup.string().required("Vui lòng nhập địa chỉ cụ thể"),
  //   note: Yup.string().required("Điền ghi chú"),
  // });

  const [provinceOption, setProvinceOption] = useState();
  const [districtOption, setDistrictOption] = useState();
  const [wardOption, setWardOption] = useState();
  const [districtVisible, setDistrictVisible] = useState(true);
  const [wardVisible, setWardVisible] = useState(true);

  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   watch,
  //   trigger,
  //   control,
  //   getValues,
  //   reset,
  //   formState: { errors, isValid },
  // } = useForm();

  const watchProvince = useWatch({ control, name: "province" });
  const watchDistrict = useWatch({ control, name: "district" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
          .get(
            "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
            {
              headers: {
                token: "264902db-af84-11ee-8586-12380ed2f541",
              },
            }
          )
          .then((response) => {
            const listOption = response.data.data.map((item) => ({
              value: item.ProvinceID,
              label: item.ProvinceName,
            }));
            listOption && setProvinceOption(listOption);
          });
        return response;
      } catch (error) {
        console.error("Error fetching province data:", error);
      }
    };

    fetchData();

    return () => {};
  }, []);

  useEffect(() => {
    if (provinceOption && watchProvince) {
      setDistrictVisible(false);
    }
  }, [watchProvince]);

  useEffect(() => {
    const fetchData = async (province_id) => {
      try {
        const response = await axios
          .get(
            "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
            {
              params: { province_id },
              headers: {
                token: "264902db-af84-11ee-8586-12380ed2f541",
              },
            }
          )
          .then((response) => {
            const listOption = response.data.data.map((item) => ({
              value: item.DistrictID,
              label: item.DistrictName,
            }));
            listOption && setDistrictOption(listOption);
            watchDistrict || (listOption && setWardVisible(false));
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors as needed
      }
    };

    watchProvince && fetchData(watchProvince);

    return () => {};
  }, [watchProvince]);

  useEffect(() => {
    const fetchData = async (district_id) => {
      try {
        const response = await axios
          .get(
            "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
            {
              params: { district_id },
              headers: {
                token: "264902db-af84-11ee-8586-12380ed2f541",
              },
            }
          )
          .then((response) => {
            const listOption = response.data.data.map((item) => ({
              value: item.WardCode,
              label: item.WardName,
            }));
            listOption && setWardOption(listOption);
          });
        return response;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    watchDistrict && fetchData(watchDistrict);

    return () => {};
  }, [watchDistrict]);

  const showBillModal = () => {
    handleSubmit((data) => {
      if (isValid) {
        trigger();
        setBillVisible(true);
      }
    })();
  };

  return (
    <Card>
      <Form
        layout="vertical"
        autoComplete="off"
        // onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={[20, 16]}>
          <Col span={24}>
            <Flex gap={5}>
              <Form.Item
                name="fullname"
                label="Họ và tên"
                labelCol={{ span: 24 }}
                // validateStatus={errors.fullname ? "error" : ""}
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
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
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
                    {errors.province && <span style={{ color: "red" }}>*</span>}
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
                  onChange={(value, option) => {
                    setValue("province", value)
                    setValue("provinceOption", option.label)
                  }}
                  options={provinceOption}
                />
              </Form.Item>
              <Form.Item
                name="district"
                label={
                  <span>
                    Quận/Huyện
                    {errors.district && <span style={{ color: "red" }}>*</span>}
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
                  onChange={(value, option) => {
                    setValue("district", value)
                    setValue("districtOption", option.label)
                  }}
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
                  onChange={(value, option) => {
                    setValue("ward", value) 
                    setValue("wardOption", option.label)
                  }}
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
            <Box mb={2}>
              <Form.Item
                name="note"
                label="Ghi chú"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: "Điền ghi chú" }]}
              >
                <TextArea
                  {...register("note")}
                  onChange={(e) => setValue("note", e.target.value)}
                  rows={4}
                  placeholder="Nhập ghi chú"
                />
              </Form.Item>
            </Box>

            {/* <Button
              // htmlType="submit"
              type="primary"
              // loading={selloff?.create?.loading}
              onClick={showBillModal}
            >
              Hoàn thành
            </Button> */}
          </Col>
        </Row>
      </Form>
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
    </Card>
  );
};

export default ShippingForm;
