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
  createCategory,
  getCategory,
  updateCategory,
} from "src/features/catalog/category/action";
import { createAxiosJwt } from "src/helper/axiosInstance";

export type FormValuesCategory = {
  category_name: string;
  category_code: string;
  category_status: {
    label: string;
    value: number;
  };
};

const CategoryCreateUpdate = () => {
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
  } = useForm<FormValuesCategory>({
    defaultValues: {
      category_name: "",
      category_code: "",
      category_status: { label: "Hoạt động", value: 1 },
    },
  });

  // ** Ref
  const categoryNameErrorRef = useRef(null);
  const categoryCodeErrorRef = useRef(null);
  const categoryStatusErrorRef = useRef(null);

  // ** Variables
  const category = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // ** Effect
  useEffect(() => {
    categoryNameErrorRef.current && autoAnimate(categoryNameErrorRef.current);
    categoryCodeErrorRef.current && autoAnimate(categoryCodeErrorRef.current);
    categoryStatusErrorRef.current &&
      autoAnimate(categoryStatusErrorRef.current);
  }, [parent]);

  useEffect(() => {
    if (id) {
      getCategory({
        axiosClientJwt,
        dispatch,
        id: +id,
        navigate,
      });
    }
  }, [id]);

  useEffect(() => {
    if (id && !category.single.loading && category.single.result) {
      setValue("category_code", category.single.result.categoryCode);
      setValue("category_name", category.single.result.categoryName);
      setStatus({
        label: category.single.result.status == 1  ? "Hoạt động": "Vô hiệu hóa",
        value: category.single.result.status
      })
    }
  }, [id, category.single.loading, category.single.result]);

  // ** Function handle
  const onSubmit = async (data: FormValuesCategory) => {
    if (id) {
      updateCategory({
        axiosClientJwt,
        category: {
          categoryName: data.category_name,
          status: status.value,
        },
        dispatch,
        id: +id,
        message,
        navigate,
        setError,
      });
    } else {
      createCategory({
        axiosClientJwt,
        category: {
          categoryName: data.category_name,
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
              <Link to="/catalog/categories">Danh mục</Link>
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
                  {id && category.update.loading ? (
                    <Button type="primary" loading>
                      Đang cập nhật...
                    </Button>
                  ) : category.create.loading ? (
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
                    name="category_name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div ref={categoryNameErrorRef}>
                          <Input {...field} placeholder="Ví dụ: Áo thun" />
                          {errors?.category_name ? (
                            <Box as="div" mt={1} textColor="red.600">
                              {errors.category_name?.type === "required"
                                ? "Vui lòng điền tên danh mục!"
                                : errors.category_name.message}
                            </Box>
                          ) : null}
                        </div>
                      );
                    }}
                  />
                </Form.Item>
                {
                  id && (
                    <Form.Item label="Mã danh mục">
                    <Controller
                      name="category_code"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => {
                        return (
                          <div ref={categoryCodeErrorRef}>
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
                    name="category_status"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div ref={categoryStatusErrorRef}>
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
                          {/* {errors?.category_code ? (
                            <Box as="div" mt={1} textColor="red.600">
                              {errors.category_code?.type === "required"
                                ? "Vui lòng điền !"
                                : errors.category_code.message}
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
export default CategoryCreateUpdate;
