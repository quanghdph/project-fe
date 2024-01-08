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
  DatePicker,
  DatePickerProps,
} from "antd";
import moment from "moment";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  createEmployee,
  getEmployee,
  updateEmployee,
} from "src/features/employee/action";
import { createAxiosJwt } from "src/helper/axiosInstance";
// import ProductOfCategory from './ProductOfCategory';
import { Product } from "src/types";

export type FormValuesEmployee = {
  employee_firstname: string;
  employee_lastname: string;
  employee_code: string;
  employee_birth: string;
  employee_email: string;
  employee_phone: string;
};

const dateFormat = "YYYY/MM/DD";
const outputFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

const EmployeeCreateUpdate = () => {
  // ** State
  const [active, setActive] = useState<boolean>(true);
  const [gender, setGender] = useState({ label: "Nam", value: 1 });
  const [dateOfBirth, setDateOfBirth] = useState();
  const [createDate, setCreateDate] = useState();
  const [updateDate, setUpdateDate] = useState();

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
  } = useForm<FormValuesEmployee>({
    defaultValues: {
      employee_firstname: "",
      employee_lastname: "",
      employee_code: "",
      employee_email: "",
      employee_phone: "",
    },
  });

  // ** Ref
  const employeeNameErrorRef = useRef(null);
  const employeeCodeErrorRef = useRef(null);

  // ** Variables
  const employee = useAppSelector((state) => state.employee);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // ** Effect
  useEffect(() => {
    employeeNameErrorRef.current && autoAnimate(employeeNameErrorRef.current);
    employeeCodeErrorRef.current && autoAnimate(employeeCodeErrorRef.current);
  }, [parent]);

  useEffect(() => {
    if (id) {
      getEmployee({
        axiosClientJwt,
        dispatch,
        id: +id,
        navigate,
      });
    }
  }, [id]);

  useEffect(() => {
    if (id && !employee.single.loading && employee.single.result) {
      setValue("employee_firstname", employee.single.result.firstName);
      setValue("employee_lastname", employee.single.result.lastName);
      setValue("employee_code", employee.single.result.employeeCode);
      // setValue("employee_gender", employee.single.result.gender);
      setValue("employee_email", employee.single.result.email);
      setValue("employee_phone", employee.single.result.phoneNumber);
      employee.single.result?.dateOfBirth && setDateOfBirth(moment(employee.single.result?.dateOfBirth).format(outputFormat))
      employee.single.result?.createDate && setCreateDate(moment(employee.single.result?.createDate).format(outputFormat))
      employee.single.result?.updateDate && setUpdateDate(moment(employee.single.result?.updateDate).format(outputFormat))
    }
  }, [id, employee.single.loading, employee.single.result]);

  const onChangeGender = (props: any) => {
    const defaultSelect = {
      value: props,
      label: props == 0 ? "Nữ" : "Nam",
    };
    setGender(defaultSelect);
  };

  const onChangeDatePicker: DatePickerProps["onChange"] = (
    date,
    _dateString,
  ) => {
    setDateOfBirth(date.toISOString() as string);
  };

  const onChangeCreateDatePicker: DatePickerProps["onChange"] = (
    date,
    _dateString,
  ) => {
    setCreateDate(date.toISOString() as string);
  };

  const onChangeUpdateDatePicker: DatePickerProps["onChange"] = (
    date,
    _dateString,
  ) => {
    setUpdateDate(date.toISOString() as string);
  };

  // ** Function handle
  const onSubmit = async (data: FormValuesEmployee) => {
    const formatDateOfBirth =  moment(dateOfBirth).format("YYYY-MM-DD")
    const formatCreateDate = moment(createDate).format("YYYY-MM-DD")
    const formatUpdateDate = moment(updateDate).format("YYYY-MM-DD")

    if (id) {
      updateEmployee({
        axiosClientJwt,
        employee: {
          employeeCode: data.employee_code,
          firstName: data.employee_firstname,
          lastName: data.employee_lastname,
          gender: gender.value,
          dateOfBirth: formatDateOfBirth,
          createDate: formatCreateDate,
          updateDate: formatUpdateDate,
          email: data.employee_email,
          phoneNumber: data.employee_phone,
        },
        dispatch,
        id: +id,
        message,
        navigate,
        setError,
      });
    } else {
      data && createEmployee({
        axiosClientJwt,
        employee: {
          employeeCode: data.employee_code,
          firstName: data.employee_firstname,
          lastName: data.employee_lastname,
          gender: gender.value,
          dateOfBirth: formatDateOfBirth,
          createDate: formatCreateDate,
          updateDate: formatUpdateDate,
          email: data.employee_email,
          encryptedPassword: "hashed_password1",
          image: '',
          phoneNumber: data.employee_phone,
        },
        dispatch,
        message,
        navigate,
        setError,
      });
    }
  };

