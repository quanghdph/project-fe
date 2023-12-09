import {
    getListCustomerStart,
    getListCustomerSuccess,
    getListCustomerFailed,
    deleteCustomerStart,
    deleteCustomerSuccess,
    deleteCustomerFailed,
    getCustomerStart,
    getCustomerSuccess,
    getCustomerFailed,
    createCustomerStart,
    createCustomerSuccess,
    createCustomerFailed,
    updateCustomerStart,
    updateCustomerSuccess,
    updateCustomerFailed
} from "./customerSlice";
import { Inotification } from 'src/common';
import { IAxiosResponse } from "src/types/axiosResponse";
import { User } from "src/types/user";
import { FormValuesCustomer } from "src/components/Customers/create-update";
import { CreateCustomerParams, DeleteCustomerParams, GetCustomerParams, GetListCustomerParams, UpdateCustomerParams } from "./type";

export const getListCustomer = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListCustomerParams) => {
    try {
        const { skip, take, search, status } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListCustomerStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.get('/user/customers', {
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
                dispatch(getListCustomerSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getListCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(getListCustomerFailed(null));
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

export const deleteCustomer = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteCustomerParams) => {
    try {
        dispatch(deleteCustomerStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<User> = await axiosClientJwt.delete(`/user/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteCustomerSuccess(res.response.data))
                message.success('Xóa khách hàng thành công!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteCustomerFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deleteCustomerFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                setIsModalOpen(false)
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

export const createCustomer = async ({ customer, axiosClientJwt, dispatch, navigate, setError, message }: CreateCustomerParams) => {
    try {
        const { active, email, first_name, last_name, date_of_birth, gender, phone, password } = customer;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(createCustomerStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.post('/auth/customer/register', {
            active,
            email,
            first_name,
            last_name,
            date_of_birth,
            gender,
            phone,
            password
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createCustomerSuccess(res.response.data));
                message.success('Tạo khách hàng thành công!');
                navigate("/customers")
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(createCustomerFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesCustomer, { message: res?.response?.message })
        } else {
            dispatch(createCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(createCustomerFailed(null));
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

export const getCustomer = async ({ id, dispatch, axiosClientJwt, navigate }: GetCustomerParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getCustomerStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.get(`/user/customer/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getCustomerSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(getCustomerFailed(null));
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

export const updateCustomer = async ({ customer, axiosClientJwt, dispatch, navigate, setError, message, id }: UpdateCustomerParams) => {
    try {
        const { active, email, first_name, last_name, date_of_birth, gender, phone } = customer;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateCustomerStart());
        const [res]: [IAxiosResponse<User>] = await Promise.all([
            await axiosClientJwt.put(`/user/customer/update/${id}`, {
                active,
                email,
                first_name,
                last_name,
                date_of_birth,
                gender,
                phone,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateCustomerSuccess(res.response.data));
                message.success('Cập nhật khách hàng thành công!');
                navigate("/customers")
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(updateCustomerFailed(null));
            setError(res?.response?.fieldError as keyof Omit<FormValuesCustomer, "password">, { message: res?.response?.message })
        } else {
            dispatch(updateCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(updateCustomerFailed(null));
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


