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
import TextArea from "antd/lib/input/TextArea";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  getListCustomer,
  getListSearchCustomer,
} from "src/features/customer/action";
import {
  getListEmployee,
  getListSearchEmployee,
} from "src/features/employee/action";
import { createBill, getBill, updateBill } from "src/features/sale/bill/action";
import { createAxiosJwt } from "src/helper/axiosInstance";
import { useDebounce } from "use-debounce";

export type FormValuesBill = {
  bill_name: string;
  bill_code: string;
  status: {
    label: string;
    value: number;
  };
};

const BillCreateUpdate = () => {
  // ** State
  const [status, setStatus] = useState({ label: "Hoạt động", value: 1 });
  const [search, setSearch] = useState<string>("");
  const [value] = useDebounce(search, 1000);
  const [customerOption, setCustomerOption] = useState();

  const [searchEmployee, setSearchEmployee] = useState<string>("");
  const [valueEmployee] = useDebounce(searchEmployee, 1000);
  const [employeeOption, setEmployeeOption] = useState();

  // ** Third party
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    register,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      customer: "",
      employee: "",
      address: "",
      phoneNumber: "",
      transportFee: "",
      note: "",
      status: { label: "Hoạt động", value: 1 },
    },
  });

  // ** Variables
  const bill = useAppSelector((state) => state.bill);
  const customer = useAppSelector((state) => state.customer);
  const employee = useAppSelector((state) => state.employee);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // ** Effect

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
    // console.log(bill);
    if (id && !bill.single.loading && bill.single.result) {
      const { note, transportFee, phoneNumber, address } = bill.single.result;
      // setValue("bill_code", bill.single.result.billCode);
      // setValue("bill_name", bill.single.result.billName);
      setStatus({
        label: bill.single.result.status == 1 ? "Hoạt động" : "Vô hiệu hóa",
        value: bill.single.result.status,
      });
      setValue("note", note);
      setValue("transportFee", transportFee);
      setValue("phoneNumber", phoneNumber);
      setValue("address", address);
      setValue("address", address);
      setValue("address", address);
    }
  }, [id, bill.single.loading, bill.single.result]);

  // ** Function handle
  const onSubmit = async (data: any) => {
    console.log(data);
    if (id) {
      updateBill({
        axiosClientJwt,
        bill: {
          customer: data.customer,
          employee: data.employee,
          address: data.address,
          phoneNumber: data.phoneNumber,
          transportFee: data.transportFee,
          note: data.note,
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
          customer: data.customer,
          employee: data.employee,
          address: data.address,
          phoneNumber: data.phoneNumber,
          transportFee: data.transportFee,
          note: data.note,
          status: status.value,
        },
        dispatch,
        message,
        navigate,
        setError,
      });
    }
  };

  const handleChangeStatus = (value: boolean) => {
    setStatus(value);
  };

  const onNoteChange = (e) => {
    const value = e.target.value;
    setValue("note", value);
  };

  //Customer search
  const onCustomerSearch = (value: string) => {
    setSearch(value);
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

  const filterCustomerOption = (): any => {
    return customerOption;
  };

  //Employ search
  const onEmployeeSearch = (value: string) => {
    setSearchEmployee(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchFunction = valueEmployee
        ? getListSearchEmployee
        : getListEmployee;

      try {
        const params = valueEmployee ? { value: valueEmployee } : {};
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
  }, [valueEmployee, searchEmployee]);

  useEffect(() => {
    if (!employee.list.loading && employee.list.result) {
      const listOption = employee.list.result.listEmployees
        ? employee.list.result.listEmployees.map((item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          }))
        : employee.list.result.map((item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          }));
      if (!value) {
        setEmployeeOption(listOption);
      } else {
        listOption && setEmployeeOption(listOption);
      }
    }
  }, [employee.list.result, employee.list.loading, value]);

  const filterEmployeeOption = (): any => {
    return employeeOption;
  };

  const onCustomerChange = (value) => {
    if (customer.list.loading || !customer.list.result || customer.list.error)
      return;

    const currentCustomer = customer.list.result?.listCustomer.find(
      (item) => item.id === value,
    );
    setValue("customer", currentCustomer);
  };

  const onEmployeeChange = (value) => {
    if (employee.list.loading || !employee.list.result || employee.list.error)
      return;

    const currentEmployee = employee.list.result?.listEmployees.find(
      (item) => item.id === value,
    );
    setValue("employee", currentEmployee);
  };


    // validate số điện thoại
 const validatePhoneNumber = (value) => {
  const regex = /^0[1-9][0-9]{8}$/;

  if (!regex.test(value)) {
    return "Số điện thoại không hợp lệ";
  }
}


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
                <Form.Item label="Khách hàng">
                  <Controller
                    name="customer"
                    control={control}
                    // rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div>
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
                        </div>
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item label="Nhân viên">
                  <Controller
                    name="employee"
                    control={control}
                    // rules={{ required: true }}
                    render={({ field }) => {

                      return (
                        <Select
                          showSearch
                          placeholder="Tìm kiếm nhân viên"
                          optionFilterProp="children"
                          onChange={onEmployeeChange}
                          onSearch={onEmployeeSearch}
                          filterOption={filterEmployeeOption}
                          style={{ width: "100%" }}
                          options={employeeOption}
                        />
                      );
                    }}
                  />
                </Form.Item>

                <Form.Item label="Địa chỉ">
                  <Controller
                    name="address"
                    control={control}
                    // rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div>
                          <Input {...field} placeholder="50 Mỹ đình, Hà Nội" disabled={true}/>
                          {/* {errors?.address ? (
                            <Box as="div" mt={1} textColor="red.600">
                              {errors.address?.type === "required"
                                ? "Vui lòng điền địa chỉ"
                                : errors.address.message}
                            </Box>
                          ) : null} */}
                        </div>
                      );
                    }}
                  />
                </Form.Item>

                <Form.Item label="Số điện thoại">
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ 
                      required: "Vui Lòng Nhập Số điện thoại",
                      validate: validatePhoneNumber
                    }}
                    render={({ field }) => {
                      return (
                        <div>
                          <Input {...field} placeholder="0945468499" /> 
                      
                         {errors?.phoneNumber ? (
                            <Box as="div" mt={1} textColor="red.600">
                              {errors.phoneNumber.message}
                            </Box>
                          ) : null}
                        </div>
                      );
                    }}
                  />
                </Form.Item>

                <Form.Item label="Phí vận chuyển">
                  <Controller
                    name="transportFee"
                    control={control}
                    rules={{ 
                      required: "Vui lòng nhập giá tiền!"
                    }}
                    render={({ field }) => {
                      return (
                        <div>
                     <Input
  prefix={<span style={{ marginRight: '8px' }}>VND</span>} disabled={true}
  {...field}
  placeholder="20000"
/>

                  
   {errors?.transportFee ? <Box as="div" mt={1} textColor="red.600">{errors.transportFee?.message}</Box> : null}

                          {/* {errors?.transportFee ? (
                            <Box as="div" mt={1} textColor="red.600">
                              {errors.transportFee?.type === "required"
                                ? "Vui lòng điền phí vận chuyển"
                                : errors.transportFee.message}
                            </Box>
                          ) : null} */}
                        </div>
                      );
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="note"
                  label="Ghi chú"
                  // rules={[{ required: true, message: "Điền ghi chú" }]}
                >
                  <Controller
                    name="note"
                    control={control}
                    rules={{ 
                    
                      validate: validateNoWhiteSpace
                    }}
                    render={({ field }) => {
                      console.log(field);
                      return (
                        <div>
                          <TextArea
                            // {...register("note")}
                            {...field}
                            onChange={onNoteChange}
                            rows={4}
                            placeholder="Ghi chú"
                          />
                              {errors?.note ? <Box as="div" mt={1} textColor="red.600">{errors.note?.message}</Box> : null}
                    
                          {/* {errors?.transportFee ? (
                            <Box as="div" mt={1} textColor="red.600">
                              {errors.transportFee?.type === "required"
                                ? "Vui lòng điền số điện thoại"
                                : errors.transportFee.message}
                            </Box>
                          ) : null} */}
                        </div>
                      );
                    }}
                  />
                </Form.Item>

                <Form.Item label="Trạng thái" style={{ width: "20%" }}>
                  <Controller
                    name="status"
                    control={control}
                    // rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div>
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
