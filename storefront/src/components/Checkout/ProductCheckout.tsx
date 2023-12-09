import { Button, Card, HStack, useToast } from '@chakra-ui/react';
import { Col, Divider, Form, Input, Row } from 'antd';
import * as React from 'react';
import { Control, Controller, UseFormResetField, UseFormSetError } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/axios/axiosInstance';
import { updateCart } from 'src/features/cart/action';
import { FormValues } from 'src/pages/CheckoutPage';

const imgPlaceHover = 'https://inantemnhan.com.vn/wp-content/uploads/2017/10/no-image.png'

interface ProductCheckoutProps {
    control: Control<FormValues, any>
    refresh: boolean
    setRefresh: (refresh: boolean) => void
    resetField: UseFormResetField<FormValues>
    setError: UseFormSetError<FormValues>
}


const ProductCheckout = ({ control, refresh, setRefresh, resetField, setError }: ProductCheckoutProps) => {
    const toast = useToast()

    const cart = useAppSelector((state) => state.cart)
    const axiosClientJwt = createAxiosJwt();
    const dispatch = useAppDispatch();

    return (
        <div className='mb-[1rem]'>
            <Card variant="outline" padding={8}>
                <div className='text-center font-bold'>Item</div>
                <Divider />
                <Row gutter={[16, 0]}>
                    <Col span={6}>
                        <img
                            alt=''
                            src={!cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant?.featured_asset ? cart.cart.result.product_variant.featured_asset.url : imgPlaceHover : imgPlaceHover}
                            className='w-full object-cover p-2 rounded-lg'
                        />
                    </Col>
                    <Col span={18}>
                        <div className='text-2xl font-bold mb-1'>{!cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant.name : ''}</div>
                        <div className='text-[#808080] mb-1'>{!cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant.sku : ''}</div>
                        <div className='mb-1'>Stock: {!cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant.stock : ''}</div>
                        <Form>
                            <Controller
                                name='quantity'
                                control={control}
                                render={({ field: { value, ...other } }) => (
                                    <React.Fragment>
                                        <HStack maxW='320px'>
                                            <Button
                                                size='sm'
                                                borderRadius='50%'
                                                onClick={() => {
                                                    resetField('quantity')
                                                    updateCart({
                                                        axiosClientJwt,
                                                        cart: {
                                                            quantity: value - 1
                                                        },
                                                        dispatch,
                                                        id: cart.cart.result?.product_variant?.id!,
                                                        refresh,
                                                        setError,
                                                        setRefresh,
                                                        toast
                                                    })
                                                }}
                                            >
                                                -
                                            </Button>
                                            <Input type="number" {...other} value={value} disabled={cart.update.loading} style={{ width: '50px', border: 'none', pointerEvents: 'none' }} />
                                            <Button
                                                size='sm'
                                                borderRadius='50%'
                                                onClick={() => {
                                                    resetField('quantity')
                                                    updateCart({
                                                        axiosClientJwt,
                                                        cart: {
                                                            quantity: value + 1
                                                        },
                                                        dispatch,
                                                        id: cart.cart.result?.product_variant?.id!,
                                                        refresh,
                                                        setError,
                                                        setRefresh,
                                                        toast
                                                    })
                                                }}
                                            >
                                                +
                                            </Button>
                                        </HStack>
                                    </React.Fragment>
                                )}
                            />
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ProductCheckout;