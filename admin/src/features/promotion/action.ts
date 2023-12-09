import {
    deletePromotionStart,
    deletePromotionSuccess,
    deletePromotionFailed,
    createPromotionStart,
    createPromotionSuccess,
    createPromotionFailed,
    updatePromotionStart,
    updatePromotionSuccess,
    updatePromotionFailed,
    getPromotionStart,
    getPromotionSuccess,
    getPromotionFailed,
    getListPromotionStart,
    getListPromotionSuccess,
    getListPromotionFailed
} from "./promotionSlice";
import { IAxiosResponse } from "src/types/axiosResponse";
import { Inotification } from "src/common";
import { FormValuesPromotion } from "src/components/Marketing/Promotions/create-update";
import { CreatePromotionParams, DeletePromotionParams, GetListPromotionParams, GetPromotionParams, UpdatePromotionParams } from "./type";

export const getListPromotion = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListPromotionParams) => {
    try {
        const { skip, take, search, status } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListPromotionStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get('/promotion', {
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
                dispatch(getListPromotionSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getListPromotionFailed(null));
        }
    } catch (error: any) {
        dispatch(getListPromotionFailed(null));
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

export const deletePromotion = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeletePromotionParams) => {
    try {
        dispatch(deletePromotionStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/promotion/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deletePromotionSuccess(res.response.data))
                message.success('Xóa khuyến mãi thành công!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deletePromotionFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deletePromotionFailed(null));
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

export const createPromotion = async ({ promotion, dispatch, axiosClientJwt, navigate, message, setError }: CreatePromotionParams) => {
    try {
        const { active, coupon_code, ends_at, name, starts_at, discount, limit } = promotion
        dispatch(createPromotionStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.post(`/promotion/create`, {
            active,
            coupon_code,
            ends_at,
            name,
            starts_at,
            discount,
            limit
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createPromotionSuccess(res.response.data));
                message.success('Tạo khuyến mãi thành công!');
                navigate("/marketing/promotions")
            }, 1000);
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(createPromotionFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesPromotion, { message: res?.response?.message })
        } else {
            dispatch(createPromotionFailed(null));
        }
    } catch (error: any) {
        dispatch(createPromotionFailed(null));
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

export const getPromotion = async ({ id, dispatch, axiosClientJwt, navigate }: GetPromotionParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getPromotionStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/promotion/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getPromotionSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getPromotionFailed(null));
        }
    } catch (error: any) {
        dispatch(getPromotionFailed(null));
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

export const updatePromotion = async ({ promotion, axiosClientJwt, dispatch, navigate, setError, message, id }: UpdatePromotionParams) => {
    try {
        const { active, coupon_code, ends_at, name, starts_at, discount, limit } = promotion;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updatePromotionStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/promotion/update/${id}`, {
                active,
                coupon_code,
                ends_at,
                name,
                starts_at,
                discount,
                limit
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updatePromotionSuccess(res.response.data));
                message.success('Cập nhật khuyến mãi thành công!');
                navigate("/marketing/promotions")
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(updatePromotionFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesPromotion, { message: res?.response?.message })
        } else {
            dispatch(updatePromotionFailed(null));
        }
    } catch (error: any) {
        dispatch(updatePromotionFailed(null));
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