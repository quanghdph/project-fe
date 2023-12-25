import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Breadcrumb, Card, Col, Divider, Row, Switch, Form, Button, Input, message, Select } from 'antd';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createEmployee, getEmployee, updateEmployee } from 'src/features/employee/action';
import { createAxiosJwt } from 'src/helper/axiosInstance';
// import ProductOfCategory from './ProductOfCategory';
import { Product } from 'src/types';

export type FormValuesEmployee = {
    employee_firstname: string,
    employee_lastname: string,
    employee_code: string,
    employee_gender: number,
    employee_birth: string,
    employee_email: string,
    employee_phone: string
}

const EmployeeCreateUpdate = () => {
    // ** State
    const [active, setActive] = useState<boolean>(true)
    const [parentId, setParentId] = useState<number | null>(null)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesEmployee>({
        defaultValues: {
            employee_firstname: '',
            employee_lastname: '',
            employee_code: '',
            employee_gender: 0,
            employee_birth: '',
            employee_email: '',
            employee_phone: ''
        }
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
    }, [parent])

    useEffect(() => {
        if (id) {
            getEmployee({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
    }, [id])

    useEffect(() => {
        if (id && !employee.single.loading && employee.single.result) {
            setValue("employee_firstname", employee.single.result.firstName)
            setValue("employee_lastname", employee.single.result.lastName)
            setValue("employee_code", employee.single.result.employeeCode)
            setValue("employee_gender", employee.single.result.gender)
            setValue("employee_email", employee.single.result.email)
            setValue("employee_phone", employee.single.result.phoneNumber)
        }
    }, [id, employee.single.loading, employee.single.result])

    // ** Function handle
    const onSubmit = async (data: FormValuesEmployee) => {
        if (id) {
            updateEmployee({
                axiosClientJwt,
                employee: {
                    employeeCode: data.employee_code,
                    firstName: data.employee_firstname,
                    lastName: data.employee_lastname,
                    // gender:
                    // dateOfBirth: 
                    email: data.employee_email,
                    phoneNumber: data.employee_phone
                },
                dispatch,
                id: +id,
                message,
                navigate,
                setError
            })
        } else {
            createEmployee({
                axiosClientJwt,
                employee: {
                    employeeCode: data.employee_code,
                    firstName: data.employee_firstname,
                    lastName: data.employee_lastname,
                    // gender:
                    // dateOfBirth: 
                    email: data.employee_email,
                    phoneNumber: data.employee_phone
                },
                dispatch,
                message,
                navigate,
                setError
            })
        }
    };

    const onChangeGender =  (value: string) => {
        // setGender(value)
    };

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Trang chủ</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to='/employee'>Nhân viên</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? 'Cập nhật' : 'Tạo'}</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Card>
                        <Form onFinish={handleSubmit(onSubmit)} layout="vertical" autoComplete="off">
                            <Col span={24}>
                                <Flex justifyContent="flex-end" alignItems="center">
                                    {
                                        id && employee.update.loading ?
                                            <Button type="primary" loading>Đang cập nhật...</Button> :
                                            employee.create.loading ?
                                                <Button type="primary" loading>Đang tạo...</Button> :
                                                id ? <Button htmlType="submit" type="primary">Cập nhật</Button> :
                                                    <Button htmlType="submit" type="primary">Tạo</Button>
                                    }
                                </Flex>
                            </Col>
                            <Divider />
                            <Col span={24}>
                                <Form.Item label="Họ">
                                    <Controller
                                        name="employee_firstname"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={employeeNameErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: Employee L" />
                                                    {errors?.employee_firstname ? <Box as="div" mt={1} textColor="red.600">{errors.employee_firstname?.type === 'required' ? "Vui lòng điền tên màu!" : errors.employee_firstname.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Tên">
                                    <Controller
                                        name="employee_lastname"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={employeeNameErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: Employee L" />
                                                    {errors?.employee_lastname ? <Box as="div" mt={1} textColor="red.600">{errors.employee_lastname?.type === 'required' ? "Vui lòng điền tên màu!" : errors.employee_lastname.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Mã nhân viên">
                                    <Controller
                                        name="employee_code"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={employeeCodeErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: L" />
                                                    {errors?.employee_code ? <Box as="div" mt={1} textColor="red.600">{errors.employee_code?.type === 'required' ? "Vui lòng điền mã màu!" : errors.employee_code.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Giới tính">
                                    <Controller
                                        name="employee_gender"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={employeeCodeErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: L" />
                                                    {errors?.employee_gender ? <Box as="div" mt={1} textColor="red.600">{errors.employee_gender?.type === 'required' ? "Vui lòng điền mã màu!" : errors.employee_gender.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Ngày sinh">
                                    <Controller
                                        name="employee_birth"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={employeeCodeErrorRef}>
                                                     <Select
                                                        // value={status}
                                                        placeholder="Gender"
                                                        onChange={onChangeGender}
                                                        options={[
                                                            {
                                                                value: '0',
                                                                label: 'Nữ',
                                                            },
                                                            {
                                                                value: '1',
                                                                label: 'Nam',
                                                            }
                                                        ]}
                                                    />
                                                    {errors?.employee_birth ? <Box as="div" mt={1} textColor="red.600">{errors.employee_birth?.type === 'required' ? "Vui lòng điền mã màu!" : errors.employee_birth.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Email">
                                    <Controller
                                        name="employee_email"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={employeeCodeErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: L" />
                                                    {errors?.employee_email ? <Box as="div" mt={1} textColor="red.600">{errors.employee_email?.type === 'required' ? "Vui lòng điền mã màu!" : errors.employee_email.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Số điện thoại">
                                    <Controller
                                        name="employee_phone"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={employeeCodeErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: L" />
                                                    {errors?.employee_phone ? <Box as="div" mt={1} textColor="red.600">{errors.employee_phone?.type === 'required' ? "Vui lòng điền mã màu!" : errors.employee_phone.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Form>

                    </Card>
                </Col>
            </Row>

        </Fragment>
    )
}
export default EmployeeCreateUpdate