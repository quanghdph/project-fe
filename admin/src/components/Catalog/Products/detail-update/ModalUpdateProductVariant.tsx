import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Button, Col, Form, Input, InputNumber, Modal, Row, message } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ProductVariant } from 'src/types';
import { Asset } from 'src/types/asset';
import SelectImage from '../SelectImage';
import { updateProductVariant } from 'src/features/catalog/product/actions';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/helper/axiosInstance';

export interface FormValuesProductVariant {
    name: string
    sku: string
    price: number
    origin_price: number
    stock: number
}

interface ModalUpdateProductVariantProps {
    isModalOpen: boolean
    setIsModalOpen: (open: boolean) => void
    variant: ProductVariant
    refresh: boolean,
    setRefresh: (refresh: boolean) => void
}
const ModalUpdateProductVariant = ({ isModalOpen, setIsModalOpen, variant, refresh, setRefresh }: ModalUpdateProductVariantProps) => {
    // ** State
    const [isModalAssetOpen, setIsModalAssetOpen] = useState<boolean>(false);
    const [featuredAsset, setFeaturedAsset] = useState<Asset>()

    // ** Ref
    const skuErrorRef = useRef(null);
    const nameErrorRef = useRef(null);

    // ** Third party
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesProductVariant>({
        defaultValues: {
            name: '',
            sku: '',
            origin_price: 0,
            price: 0,
            stock: 0
        }
    });

    // ** Variables
    const product = useAppSelector((state) => state.product);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        if (variant) {
            setValue("name", variant.name)
            setValue("price", variant.price)
            setValue("origin_price", variant.origin_price)
            setValue("sku", variant.sku)
            setValue("stock", variant.stock)
            setFeaturedAsset(variant.featured_asset)
        }
    }, [variant])

    useEffect(() => {
        skuErrorRef.current && autoAnimate(skuErrorRef.current);
        nameErrorRef.current && autoAnimate(nameErrorRef.current);
    }, [parent])

    // ** Function handle
    const onSubmit = (data: FormValuesProductVariant) => {
        updateProductVariant({
            axiosClientJwt,
            dispatch,
            id: variant?.id,
            message,
            navigate,
            productVariant: {
                name: data.name,
                price: data.price,
                origin_price: data.origin_price,
                sku: data.sku,
                stock: data.stock,
                featured_asset_id: featuredAsset?.id
            },
            refresh,
            setError,
            setIsModalOpen,
            setRefresh
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal title="Cập nhật biến thể sản phẩm" cancelText={'Hủy'} okText={'Cập nhật'} open={isModalOpen} onOk={handleSubmit(onSubmit)} onCancel={handleCancel} centered width={"80%"} confirmLoading={product.productVariantUpdate.loading}>
            <Form layout='vertical'>
                <Row gutter={[16, 16]}>
                    <Col span={19}>
                        <Form.Item label="Tên">
                            <Controller
                                name="name"
                                rules={{ required: true }}
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <div ref={nameErrorRef}>
                                            <Input {...field} placeholder="Ví dụ: Shirt sm" />
                                            {errors?.name ? <Box as="div" mt={1} textColor="red.600">{errors.name?.type === 'required' ? "Vui lòng điền tên biến thể!" : errors.name.message}</Box> : null}
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="SKU">
                            <Controller
                                name="sku"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => {
                                    return (
                                        <div ref={skuErrorRef}>
                                            <Input {...field} placeholder="sm-0152" />
                                            {errors?.sku ? <Box as="div" mt={1} textColor="red.600">{errors.sku?.type === 'required' ? "Vui lòng điền SKU!" : errors.sku.message}</Box> : null}
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="Giá gốc">
                            <Controller
                                name="origin_price"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <div >
                                            <InputNumber
                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                {...field}
                                            />
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="Giá bán">
                            <Controller
                                name="price"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <div >
                                            <InputNumber
                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                {...field}
                                            />
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="Số lượng">
                            <Controller
                                name="stock"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <div >
                                            <InputNumber {...field} />
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Flex flexDirection={'column'} alignItems={"center"}>
                            <Box border={"1px solid #dbdbdb"} borderRadius={"10px"} w={"100%"}>
                                <img
                                    style={{ width: "100%", padding: "10px", height: "300px", objectFit: "contain" }}
                                    src={featuredAsset ? featuredAsset?.url : 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg'}
                                />
                            </Box>
                            <Button onClick={() => setIsModalAssetOpen(true)} style={{ marginTop: "10px" }}>Chọn ảnh</Button>
                        </Flex>
                    </Col>
                </Row>
            </Form>
            <SelectImage isModalAssetOpen={isModalAssetOpen} setIsModalAssetOpen={setIsModalAssetOpen} setFeaturedAsset={setFeaturedAsset} featuredAsset={featuredAsset as Asset} />
        </Modal>
    );
};

export default ModalUpdateProductVariant;