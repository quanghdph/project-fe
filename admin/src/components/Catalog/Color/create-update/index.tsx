import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Breadcrumb, Card, Col, Divider, Row, Switch, Form, Button, Input, message } from 'antd';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createColor, getColor, updateColor } from 'src/features/catalog/color/action';
import { createAxiosJwt } from 'src/helper/axiosInstance';
// import ProductOfCategory from './ProductOfCategory';
import { Product } from 'src/types';

export type FormValuesColor = {
    color_name: string
    color_code: string
}

const ColorCreateUpdate = () => {
    // ** State
    const [active, setActive] = useState<boolean>(true)
    const [parentId, setParentId] = useState<number | null>(null)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesColor>({
        defaultValues: {
            color_name: '',
            color_code: '',
        }
    });

    // ** Ref
    const colorNameErrorRef = useRef(null);
    const colorCodeErrorRef = useRef(null);

    // ** Variables
    const color = useAppSelector((state) => state.color);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        colorNameErrorRef.current && autoAnimate(colorNameErrorRef.current);
        colorCodeErrorRef.current && autoAnimate(colorCodeErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id) {
            getColor({
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
        if (id && !color.single.loading && color.single.result) {
            setValue("color_code", color.single.result.colorCode)
            setValue("color_name", color.single.result.colorName)
        }
    }, [id, color.single.loading, color.single.result])

    // ** Function handle
    const onSubmit = async (data: FormValuesColor) => {
        if (id) {
            updateColor({
                axiosClientJwt,
                color: {
                    colorName: data.color_name,
                },
                dispatch,
                id: +id,
                message,
                navigate,
                setError
            })
        } else {
            createColor({
                axiosClientJwt,
                color: {
                    colorName: data.color_name,
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
                            <Link to='/catalog/color'>Màu sắc</Link>
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
                                        id && color.update.loading ?
                                            <Button type="primary" loading>Đang cập nhật...</Button> :
                                            color.create.loading ?
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
                                        name="color_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={colorNameErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: Màu xanh" />
                                                    {errors?.color_name ? <Box as="div" mt={1} textColor="red.600">{errors.color_name?.type === 'required' ? "Vui lòng điền tên màu!" : errors.color_name.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                             {
                                id && (
                                    <Form.Item label="Mã màu">
                                    <Controller
                                        name="color_code"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={colorCodeErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: 040493" disabled />
                                                    {errors?.color_code ? <Box as="div" mt={1} textColor="red.600">{errors.color_code?.type === 'required' ? "Vui lòng điền mã màu!" : errors.color_code.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                )
                             }
                            </Col>
                        </Form>

                    </Card>
                </Col>
            </Row>

        </Fragment>
    )
}
export default ColorCreateUpdate