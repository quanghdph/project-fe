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
  createBill,
  getBill,
  updateBill,
} from "src/features/sale/bill/action";
import { createAxiosJwt } from "src/helper/axiosInstance";

export type FormValuesBill = {
  bill_name: string;
  bill_code: string;
  bill_status: {
    label: string;
    value: number;
  };
};

const BillCreateUpdate = () => {
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
  } = useForm<FormValuesBill>({
    defaultValues: {
      bill_name: "",
      bill_code: "",
      bill_status: { label: "Hoạt động", value: 1 },
    },
  });

  // ** Ref
  const billNameErrorRef = useRef(null);
  const billCodeErrorRef = useRef(null);
  const billStatusErrorRef = useRef(null);

  // ** Variables
  const bill = useAppSelector((state) => state.bill);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // ** Effect
  useEffect(() => {
    billNameErrorRef.current && autoAnimate(billNameErrorRef.current);
    billCodeErrorRef.current && autoAnimate(billCodeErrorRef.current);
    billStatusErrorRef.current &&
      autoAnimate(billStatusErrorRef.current);
  }, [parent]);

  useEffect(() => {
    if (id) {
      getBill({
        axiosClientJwt,
        dispatch,
        id: +id,
        navigate,
      });
    }
  }, [id]);

  useEffect(() => {
    if (id && !bill.single.loading && bill.single.result) {
      setValue("bill_code", bill.single.result.billCode);
      setValue("bill_name", bill.single.result.billName);
      setStatus({
        label: bill.single.result.status == 1  ? "Hoạt động": "Vô hiệu hóa",
        value: bill.single.result.status
      })
    }
  }, [id, bill.single.loading, bill.single.result]);

  // ** Function handle
  const onSubmit = async (data: FormValuesBill) => {
    if (id) {
      updateBill({
        axiosClientJwt,
        bill: {
          billName: data.bill_name,
          status: status.value,
        },
        dispatch,
        id: +id,
        message,
        navigate,
        setError,
      });
    } else {
      createBill({
        axiosClientJwt,
        bill: {
          billName: data.bill_name,
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
              <Link to="/sales/bills">Hóa đơn</Link>
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
                  {id && bill.update.loading ? (
                    <Button type="primary" loading>
                      Đang cập nhật...
                    </Button>
                  ) : bill.create.loading ? (
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
                    name="bill_name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div ref={billNameErrorRef}>
                          <Input {...field} placeholder="Ví dụ: Áo thun" />
                          {errors?.bill_name ? (
                            <Box as="div" mt={1} textColor="red.600">
                              {errors.bill_name?.type === "required"
                                ? "Vui lòng điền tên danh mục!"
                                : errors.bill_name.message}
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
                      name="bill_code"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => {
                        return (
                          <div ref={billCodeErrorRef}>
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
                    name="bill_status"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div ref={billStatusErrorRef}>
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
                          {/* {errors?.bill_code ? (
                            <Box as="div" mt={1} textColor="red.600">
                              {errors.bill_code?.type === "required"
                                ? "Vui lòng điền !"
                                : errors.bill_code.message}
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
export default BillCreateUpdate;
