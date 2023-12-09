import {
    deleteAddressStart,
    deleteAddressSuccess,
    deleteAddressFailed,
    createAddressStart,
    createAddressSuccess,
    createAddressFailed,
    updateAddressStart,
    updateAddressSuccess,
    updateAddressFailed,
    getAddressStart,
    getAddressSuccess,
    getAddressFailed,
    setDefaultShippingAddressStart,
    setDefaultShippingSuccess,
    setDefaultShippingFailed
} from "./addressSlice";
import { IAxiosResponse } from "src/shared/types";
import { CreateAddressParams, DeleteAddressParams, GetAddressParams, SetDefaultShippingAddressParams, UpdateAddressParams } from "./type";

export const deleteAddress = async ({ id, dispatch, axiosClientJwt, refresh, setIsModalOpen, setRefresh, toast }: DeleteAddressParams) => {
    try {
        dispatch(deleteAddressStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/address/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteAddressSuccess(res.response.data))
                toast({
                    status: 'success',
                    title: "Delete address successfully!",
                    position: "top-right",
                    variant: 'left-accent',
                    isClosable: true,
                })
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteAddressFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deleteAddressFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            toast({
                status: 'error',
                title: "You do not have permission to perform this action!",
                isClosable: true,
            })
        } else {
            toast({
                status: 'error',
                title: "Something went wrong!",
                isClosable: true,
            })
        }
    }
}

export const createAddress = async ({ address, axiosClientJwt, dispatch, refresh, setIsModalOpen, setRefresh, toast }: CreateAddressParams) => {
    try {
        const { city, country, customer_id, postal_code, province, street_line_1, street_line_2 } = address;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(createAddressStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.post('/address/create', {
            city,
            country,
            customer_id,
            postal_code,
            province,
            street_line_1,
            street_line_2
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createAddressSuccess(res.response.data));
                toast({
                    status: 'success',
                    title: "Create address successfully!",
                    position: "top-right",
                    variant: 'left-accent',
                    isClosable: true,
                })
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(createAddressFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)
        }
    } catch (error: any) {
        dispatch(createAddressFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            toast({
                status: 'error',
                title: "You do not have permission to perform this action!",
                isClosable: true,
            })
        } else {
            toast({
                status: 'error',
                title: "Something went wrong!",
                isClosable: true,
            })
        }
    }
}

export const getAddress = async ({ id, dispatch, axiosClientJwt, toast }: GetAddressParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getAddressStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/address/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getAddressSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getAddressFailed(null));
        }
    } catch (error: any) {
        dispatch(getAddressFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            setTimeout(function () {
                toast({
                    status: 'error',
                    title: "You do not have permission to perform this action!",
                    isClosable: true,
                    position: "top-right",
                    variant: 'left-accent',
                })
            }, 1000);
        } else {
            toast({
                status: 'error',
                title: "Something went wrong!",
                isClosable: true,
            })
        }
    }
}

export const updateAddress = async ({ address, axiosClientJwt, dispatch, id, refresh, setIsModalOpen, setRefresh, toast }: UpdateAddressParams) => {
    try {
        const { city, country, customer_id, postal_code, province, street_line_1, street_line_2 } = address;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateAddressStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/address/update/${id}`, {
                city,
                country,
                customer_id,
                postal_code,
                province,
                street_line_1,
                street_line_2
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateAddressSuccess(res.response.data));
                toast({
                    status: 'success',
                    title: "Update address successfully!",
                    position: "top-right",
                    variant: 'left-accent',
                    isClosable: true,
                })
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(updateAddressFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)
        }
    } catch (error: any) {
        dispatch(updateAddressFailed(null));
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

export const setDefaultShippingAddressAction = async ({ customer_id, axiosClientJwt, dispatch, id, refresh, setRefresh, toast }: SetDefaultShippingAddressParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(setDefaultShippingAddressStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/address/default-shipping-address/${id}`, {
                customer_id,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(setDefaultShippingSuccess(res.response.data));
                toast({
                    status: 'success',
                    title: 'Set default shipping address successfully!',
                    isClosable: true,
                    position: "top-right",
                    variant: 'left-accent',
                })
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(setDefaultShippingFailed(null));
        }
    } catch (error: any) {
        dispatch(setDefaultShippingFailed(null));
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

