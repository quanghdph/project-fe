import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Row, Col, Form, Input, Button, Modal } from 'antd';
import Layout from 'src/components/Layout/layout';
import { Box, BreadcrumbItem, Card, HStack, useToast, Breadcrumb, Flex } from '@chakra-ui/react';
import { Divider } from 'antd'
import Icon1 from '../../assets/icon-footer/icon-pay-01.png'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { checkPromotion, createOrder, createOrderByPayment, resetPromotionAction } from 'src/features/checkout/action';
import { createAxiosClient, createAxiosJwt } from 'src/axios/axiosInstance';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { getCart, updateCart } from 'src/features/cart/action';
import formatMoney from 'src/shared/utils/formatMoney';
import Address from 'src/components/Checkout/Address';
import { UserAddress } from 'src/shared/types';
import { ChevronRight } from 'react-feather';
import { resetPromotion } from 'src/features/checkout/checkoutSlice';
import CouponModal from 'src/components/Checkout/CouponModal';
import ProductCheckout from 'src/components/Checkout/ProductCheckout';
import Coupon from 'src/components/Checkout/Coupon';

export enum PaymentMethod {
    Standard = "Standard",
    Card = "Card"
}

export interface FormValues {
    coupon_code: string
    quantity: number
}

const CheckoutPage = () => {
    // ** State
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Standard)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [address, setAddress] = useState<UserAddress>()
    const [couponModal, setCouponModal] = React.useState<boolean>(false)

    // ** Variables
    const axiosClientJwt = createAxiosJwt();
    const dispatch = useAppDispatch();
    const checkout = useAppSelector((state) => state.checkout);
    const cart = useAppSelector((state) => state.cart)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const toast = useToast()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors }, resetField } = useForm<FormValues>({
        defaultValues: {
            coupon_code: '',
            quantity: !cart.cart.loading && cart.cart.result ? cart.cart.result.quantity : 1
        }
    });

    useEffect(() => {
        if (!checkout.promotion.loading && checkout.promotion.result) {
            setValue('coupon_code', checkout.promotion.result.coupon_code)
        }
        if (!cart.cart.loading && cart.cart.result) {
            setValue('quantity', cart.cart.result.quantity)
        }
    }, [
        checkout.promotion.loading,
        checkout.promotion.result,
        cart.cart.loading,
        cart.cart.result
    ])

    useEffect(() => {
        if (id) {
            getCart({
                axiosClientJwt,
                dispatch,
                id: +id,
                toast
            })
        }
    }, [id, refresh])

    return (
        <Fragment>
            <div className='py-8 px-10 mt-16'>
                <Row>
                    <Col>
                        <Breadcrumb spacing='8px' marginBottom='35px' separator={<ChevronRight size={14} />}>
                            <BreadcrumbItem>
                                <Link to='/' className='hover:text-primary hover:no-underline transition duration-150 text-sm font-medium'>Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem isCurrentPage>
                                <Link to='/#' className='!text-[#999] text-sm font-medium'>Checkout</Link>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[16, 0]}>
                            <Col span={18}>
                                {/* Item */}
                                <ProductCheckout
                                    control={control}
                                    refresh={refresh}
                                    setRefresh={setRefresh}
                                    resetField={resetField}
                                    setError={setError}
                                />
                                {/* Address */}
                                <Address address={address as UserAddress} setAddress={setAddress} />
                                {/* Coupon */}
                                <Coupon
                                    control={control}
                                    errors={errors}
                                    handleSubmit={handleSubmit}
                                    refresh={refresh}
                                    setCouponModal={setCouponModal}
                                    setError={setError}
                                    setRefresh={setRefresh}
                                    setValue={setValue}
                                />
                                {/* Payment method */}
                                <div className='mb-[1rem]'>
                                    <Card variant="outline" padding={8}>
                                        <div className='text-center font-bold'>Payment methods</div>
                                        <Divider />
                                        <Row gutter={[12, 12]}>
                                            <Col span={12} >
                                                <Card
                                                    variant={paymentMethod === PaymentMethod.Standard ? "filled" : "outline"}
                                                    p={2} h="100%"
                                                    className='cursor-pointer flex justify-center items-center'
                                                    onClick={() => { setPaymentMethod(PaymentMethod.Standard) }}
                                                >
                                                    <span className='text-center font-semibold'>Payment on delivery</span>
                                                </Card>
                                            </Col>
                                            <Col span={12}>
                                                <Card
                                                    variant={paymentMethod === PaymentMethod.Card ? "filled" : "outline"}
                                                    p={2}
                                                    h="100%"
                                                    className='cursor-pointer flex justify-center items-center'
                                                    onClick={() => { setPaymentMethod(PaymentMethod.Card) }}
                                                >
                                                    <p className='text-center font-semibold'>Payment by Paypal</p>
                                                    <div className='flex flex-row justify-center mb-3'>
                                                        <img src={Icon1} alt="" />
                                                    </div>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card>
                                </div>
                            </Col>
                            <Col span={6}>
                                <Card padding={8} variant="outline">
                                    <div className='text-center font-bold'>Order</div>
                                    <Divider />
                                    <div className='flex justify-between items-center mb-1'>
                                        <span className='font-semibold'>Price</span>
                                        <span className='font-bold'>{formatMoney(!cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant.price : 0)}</span>
                                    </div>
                                    <div className='flex justify-between items-center mb-1'>
                                        <span className='font-semibold'>Quantity</span>
                                        <span className='font-bold'>x{!cart.cart.loading && cart.cart.result ? cart.cart.result.quantity : 0}</span>
                                    </div>
                                    {
                                        !checkout.promotion.loading && checkout.promotion.result ? (
                                            <div className='flex justify-between items-center mb-1'>
                                                <span className='font-semibold'>Coupon</span>
                                                <span className='font-bold'>{checkout.promotion.result.discount}%</span>
                                            </div>
                                        ) : null
                                    }
                                    <div className='flex justify-between items-center mb-4'>
                                        <span className='font-semibold'>Total</span>
                                        <span className='font-bold'>
                                            {formatMoney(!cart.cart.loading && cart.cart.result ? !checkout.promotion.loading && checkout.promotion.result ? cart.cart.result.product_variant.price * cart.cart.result.quantity * ((100 - checkout.promotion.result.discount) / 100) : cart.cart.result.product_variant.price * cart.cart.result.quantity : 0)}
                                        </span>
                                    </div>
                                    {
                                        !cart.cart.loading && cart.cart.result && cart.cart.result.quantity && cart.cart.result.product_variant.id && address && paymentMethod ? (
                                            <div>
                                                <Button
                                                    className='w-full'
                                                    type='primary'
                                                    loading={paymentMethod === PaymentMethod.Standard ? checkout.createOrder.loading : false}
                                                    onClick={() => {
                                                        if (paymentMethod === PaymentMethod.Standard) {
                                                            createOrder({
                                                                axiosClientJwt,
                                                                dispatch,
                                                                navigate,
                                                                order: {
                                                                    address_id: address.id,
                                                                    payment_method: paymentMethod,
                                                                    product_variant_id: cart.cart.result?.product_variant.id as number,
                                                                    quantity: cart.cart.result?.quantity as number,
                                                                    ...checkout.promotion.result && { promotion_id: checkout.promotion.result.id }
                                                                },
                                                                toast
                                                            })
                                                        } else {
                                                            createOrderByPayment(axiosClientJwt, {
                                                                address_id: address.id,
                                                                payment_method: paymentMethod,
                                                                product_variant_id: cart.cart.result?.product_variant.id as number,
                                                                quantity: cart.cart.result?.quantity as number,
                                                                ...checkout.promotion.result && { promotion_id: checkout.promotion.result.id }
                                                            }).then((data: any) => {
                                                                window.location.replace(data?.paymentUrl);
                                                                dispatch(resetPromotion())
                                                            })
                                                        }
                                                    }}
                                                >
                                                    Pay
                                                </Button>
                                            </div>) : null
                                    }
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <CouponModal couponModal={couponModal} setCouponModal={setCouponModal} />
        </Fragment>
    );
};

export default CheckoutPage;