import { Box, Flex } from '@chakra-ui/react';
import { Card, Col, Divider, Form, Input, Modal, Popover, Row, message, Tag, Spin } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { deleteProductVariant, getProduct } from 'src/features/catalog/product/actions';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import {
    EllipsisOutlined
} from '@ant-design/icons';
import ModalUpdateProductVariant from './ModalUpdateProductVariant';
import { ProductOption, ProductVariant as ProductVariantType } from 'src/types';
import ModalUpdateProductOption from './ModalUpdateProductOption';

const ProductVariant = () => {
    // ** State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isModalUpdateProductOptionOpen, setIsModalUpdateProductOptionOpen] = useState<boolean>(false)
    const [variant, setVariant] = useState<ProductVariantType>()
    const [option, setOption] = useState<ProductOption>()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [isModalDeleteProductVariantOpen, setIsModalDeleteProductVariantOpen] = useState<boolean>(false)
    const [productVariantDelete, setProductVariantDelete] = useState<{ id: number, sku: string }>({
        id: 0,
        sku: ''
    })

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params

    // ** Variables
    const product = useAppSelector((state) => state.product);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        if (id) {
            getProduct({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
    }, [id, refresh])

    // ** Function handle
    const dataToRender = () => {
        if (!product.single.loading && product.single.result && product.single.result.product_variants && product.single.result.product_variants.length) {
            return product.single.result.product_variants.map((product_variant, index) => {
                return (
                    <Card key={index} style={{ marginBottom: "1rem" }}>
                        <Flex justifyContent={"flex-end"}>
                            <Box padding={"0 12px"}>
                                <Popover
                                    placement="left"
                                    content={
                                        <Fragment>
                                            <Box
                                                _hover={{ background: '#dbdbdb' }}
                                                cursor={"pointer"}
                                                padding={"2px 5px"}
                                                borderRadius={"4px"}
                                                onClick={() => {
                                                    setIsModalOpen(true)
                                                    setVariant(product_variant)
                                                }}
                                            >
                                                Cập nhật
                                            </Box>
                                            <Box
                                                _hover={{ background: '#dbdbdb' }}
                                                cursor={"pointer"}
                                                padding={"2px 5px"}
                                                borderRadius={"4px"}
                                                onClick={() => {
                                                    setIsModalDeleteProductVariantOpen(true)
                                                    setProductVariantDelete({
                                                        ...productVariantDelete,
                                                        sku: product_variant.sku,
                                                        id: product_variant.id
                                                    })
                                                }}
                                            >
                                                Xóa
                                            </Box>
                                        </Fragment>
                                    }
                                    title="Hành động"
                                >
                                    <EllipsisOutlined style={{ cursor: "pointer" }} />
                                </Popover>
                            </Box>
                        </Flex>
                        <Divider />
                        <Row gutter={[16, 16]}>
                            <Col span={5}>
                                <Flex flexDirection={'column'} alignItems={"flex-start"}>
                                    <Box border={"1px solid #dbdbdb"} borderRadius={"10px"} w={"100%"}>
                                        <img
                                            style={{ width: "100%", padding: "10px", height: "300px", objectFit: "contain" }}
                                            src={product_variant.featured_asset ? product_variant.featured_asset.url : 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg'}
                                        />
                                    </Box>
                                    <Box mt={4}>
                                        {product_variant.product_options.map((option) => {
                                            return (
                                                <Tag
                                                    color="blue"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setIsModalUpdateProductOptionOpen(true)
                                                        setOption(option.product_option)
                                                    }}
                                                >
                                                    {option.product_option.name} - {option.product_option.value}
                                                </Tag>
                                            )
                                        })}
                                    </Box>
                                </Flex>
                            </Col>
                            <Col span={19}>
                                <Form layout='vertical'>
                                    <Form.Item label="SKU">
                                        <Input disabled value={product_variant.sku} />
                                    </Form.Item>
                                    <Form.Item label="Tên biến thể">
                                        <Input disabled value={product_variant.name} />
                                    </Form.Item>
                                    <Form.Item label="Giá gốc">
                                        <Input disabled value={product_variant.origin_price} />
                                    </Form.Item>
                                    <Form.Item label="Giá bán">
                                        <Input disabled value={product_variant.price} />
                                    </Form.Item>
                                    <Form.Item label="Số lượng">
                                        <Input disabled value={product_variant.stock} />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                )
            })
        }
        return []
    }

    const handleOk = async () => {
        deleteProductVariant({
            axiosClientJwt,
            dispatch,
            id: productVariantDelete.id,
            message,
            navigate,
            refresh,
            setIsModalOpen: setIsModalDeleteProductVariantOpen,
            setRefresh
        })
    }

    const handleCancel = () => {
        setIsModalDeleteProductVariantOpen(false);
    }

    return (
        <Fragment>
            <Spin spinning={product.single.loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: 'unset' }}>
                {product.single.loading && <Box h='100vh'></Box>}
                {dataToRender()}
            </Spin>
            <ModalUpdateProductVariant isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} variant={variant as ProductVariantType} refresh={refresh} setRefresh={setRefresh} />
            <ModalUpdateProductOption isModalUpdateProductOptionOpen={isModalUpdateProductOptionOpen} setIsModalUpdateProductOptionOpen={setIsModalUpdateProductOptionOpen} option={option as ProductOption} refresh={refresh} setRefresh={setRefresh} />
            <Modal title="Xóa biến thể sản phẩm" cancelText={'Hủy'} okText={'Xóa'} open={isModalDeleteProductVariantOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={product.deleteProductVariant.loading}>
                Bạn có chắc muốn xóa biến thể sản phẩm này (<Box as='span' fontWeight='bold'>{productVariantDelete.sku}</Box>)?
            </Modal>
        </Fragment>
    );
};

export default ProductVariant;