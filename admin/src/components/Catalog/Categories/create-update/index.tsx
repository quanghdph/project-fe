import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Breadcrumb, Card, Col, Divider, Row, Switch, Form, Button, Input, message } from 'antd';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createCategory, getCategory, getListCategory, updateCategory } from 'src/features/catalog/category/action';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import ProductOfCategory from './ProductOfCategory';
import { Product } from 'src/types';

export type FormValuesCategory = {
    category_name: string
    category_code: string
    description: string
}

const CategoryCreateUpdate = () => {
    // ** State
    const [active, setActive] = useState<boolean>(true)
    const [parentId, setParentId] = useState<number | null>(null)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesCategory>({
        defaultValues: {
            category_name: '',
            category_code: '',
            description: '',
        }
    });

    // ** Ref
    const categoryNameErrorRef = useRef(null);
    const categoryCodeErrorRef = useRef(null);

    // ** Variables
    const category = useAppSelector((state) => state.category);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        categoryNameErrorRef.current && autoAnimate(categoryNameErrorRef.current);
        categoryCodeErrorRef.current && autoAnimate(categoryCodeErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id) {
            getCategory({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
        getListCategory({
            pagination: {
                skip: 0,
                take: 999
            },
            navigate,
            axiosClientJwt,
            dispatch,
        })
    }, [id])

    useEffect(() => {
        if (id && !category.single.loading && category.single.result) {
            setValue("category_code", category.single.result.category_code)
            setValue("category_name", category.single.result.category_name)
            setValue("description", category.single.result.description)
            setActive(category.single.result.active)
            setParentId(category.single.result.parent_id)
        }
    }, [id, category.single.loading, category.single.result])

    // ** Function handle
    const onSubmit = async (data: FormValuesCategory) => {
        if (id) {
            updateCategory({
                axiosClientJwt,
                category: {
                    category_code: data.category_code,
                    category_name: data.category_name,
                    description: data.description,
                    active,
                    ...parentId && { parent_id: parentId }
                },
                dispatch,
                id: +id,
                message,
                navigate,
                setError
            })
        } else {
            createCategory({
                axiosClientJwt,
                category: {
                    category_code: data.category_code,
                    category_name: data.category_name,
                    description: data.description,
                    active,
                    ...parentId && { parent_id: parentId }
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
                            <Link to='/catalog/categories'>Danh muhc</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? 'Cập nhật' : 'Tạo'}</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Card>
                        <Form onFinish={handleSubmit(onSubmit)} layout="vertical" autoComplete="off">
                            <Col span={24}>
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Flex justifyContent="center" alignItems="center">
                                        <Switch checked={active} size='small' onChange={() => setActive(!active)} />
                                        <Box as="span" ml={2} fontWeight="semibold">Hoạt động</Box>
                                    </Flex>
                                    {
                                        id && category.update.loading ?
                                            <Button type="primary" loading>Đang cập nhật...</Button> :
                                            category.create.loading ?
                                                <Button type="primary" loading>Đang tạo...</Button> :
                                                id ? <Button htmlType="submit" type="primary">Cập nhật</Button> :
                                                    <Button htmlType="submit" type="primary">Tạo</Button>
                                    }
                                </Flex>
                            </Col>
                            <Divider />
                            <Col span={24}>
                                <Form.Item label="Tên danh mục">
                                    <Controller
                                        name="category_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={categoryNameErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: Shirt" />
                                                    {errors?.category_name ? <Box as="div" mt={1} textColor="red.600">{errors.category_name?.type === 'required' ? "Vui lòng điền tên danh mục!" : errors.category_name.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Mã danh mục">
                                    <Controller
                                        name="category_code"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={categoryCodeErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: shirt" />
                                                    {errors?.category_code ? <Box as="div" mt={1} textColor="red.600">{errors.category_code?.type === 'required' ? "Vui lòng điền mã danh mục!" : errors.category_code.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Ghi chú">
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <div>
                                                    <Input.TextArea {...field} />
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                {id && (
                                    <Form.Item label="Sản phẩm của danh mục">
                                        <ProductOfCategory products={category.single.result?.product as Product[]} loading={category.single.loading} />
                                    </Form.Item>
                                )}
                            </Col>
                        </Form>

                    </Card>
                </Col>
            </Row>

        </Fragment>
    )
}
export default CategoryCreateUpdate