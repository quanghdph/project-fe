import { IAxiosResponse } from "src/shared/types";
import {
    getListOrderStart,
    getListOrderSuccess,
    getListOrderFailed,
    cancelOrderStart,
    cancelOrderSuccess,
    cancelOrderFailed,
    refundOrderStart,
    refundOrderSuccess,
    refundOrderFailed
} from './orderSlice';
import { CancelOrderParams, GetListOrderParams, RefundOrderParams } from "./type";

export const getListOrder = async ({ pagination, dispatch, axiosClientJwt, navigate, toast }: GetListOrderParams) => {
    try {
        const { skip, take } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListOrderStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get('/order/customer', {
            params: {
                take,
                skip,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getListOrderSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getListOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(getListOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            toast({
                status: 'warning',
                title: 'You do not have permission to perform this action!',
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            toast({
                status: 'error',
                title: 'Something went wrong!',
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
        }
    }
}

export const cancelOrder = async ({ id, dispatch, axiosClientJwt, navigate, toast, refresh, setRefresh }: CancelOrderParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(cancelOrderStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.put(`/order/cancel/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(cancelOrderSuccess(res.response.data));
                toast({
                    status: 'success',
                    title: 'Order has been cancelled!',
                    isClosable: true,
                    position: "top-right",
                    variant: 'left-accent',
                })
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(cancelOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(cancelOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            toast({
                status: 'warning',
                title: 'You do not have permission to perform this action!',
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            toast({
                status: 'warning',
                title: 'Something went wrong!',
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
        }
    }
}

export const refundOrder = async ({ id, dispatch, axiosClientJwt, navigate, toast, refresh, setRefresh }: RefundOrderParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(refundOrderStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.put(`/order/refund/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(refundOrderSuccess(res.response.data));
                toast({
                    status: 'success',
                    title: 'Order has been refund!',
                    isClosable: true,
                    position: "top-right",
                    variant: 'left-accent',
                })
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(refundOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(refundOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            toast({
                status: 'warning',
                title: 'You do not have permission to perform this action!',
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            toast({
                status: 'warning',
                title: 'Something went wrong!',
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
        }
    }
}