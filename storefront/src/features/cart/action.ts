import {
    addToCartStart,
    addToCartSuccess,
    addToCartFailed,
    getListProductOnCartStart,
    getListProductOnCartSuccess,
    getListProductOnCartFailed,
    deleteProductFromCartStart,
    deleteProductFromCartSuccess,
    deleteProductFromCartFailed,
    getCartStart,
    getCartSuccess,
    getCartFailed,
    updateCartStart,
    updateCartSuccess,
    updateCartFailed
} from "./cartSlice";
import { IAxiosResponse } from "src/shared/types/axiosResponse";
import { AddToCartParams, DeleteFromCartParams, GetCartParams, GetListProductOnCartParams, UpdateCartParams } from "./type";

export const addToCart = async ({ axiosClientJwt, cart, dispatch, id, toast }: AddToCartParams) => {
    try {
        const { quantity } = cart
        const accessToken = localStorage.getItem("accessToken")
        if (accessToken) {
            dispatch(addToCartStart());
            const res: IAxiosResponse<{}> = await axiosClientJwt.post(`product/cart/${id}`, {
                quantity
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (res?.response?.code === 200 && res?.response?.success) {
                setTimeout(function () {
                    dispatch(addToCartSuccess(res.response.data));
                    toast({
                        status: 'success',
                        variant: 'left-accent',
                        title: "Added in card!",
                        isClosable: true,
                        position: "top-right"
                    })
                }, 1000);
            } else if (res?.response?.code === 400 && !res?.response?.success) {
                dispatch(addToCartFailed(null));
                toast({
                    status: 'warning',
                    title: res?.response?.message,
                    isClosable: true,
                    variant: 'left-accent',
                    position: "top-right"
                })
            } else {
                dispatch(addToCartFailed(null));
            }
        } else {
            toast({
                status: 'error',
                title: "You need to login to perform this action!",
                variant: 'left-accent',
                isClosable: true,
                position: "top-right"
            })
        }
    } catch (error: any) {
        dispatch(addToCartFailed(null));
        toast({
            status: 'error',
            variant: 'left-accent',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}

export const getListProductOnCart = async ({ axiosClientJwt, dispatch, toast }: GetListProductOnCartParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListProductOnCartStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`product/cart`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getListProductOnCartSuccess(res.response.data));
            }, 1000);
        } else {
            dispatch(getListProductOnCartFailed(null));
        }
    } catch (error: any) {
        dispatch(getListProductOnCartFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}

export const deleteFromCart = async ({ axiosClientJwt, dispatch, id, toast, refresh, setRefresh }: DeleteFromCartParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(deleteProductFromCartStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`product/cart/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteProductFromCartSuccess(res.response.data));
                toast({
                    status: 'success',
                    title: "Deleted from card!",
                    isClosable: true,
                    position: "top-right",
                    variant: 'left-accent',
                })
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteProductFromCartFailed(null));
        }
    } catch (error: any) {
        dispatch(deleteProductFromCartFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
            position: "top-right",
            variant: 'left-accent',
        })
    }
}

export const getCart = async ({ axiosClientJwt, dispatch, id, toast }: GetCartParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getCartStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`product/cart/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            dispatch(getCartSuccess(res.response.data));
        } else {
            dispatch(getCartFailed(null));
        }
    } catch (error: any) {
        dispatch(getCartFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}

export const updateCart = async ({ axiosClientJwt, dispatch, id, toast, cart, refresh, setRefresh, setError }: UpdateCartParams) => {
    try {
        const { quantity } = cart
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateCartStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.put(`product/cart/update/${id}`, {
            quantity
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateCartSuccess(res.response.data));
                setRefresh(!refresh)
            }, 1000);
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            setTimeout(function () {
                dispatch(updateCartFailed(null));
                setError(res.response.fieldError, { message: res.response.message })
            }, 1000);
        } else {
            dispatch(updateCartFailed(null));
        }
    } catch (error: any) {
        dispatch(updateCartFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}


