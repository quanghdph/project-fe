import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Breadcrumb, Card, Col, Divider, Row, Switch, Form, Button, Input, message } from 'antd';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createWaistband, getWaistband, updateWaistband } from 'src/features/catalog/waistband/action';
import { createAxiosJwt } from 'src/helper/axiosInstance';
// import ProductOfCategory from './ProductOfCategory';
import { Product } from 'src/types';

export type FormValuesWaistband = {
    waistband_name: string
    waistband_code: string
}

const WaistbandCreateUpdate = () => {
    // ** State
    const [active, setActive] = useState<boolean>(true)
    const [parentId, setParentId] = useState<number | null>(null)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesWaistband>({
        defaultValues: {
            waistband_name: '',
            waistband_code: '',
        }
    });

    // ** Ref
    const waistbandNameErrorRef = useRef(null);
    const waistbandCodeErrorRef = useRef(null);

    // ** Variables
    const waistband = useAppSelector((state) => state.waistband);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        waistbandNameErrorRef.current && autoAnimate(waistbandNameErrorRef.current);
        waistbandCodeErrorRef.current && autoAnimate(waistbandCodeErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id) {
            getWaistband({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
        // getListCategory({
        //     pagination: {
        //         skip: 0,
        //         take: 999
        //     },
        //     navigate,
        //     axiosClientJwt,
        //     dispatch,
        // })
    }, [id])

    useEffect(() => {
        if (id && !waistband.single.loading && waistband.single.result) {
            setValue("waistband_code", waistband.single.result.waistbandCode)
            setValue("waistband_name", waistband.single.result.waistbandName)
        }
    }, [id, waistband.single.loading, waistband.single.result])

    // ** Function handle
    const onSubmit = async (data: FormValuesWaistband) => {
        if (id) {
            updateWaistband({
                axiosClientJwt,
                waistband: {
                    waistbandCode: data.waistband_code,
                    waistbandName: data.waistband_name,
                },
                dispatch,
                id: +id,
                message,
                navigate,
                setError
            })
        } else {
            createWaistband({
                axiosClientJwt,
                waistband: {
                    waistbandCode: data.waistband_code,
                    waistbandName: data.waistband_name,
                },
                dispatch,
                message,
                navigate,
                setError
            })
        }
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
                            <Link to='/catalog/waistbands'>Cạp quần</Link>
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
                                        id && waistband.update.loading ?
                                            <Button type="primary" loading>Đang cập nhật...</Button> :
                                            waistband.create.loading ?
                                                <Button type="primary" loading>Đang tạo...</Button> :
                                                id ? <Button htmlType="submit" type="primary">Cập nhật</Button> :
                                                    <Button htmlType="submit" type="primary">Tạo</Button>
                                    }
                                </Flex>
                            </Col>
                            <Divider />
                            <Col span={24}>
                                <Form.Item label="Tên">
                                    <Controller
                                        name="waistband_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={waistbandNameErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: Waistband" />
                                                    {errors?.waistband_name ? <Box as="div" mt={1} textColor="red.600">{errors.waistband_name?.type === 'required' ? "Vui lòng điền tên!" : errors.waistband_name.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Mã cạp quần">
                                    <Controller
                                        name="waistband_code"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={waistbandCodeErrorRef}>
                                                    <Input {...field} placeholder="VM00932" />
                                                    {errors?.waistband_code ? <Box as="div" mt={1} textColor="red.600">{errors.waistband_code?.type === 'required' ? "Vui lòng điền mã cạp quần!" : errors.waistband_code.message}</Box> : null}
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
export default WaistbandCreateUpdate