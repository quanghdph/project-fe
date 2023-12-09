import {
    checkPromotionFailed,
    checkPromotionStart,
    checkPromotionSuccess,
    resetPromotion,
    createOrderStart,
    createOrderSuccess,
    createOrderFailed
} from './checkoutSlice'
import { AxiosInstance } from "axios";
import { IAxiosResponse } from 'src/shared/types';
import { CheckPromotionParams, CreateOrderParams, OrderCreate, ResetPromotionActionParams } from './type';

export const checkPromotion = async ({ axiosClient, dispatch, refresh, setError, setRefresh, toast, coupon_code }: CheckPromotionParams) => {
    try {
        dispatch(checkPromotionStart());
        const res: IAxiosResponse<{}> = await axiosClient.post('promotion/check-code', {
            coupon_code
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(checkPromotionSuccess(res.response.data));
                setRefresh(!refresh)
            }, 1000);
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            setTimeout(function () {
                dispatch(checkPromotionFailed(null));
                setError(res.response.fieldError, { message: res.response.message })
            }, 1000);
        } else if (res?.response?.code === 404 && !res?.response?.success) {
            setTimeout(function () {
                dispatch(checkPromotionFailed(null));
                setError(res.response.fieldError, { message: res.response.message })
            }, 1000);
        } else {
            dispatch(checkPromotionFailed(null));
        }
    } catch (error) {
        dispatch(checkPromotionFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
            position: "top-right",
            variant: 'left-accent',
        })
    }
}

export const resetPromotionAction = ({ dispatch, refresh, setRefresh }: ResetPromotionActionParams) => {
    setTimeout(function () {
        dispatch(resetPromotion());
        setRefresh(!refresh)
    }, 1000);
}

export const createOrderByPayment = async (axiosClientJwt: AxiosInstance, order: OrderCreate) => {
    try {
        const { address_id, payment_method, product_variant_id, quantity, promotion_id } = order;
        const accessToken = localStorage.getItem("accessToken")
        return await axiosClientJwt.post('/order/payment', {
            address_id,
            payment_method,
            product_variant_id,
            quantity,
            promotion_id
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    } catch (error) {
        console.log(error)
    }
}

export const createOrder = async ({ axiosClientJwt, dispatch, navigate, order, toast }: CreateOrderParams) => {
    try {
        const { address_id, payment_method, product_variant_id, quantity, promotion_id } = order;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(createOrderStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.post('/order/create', {
            address_id,
            payment_method,
            product_variant_id,
            quantity,
            promotion_id
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createOrderSuccess(res.response.data));
                dispatch(resetPromotion())
                toast({
                    status: 'success',
                    title: "Successfully!",
                    position: "top-right",
                    variant: 'left-accent',
                    isClosable: true,
                })
                navigate('/account')
            }, 1000)
        } else {
            dispatch(createOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(createOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            toast({
                status: 'error',
                title: "You do not have permission to perform this action!",
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
        } else {
            toast({
                status: 'error',
                title: "Something went wrong!",
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
        }
    }
}