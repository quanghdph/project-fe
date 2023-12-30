import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Breadcrumb, Card, Col, Divider, Row, Switch, Form, Button, Input, message } from 'antd';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createSize, getSize, updateSize } from 'src/features/catalog/size/action';
import { createAxiosJwt } from 'src/helper/axiosInstance';
// import ProductOfCategory from './ProductOfCategory';
import { Product } from 'src/types';

export type FormValuesSize = {
    size_name: string
    size_code: string
}

const SizeCreateUpdate = () => {
    // ** State
    const [active, setActive] = useState<boolean>(true)
    const [parentId, setParentId] = useState<number | null>(null)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesSize>({
        defaultValues: {
            size_name: '',
            size_code: '',
        }
    });

    // ** Ref
    const sizeNameErrorRef = useRef(null);
    const sizeCodeErrorRef = useRef(null);

    // ** Variables
    const size = useAppSelector((state) => state.size);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        sizeNameErrorRef.current && autoAnimate(sizeNameErrorRef.current);
        sizeCodeErrorRef.current && autoAnimate(sizeCodeErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id) {
            getSize({
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
        if (id && !size.single.loading && size.single.result) {
            setValue("size_code", size.single.result.sizeCode)
            setValue("size_name", size.single.result.sizeName)
        }
    }, [id, size.single.loading, size.single.result])

    // ** Function handle
    const onSubmit = async (data: FormValuesSize) => {
        if (id) {
            updateSize({
                axiosClientJwt,
                size: {
                    sizeCode: data.size_code,
                    sizeName: data.size_name,
                },
                dispatch,
                id: +id,
                message,
                navigate,
                setError
            })
        } else {
            createSize({
                axiosClientJwt,
                size: {
                    sizeCode: data.size_code,
                    sizeName: data.size_name,
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
                            <Link to='/catalog/size'>Kích thước</Link>
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
                                        id && size.update.loading ?
                                            <Button type="primary" loading>Đang cập nhật...</Button> :
                                            size.create.loading ?
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
                                        name="size_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={sizeNameErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: Size L" />
                                                    {errors?.size_name ? <Box as="div" mt={1} textColor="red.600">{errors.size_name?.type === 'required' ? "Vui lòng điền tên!" : errors.size_name.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Biến thể">
                                    <Controller
                                        name="size_code"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={sizeCodeErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: L" />
                                                    {errors?.size_code ? <Box as="div" mt={1} textColor="red.600">{errors.size_code?.type === 'required' ? "Vui lòng điền biến thể!" : errors.size_code.message}</Box> : null}
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
export default SizeCreateUpdate