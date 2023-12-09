import {
    deleteOrderStart,
    deleteOrderSuccess,
    deleteOrderFailed,
    getOrderStart,
    getOrderSuccess,
    getOrderFailed,
    getListOrderStart,
    getListOrderSuccess,
    getListOrderFailed,
    cancelOrderStart,
    cancelOrderSuccess,
    cancelOrderFailed,
    confirmOrderStart,
    confirmOrderSuccess,
    confirmOrderFailed,
    shippedOrderStart,
    shippedOrderSuccess,
    shippedOrderFailed,
    completedOrderStart,
    completedOrderSuccess,
    completedOrderFailed,
    refundOrderStart,
    refundOrderSuccess,
    refundOrderFailed
} from './actionSlice';
import { IAxiosResponse } from "src/types/axiosResponse";
import { Inotification } from "src/common";
import { CancelOrderParams, CompletedOrderParams, ConfirmOrderParams, DeleteOrderParams, GetListOrderParams, GetOrderParams, RefundOrderParams, ShippedOrderParams } from './type';

export const getListOrder = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListOrderParams) => {
    try {
        const { skip, take, search, status } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListOrderStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get('/order', {
            params: {
                take,
                skip,
                search,
                status
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
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const getOrder = async ({ id, dispatch, axiosClientJwt, navigate }: GetOrderParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getOrderStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/order/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getOrderSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(getOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const cancelOrder = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setRefresh }: CancelOrderParams) => {
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
                message.success('Đơn hàng đã được hủy!')
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(cancelOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(cancelOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const confirmOrder = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setRefresh }: ConfirmOrderParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(confirmOrderStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.put(`/order/confirm/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(confirmOrderSuccess(res.response.data));
                message.success('Đơn hàng đã được xác nhận!')
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(confirmOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(confirmOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const shippedOrder = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setRefresh }: ShippedOrderParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(shippedOrderStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.put(`/order/shipped/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(shippedOrderSuccess(res.response.data));
                message.success('Đơn hàng đang được vận chuyển!')
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(shippedOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(shippedOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const completedOrder = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setRefresh }: CompletedOrderParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(completedOrderStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.put(`/order/completed/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(completedOrderSuccess(res.response.data));
                message.success('Đơn hàng đã hoàn thành!')
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(completedOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(completedOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const refundOrder = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setRefresh }: RefundOrderParams) => {
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
                message.success('Đơn hàng đã hoàn trả!')
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(refundOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(refundOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const deleteOrder = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setRefresh }: DeleteOrderParams) => {
    try {
        dispatch(deleteOrderStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/order/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteOrderSuccess(res.response.data))
                message.success('Xóa đơn hàng thành công!')
                setRefresh(!refresh)
                navigate('/sales/orders')
            }, 1000);
        } else {
            dispatch(deleteOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(deleteOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}