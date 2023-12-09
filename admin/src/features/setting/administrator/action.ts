import {
    getListAdministratorStart,
    getListAdministratorSuccess,
    getListAdministratorFailed,
    deleteAdministratorStart,
    deleteAdministratorSuccess,
    deleteAdministratorFailed,
    getAdministratorStart,
    getAdministratorSuccess,
    getAdministratorFailed,
    createAdministratorStart,
    createAdministratorSuccess,
    createAdministratorFailed,
    updateAdministratorStart,
    updateAdministratorSuccess,
    updateAdministratorFailed
} from "./administratorSlice";
import { Inotification } from 'src/common';
import { IAxiosResponse } from "src/types/axiosResponse";
import { User } from "src/types/user";
import { FormValuesAdministrator } from "src/components/Settings/Administrators/create-update";
import { CreateAdministratorParams, DeleteAdministratorParams, GetAdministratorParams, GetListAdministratorParams, UpdateAdministratorParams } from "./type";

export const getListAdministrator = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListAdministratorParams) => {
    try {
        const { skip, take, search, status } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListAdministratorStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.get('/user/administrators', {
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
                dispatch(getListAdministratorSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(deleteAdministratorFailed(null));
        }
    } catch (error: any) {
        dispatch(getListAdministratorFailed(null));
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

export const deleteAdministrator = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteAdministratorParams) => {
    try {
        dispatch(deleteAdministratorStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<User> = await axiosClientJwt.delete(`/user/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteAdministratorSuccess(res.response.data))
                message.success('Xóa quản trị viên thành công!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteAdministratorFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deleteAdministratorFailed(null));
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

export const getAdministrator = async ({ id, dispatch, axiosClientJwt, navigate }: GetAdministratorParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getAdministratorStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.get(`/user/administrator/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getAdministratorSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getAdministratorFailed(null));
        }
    } catch (error: any) {
        dispatch(getAdministratorFailed(null));
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

export const createAdministrator = async ({ administrator, axiosClientJwt, dispatch, navigate, setError, message }: CreateAdministratorParams) => {
    try {
        const { active, email, first_name, last_name, date_of_birth, gender, phone, password } = administrator;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(createAdministratorStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.post('/auth/register', {
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
                dispatch(createAdministratorSuccess(res.response.data));
                message.success('Tạo quản trị viên thành công!');
                navigate("/settings/administrators")
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(createAdministratorFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesAdministrator, { message: res?.response?.message })
        } else {
            dispatch(createAdministratorFailed(null));
        }
    } catch (error: any) {
        dispatch(createAdministratorFailed(null));
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

export const updateAdministrator = async ({ administrator, axiosClientJwt, dispatch, navigate, setError, message, id }: UpdateAdministratorParams) => {
    try {
        const { active, email, first_name, last_name, date_of_birth, gender, phone, role_ids } = administrator;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateAdministratorStart());
        const [res, assign]: [IAxiosResponse<User>, IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/user/administrator/update/${id}`, {
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
            await axiosClientJwt.put(`/user/assign-roles-to-user/${id}`, { role_ids }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

        ])
        if (res?.response?.code === 200 && res?.response?.success && assign?.response?.code === 200 && assign?.response?.success) {
            setTimeout(function () {
                dispatch(updateAdministratorSuccess(res.response.data));
                message.success('Cập nhật quản trị viên thành công!');
                navigate("/settings/administrators")
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(updateAdministratorFailed(null));
            setError(res?.response?.fieldError as keyof Omit<FormValuesAdministrator, "password">, { message: res?.response?.message })
        } else {
            dispatch(updateAdministratorFailed(null));
        }
    } catch (error: any) {
        dispatch(updateAdministratorFailed(null));
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