/// validate 
  const validateNoWhiteSpace = (value) => {
    const regexLeadingWhitespace = /^\s/;
    const regexTrailingWhitespace = /\s$/;
    if (regexLeadingWhitespace.test(value)) {
      return "Không được chứa khoảng trắng ở đầu!";
    } else if (regexTrailingWhitespace.test(value)) {
      return "Không được chứa khoảng trắng ở cuối!";
    }
    return true;
  };

  // validate số điện thoại
 const validatePhoneNumber = (value) => {
    const regex = /^0[0-9]{9}$/;

    if (!regex.test(value)) {
      return "Số điện thoại không hợp lệ";
    }
  }

  // validate email 
   const validateEmail = (value) => {
    // Biểu thức chính quy để kiểm tra địa chỉ email
    const regex = /^[^\s@]+@[^\s@]+\.com[^\s@]+$/;

    if (!regex.test(value)) {
      return "Địa chỉ email không hợp lệ";
    }

    return true;
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
              <Link to="/employee">Nhân viên</Link>
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
                  {id && employee.update.loading ? (
                    <Button type="primary" loading>
                      Đang cập nhật...
                    </Button>
                  ) : employee.create.loading ? (
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
                <Flex gap={4}>
                  <Form.Item label="Họ" style={{ width: "50%" }}>
                    <Controller
                      name="employee_firstname"
                      control={control}
                       rules={{
                        required: "Vui lòng điền vào trường này!",
                        validate: validateNoWhiteSpace,
                      }}
                      render={({ field }) => {
                        return (
                          <div ref={employeeNameErrorRef}>
                            <Input {...field} placeholder="Nguyễn" />
                            {errors?.employee_firstname ? (
                              <Box as="div" mt={1} textColor="red.600">
                                {errors.employee_firstname?.type === "required"
                                  ? "Vui lòng điền vào trường này!"
                                  : errors.employee_firstname.message}
                                     {errors.employee_firstname?.type === "validate"}
                              </Box>
                            ) : null}
                          </div>
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Tên" style={{ width: "50%" }}>
                    <Controller
                      name="employee_lastname"
                      control={control}
                      rules={{
                        required: "Vui lòng điền vào trường này!",
                        validate: validateNoWhiteSpace,
                      }}
                      render={({ field }) => {
                        return (
                          <div ref={employeeNameErrorRef}>
                            <Input {...field} placeholder="Quang" />
                            {errors?.employee_lastname ? (
                              <Box as="div" mt={1} textColor="red.600">
                                {errors.employee_lastname?.type === "required"
                                  ? "Vui lòng điền vào trường này!"
                                  : errors.employee_lastname.message}
                                   {errors.employee_lastname?.type === "validate"}
                              </Box>
                            ) : null}
                          </div>
                        );
                      }}
                    />
                  </Form.Item>
                </Flex>
                <Flex gap={4}>
                  <Form.Item label="Mã nhân viên" style={{ width: "30%" }}>
                    <Controller
                      name="employee_code"
                      control={control}
                      rules={{
                        required: "Vui lòng điền vào trường này!",
                        validate: validateNoWhiteSpace,
                      }}
                      render={({ field }) => {
                        return (
                          <div ref={employeeCodeErrorRef}>
                            <Input {...field} placeholder="EMP0002" />
                            {errors?.employee_code ? (
                              <Box as="div" mt={1} textColor="red.600">
                                {errors.employee_code?.type === "required"
                                  ? "Vui lòng điền mã nhân viên!"
                                  : errors.employee_code.message}
                                    {errors.employee_code?.type === "validate"}
                              </Box>
                            ) : null}
                          </div>
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Giới tính" style={{ width: "35%" }}>
                    <Select
                      value={gender}
                      placeholder="Nam.."
                      onChange={onChangeGender}
                      options={[
                        {
                          value: 0,
                          label: "Nữ",
                        },
                        {
                          value: 1,
                          label: "Nam",
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item label="Ngày sinh" style={{ width: "35%" }}>
                    <Controller
                      name="employee_birth"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => {
                        return (
                          <DatePicker
                          // id="employee_birth"
                            value={
                              dateOfBirth
                                ? moment(
                                    dateOfBirth?.substring(0, 10),
                                    dateFormat,
                                  )
                                : ("" as any)
                            }
                            onChange={onChangeDatePicker}
                          placeholder='Select date'
                          // onChange={(date) => field.onChange(date)}
                          // value={field.value}
                          />
                        );
                      }}
                    />
                  </Form.Item>
                </Flex>

                <Flex gap={4}>
                  <Form.Item label="Email" style={{ width: "70%" }}>
                    <Controller
                      name="employee_email"
                      control={control}
                        rules={{
                        required: "Vui lòng điền vào trường này!",
                        validate: validateEmail,
                      }}
                      render={({ field }) => {
                        return (
                          <div ref={employeeCodeErrorRef}>
                            <Input
                              {...field}
                              placeholder="nguyenquangk@gmail.com"
                            />
                            {errors?.employee_email ? (
                              <Box as="div" mt={1} textColor="red.600">
                                {errors.employee_email?.type === "required"
                                  ? "Vui lòng điền email!"
                                  : errors.employee_email.message}
                                   {errors.employee_code?.type === "validate"}
                              </Box>
                            ) : null}
                          </div>
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" style={{ width: "30%" }}>
                    <Controller
                      name="employee_phone"
                      control={control}
                       rules={{
                        required: "Vui lòng điền vào trường này!",
                        validate: validatePhoneNumber,
                      }}
                      render={({ field }) => {
                        return (
                          <div ref={employeeCodeErrorRef}>
                            <Input {...field} placeholder="0912345678" />
                            {errors?.employee_phone ? (
                              <Box as="div" mt={1} textColor="red.600">
                                {errors.employee_phone?.type === "required"
                                  ? "Vui lòng điền số điện thoại!"
                                  : errors.employee_phone.message}
                                   {errors.employee_code?.type === "validate"}
                              </Box>
                            ) : null}
                          </div>
                        );
                      }}
                    />
                  </Form.Item>
                </Flex>

                <Flex gap={4}>
                  <Form.Item label="Ngày tạo" style={{ width: "35%" }}>
                    <DatePicker
                      value={
                        createDate
                          ? moment(createDate?.substring(0, 10), dateFormat)
                          : ("" as any)
                      }
                      onChange={onChangeCreateDatePicker}
                    />
                  </Form.Item>
                  <Form.Item label="Ngày sửa" style={{ width: "35%" }}>
                    <DatePicker
                      value={
                        updateDate
                          ? moment(updateDate?.substring(0, 10), dateFormat)
                          : ("" as any)
                      }
                      onChange={onChangeUpdateDatePicker}
                    />
                  </Form.Item>
                </Flex>
              </Col>
            </Form>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};
export default EmployeeCreateUpdate;
