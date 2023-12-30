import { Box, Flex } from "@chakra-ui/react";
import autoAnimate from "@formkit/auto-animate";
import {
  Breadcrumb,
  Card,
  Col,
  Divider,
  Row,
  Switch,
  Form,
  Button,
  Input,
  message,
  Select,
} from "antd";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  createBrand,
  getBrand,
  updateBrand,
} from "src/features/catalog/brand/action";
import { createAxiosJwt } from "src/helper/axiosInstance";

export type FormValuesBrand = {
  brand_name: string;
  brand_code: string;
  brand_status: {
    label: string;
    value: number;
  };
};

const BrandCreateUpdate = () => {
  // ** State
  const [status, setStatus] = useState({ label: "Hoạt động", value: 1 });

  // ** Third party
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValuesBrand>({
    defaultValues: {
      brand_name: "",
      brand_code: "",
      brand_status: { label: "Hoạt động", value: 1 },
    },
  });

  // ** Ref
  const brandNameErrorRef = useRef(null);
  const brandCodeErrorRef = useRef(null);
  const brandStatusErrorRef = useRef(null);

  // ** Variables
  const brand = useAppSelector((state) => state.brand);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // ** Effect
  useEffect(() => {
    brandNameErrorRef.current && autoAnimate(brandNameErrorRef.current);
    brandCodeErrorRef.current && autoAnimate(brandCodeErrorRef.current);
    brandStatusErrorRef.current &&
      autoAnimate(brandStatusErrorRef.current);
  }, [parent]);

  useEffect(() => {
    if (id) {
      getBrand({
        axiosClientJwt,
        dispatch,
        id: +id,
        navigate,
      });
    }
  }, [id]);

  useEffect(() => {
    if (id && !brand.single.loading && brand.single.result) {
      setValue("brand_code", brand.single.result.brandCode);
      setValue("brand_name", brand.single.result.brandName);
      setStatus({
        label: brand.single.result.status == 1  ? "Hoạt động": "Vô hiệu hóa",
        value: brand.single.result.status
      })
    }
  }, [id, brand.single.loading, brand.single.result]);

  // ** Function handle
  const onSubmit = async (data: FormValuesBrand) => {
    if (id) {
      updateBrand({
        axiosClientJwt,
        brand: {
          brandName: data.brand_name,
          status: status.value,
        },
        dispatch,
        id: +id,
        message,
        navigate,
        setError,
      });
    } else {
      createBrand({
        axiosClientJwt,
        brand: {
          brandName: data.brand_name,
          status: status.value
        },
        dispatch,
        message,
        navigate,
        setError,
      });
    }
  };

  const handleChangeStatus = (value: boolean) => {
    setStatus(value)
  };

  return (
    <Fragment>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/catalog/brands">Thương hiệu</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? "Cập nhật" : "Tạo"}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={24}>
          <Card>
            <Form
              onFinish={handleSubmit(onSubmit)}
              layout="vertical"
              autoComplete="off"
            >
              <Col span={24}>
                <Flex justifyContent="flex-end" alignItems="center">
                  {id && brand.update.loading ? (
                    <Button type="primary" loading>
                      Đang cập nhật...
                    </Button>
                  ) : brand.create.loading ? (
                    <Button type="primary" loading>
                      Đang tạo...
                    </Button>
                  ) : id ? (
                    <Button htmlType="submit" type="primary">
                      Cập nhật
                    </Button>
                  ) : (
                    <Button htmlType="submit" type="primary">
                      Tạo
                    </Button>
                  )}
                </Flex>
              </Col>
              <Divider />
              <Col span={24}>
                <Form.Item label="Tên">
                  <Controller
                    name="brand_name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div ref={brandNameErrorRef}>
                          <Input {...field} placeholder="Zara Vietnam" />
                          {errors?.brand_name ? (
                            <Box as="div" mt={1} textColor="red.600">
                              {errors.brand_name?.type === "required"
                                ? "Vui lòng điền tên thương hiệu!"
                                : errors.brand_name.message}
                            </Box>
                          ) : null}
                        </div>
                      );
                    }}
                  />
                </Form.Item>
                {
                  id && (
                    <Form.Item label="Mã thương hiệu">
                    <Controller
                      name="brand_code"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => {
                        return (
                          <div ref={brandCodeErrorRef}>
                            <Input {...field} placeholder="CAT001" disabled/>
                          </div>
                        );
                      }}
                    />
                  </Form.Item>
                  )
                }
              
                <Form.Item label="Trạng thái" style={{ width: "20%" }}>
                  <Controller
                    name="brand_status"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div ref={brandStatusErrorRef}>
                          <Select
                            value={status}
                            // {...field}
                            placeholder="Status"
                            onChange={handleChangeStatus}
                            options={[
                              {
                                value: "1",
                                label: "Hoạt động",
                              },
                              {
                                value: "0",
                                label: "Vô hiệu hóa",
                              },
                            ]}
                          />
                          {/* {errors?.brand_code ? (
                            <Box as="div" mt={1} textColor="red.600">
                              {errors.brand_code?.type === "required"
                                ? "Vui lòng điền !"
                                : errors.brand_code.message}
                            </Box>
                          ) : null} */}
                        </div>
                      );
                    }}
                  />
                </Form.Item>
              </Col>
            </Form>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};
export default BrandCreateUpdate;
