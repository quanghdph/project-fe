import {
    getListCategoryStart,
    getListCategorySuccess,
    getListCategoryFailed,
    deleteCategoryStart,
    deleteCategorySuccess,
    deleteCategoryFailed,
    getCategoryStart,
    getCategorySuccess,
    getCategoryFailed,
    createCategoryStart,
    createCategorySuccess,
    createCategoryFailed,
    updateCategoryStart,
    updateCategorySuccess,
    updateCategoryFailed,
} from "./categorySlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";
import { FormValuesCategory } from "src/components/Catalog/Categories/create-update";
import { CreateCategoryParams, DeleteCategoryParams, GetCategoryParams, GetListCategoryParams, UpdateCategoryParams } from "./type";

export const getListCategory = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListCategoryParams) => {
    try {
        const { skip, take, search, status } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListCategoryStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get('/category', {
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
                dispatch(getListCategorySuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getListCategoryFailed(null));
        }
    } catch (error: any) {
        dispatch(getListCategoryFailed(null));
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

export const deleteCategory = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteCategoryParams) => {
    try {
        dispatch(deleteCategoryStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/category/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteCategorySuccess(res.response.data))
                message.success('Xóa danh mục thành công!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteCategoryFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deleteCategoryFailed(null));
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

export const createCategory = async ({ category, dispatch, axiosClientJwt, navigate, message, setError }: CreateCategoryParams) => {
    try {
        const { category_code, category_name, description, active, parent_id } = category
        dispatch(createCategoryStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.post(`/category/create`, {
            category_code,
            category_name,
            description,
            active,
            parent_id
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createCategorySuccess(res.response.data));
                message.success('Tạo danh mục thành công!');
                navigate("/catalog/categories")
            }, 1000);
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(createCategoryFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesCategory, { message: res?.response?.message })
        } else {
            dispatch(createCategoryFailed(null));
        }
    } catch (error: any) {
        dispatch(createCategoryFailed(null));
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

export const getCategory = async ({ id, dispatch, axiosClientJwt, navigate }: GetCategoryParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getCategoryStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/category/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getCategorySuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getCategoryFailed(null));
        }
    } catch (error: any) {
        dispatch(getCategoryFailed(null));
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

export const updateCategory = async ({ category, axiosClientJwt, dispatch, navigate, setError, message, id }: UpdateCategoryParams) => {
    try {
        const { active, category_code, category_name, parent_id, description } = category;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateCategoryStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/category/update/${id}`, {
                active,
                category_code,
                category_name,
                parent_id,
                description
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateCategorySuccess(res.response.data));
                message.success('Cập nhật danh mục thành công');
                navigate("/catalog/categories")
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(updateCategoryFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesCategory, { message: res?.response?.message })
        } else {
            dispatch(updateCategoryFailed(null));
        }
    } catch (error: any) {
        dispatch(updateCategoryFailed(null));
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