import { Box, Card, Flex, useToast } from '@chakra-ui/react';
import { Button, Divider, Input, Form } from 'antd';
import * as React from 'react';
import { Control, Controller, FieldErrors, UseFormHandleSubmit, UseFormSetError, UseFormSetValue } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { FormValues } from 'src/pages/CheckoutPage';
import autoAnimate from '@formkit/auto-animate';
import { checkPromotion, resetPromotionAction } from 'src/features/checkout/action';
import { createAxiosClient } from 'src/axios/axiosInstance';

interface CouponProps {
    setCouponModal: (couponModal: boolean) => void
    control: Control<FormValues, any>
    refresh: boolean
    setRefresh: (refresh: boolean) => void
    handleSubmit: UseFormHandleSubmit<FormValues>
    errors: FieldErrors<FormValues>
    setValue: UseFormSetValue<FormValues>
    setError: UseFormSetError<FormValues>
}

const Coupon = ({ setCouponModal, control, refresh, setRefresh, handleSubmit, errors, setValue, setError }: CouponProps) => {
    const toast = useToast()

    const dispatch = useAppDispatch();
    const axiosClient = createAxiosClient();

    const couponCodeErrorRef = React.useRef(null);

    React.useEffect(() => {
        couponCodeErrorRef.current && autoAnimate(couponCodeErrorRef.current);
    }, [parent])

    const checkout = useAppSelector((state) => state.checkout);

    const onApplyPromotion = (data: FormValues) => {
        checkPromotion({
            axiosClient,
            coupon_code: data.coupon_code,
            dispatch,
            refresh,
            setError,
            setRefresh,
            toast
        })
    }

    return (
        <div className='mb-[1rem]'>
            <Card variant="outline" padding={8} >
                <Flex justifyContent="flex-end">
                    <Button onClick={() => setCouponModal(true)}>See available coupons</Button>
                </Flex>
                <div className='text-center font-bold'>Coupon code</div>
                <Divider />
                <Form className='flex'>
                    <Controller
                        name="coupon_code"
                        control={control}
                        render={({ field }) => {
                            return (
                                <div ref={couponCodeErrorRef} className='flex-1'>
                                    <Input {...field} />
                                    {errors?.coupon_code ? <Box as="div" mt={1} textColor="red.600">{errors.coupon_code.message}</Box> : null}
                                </div>
                            )
                        }}
                    />
                    <Button
                        className='ml-2'
                        type='primary'
                        onClick={handleSubmit(onApplyPromotion)}
                        disabled={!checkout.promotion.loading && checkout.promotion.result ? true : false}
                        loading={checkout.promotion.loading}
                    >
                        Apply
                    </Button>
                    {
                        !checkout.promotion.loading && checkout.promotion.result ? (
                            <Button
                                className='ml-2'
                                type='primary'
                                danger
                                onClick={() => {
                                    setValue("coupon_code", '')
                                    resetPromotionAction({
                                        dispatch,
                                        refresh,
                                        setRefresh
                                    })
                                }}
                            >
                                Cancel application
                            </Button>
                        ) : null
                    }
                </Form>
            </Card>
        </div>
    );
};

export default Coupon;