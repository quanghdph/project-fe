import {
    getListWaistbandStart,
    getListWaistbandSuccess,
    getListWaistbandFailed,
    deleteWaistbandStart,
    deleteWaistbandSuccess,
    deleteWaistbandFailed,
    getWaistbandStart,
    getWaistbandSuccess,
    getWaistbandFailed,
    createWaistbandStart,
    createWaistbandSuccess,
    createWaistbandFailed,
    updateWaistbandStart,
    updateWaistbandSuccess,
    updateWaistbandFailed,
} from "./waistbandSlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";
import { FormValuesCategory } from "src/components/Catalog/Categories/create-update";
// import { CreateCategoryParams, DeleteCategoryParams, GetCategoryParams, GetListCategoryParams, UpdateCategoryParams } from "./type";

export const getListWaistband = async ({ params, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        const {page, limit, filter} = params
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListWaistbandStart());
        const url = page || limit || filter ? `/waistband?page=${page}&limit=${limit}&filter=${filter}` : '/waistband'
        const res: any = await axiosClientJwt.get(url
        , {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        );
        
        if (res?.status === 200 && res?.data && res?.data) {
            setTimeout(function () {
                dispatch(getListWaistbandSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getListWaistbandFailed(null));
        }
    } catch (error: any) {
        dispatch(getListWaistbandFailed(null));
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

export const deleteWaistband = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: any) => {
    try {
        dispatch(deleteWaistbandStart());
        // const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/waistband/${id}`
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );

        if(res.data.operationResult == "ERROR") {
            dispatch(deleteWaistbandFailed(res.data.operationMessage));
                setTimeout(function () {
                setIsModalOpen(false)
            }, 300)
            Inotification({
                type: 'error',
                message: res.data.operationMessage
            })
        }

        if(res.data.operationResult == "SUCCESS") {
            dispatch(deleteWaistbandFailed(res.data.operationMessage));
                setTimeout(function () {
                setIsModalOpen(false)
            }, 300)
            message.success(res.data.operationMessage);
            setIsModalOpen(false)
            setRefresh(!refresh)
        }


        // if (res?.response?.code === 200 && res?.response?.success) {
        //     setTimeout(function () {
        //         dispatch(deleteWaistbandSuccess(res.response.data))
        //         message.success('Xóa màu thành công!')
        //         setIsModalOpen(false)
        //         setRefresh(!refresh)
        //     }, 1000);
        // } else {
        //     dispatch(deleteWaistbandFailed(null));
        //     setTimeout(function () {
        //         setIsModalOpen(false)
        //     }, 1000)

        // }
    } catch (error: any) {
        dispatch(deleteWaistbandFailed(null));
        // if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
        //     Inotification({
        //         type: 'error',
        //         message: 'Bạn không có quyền để thực hiện hành động này!'
        //     })
        //     setTimeout(function () {
        //         setIsModalOpen(false)
        //         navigate('/')
        //     }, 1000);
        // } else {
        //     Inotification({
        //         type: 'error',
        //         message: 'Something went wrong!'
        //     })
        // }
        Inotification({
                type: 'error',
                message: 'Something went wrong!'
        })
    }
}

export const createWaistband = async ({ waistband, dispatch, axiosClientJwt, navigate, message, setError }: any) => {
    try {
        const { waistbandName, waistbandCode } = waistband
        dispatch(createWaistbandStart());
        // const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.post(`/waistband`, {
            waistbandName,
            waistbandCode,
        }
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(createWaistbandSuccess(res.data));
                message.success('Tạo cạp quần thành công!');
                navigate("/catalog/waistbands")
            }, 1000);
        }
        // else if (res?.response?.code === 400 && !res?.response?.success) {
        //     dispatch(createWaistbandFailed(null));
        //     setError(res?.response?.fieldError as keyof FormValuesWaistband, { message: res?.response?.message })
        // } 
        else {
            dispatch(createWaistbandFailed(null));
        }
    } catch (error: any) {
        dispatch(createWaistbandFailed(null));
        // if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
        //     Inotification({
        //         type: 'error',
        //         message: 'Bạn không có quyền để thực hiện hành động này!'
        //     })
        //     setTimeout(function () {
        //         navigate('/')
        //     }, 1000);
        // } else {
        //     Inotification({
        //         type: 'error',
        //         message: 'Something went wrong!'
        //     })
        // }
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const getWaistband= async ({ id, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        // const accessToken = localStorage.getItem("accessToken")
        dispatch(getWaistbandStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/waistband/${id}`
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        if (res?.status === 200) {
            setTimeout(function () {
                dispatch(getWaistbandSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getWaistbandFailed(null));
        }
    } catch (error: any) {
        dispatch(getWaistbandFailed(null));
        // if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
        //     Inotification({
        //         type: 'error',
        //         message: 'Bạn không có quyền để thực hiện hành động này!'
        //     })
        //     setTimeout(function () {
        //         navigate('/')
        //     }, 1000);
        // } else {
        //     Inotification({
        //         type: 'error',
        //         message: 'Something went wrong!'
        //     })
        // }
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const updateWaistband = async ({ waistband, axiosClientJwt, dispatch, navigate, setError, message, id }: any) => {
    try {
        const { waistbandName, waistbandCode } = waistband
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateWaistbandStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/waistband/${id}`, {
                waistbandName,
                waistbandCode,
            }
            // , {
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`
            //     }
            // }
            ),
        ])
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(updateWaistbandSuccess(res.data));
                message.success('Cập nhật cạp quần thành công');
                navigate("/catalog/waistbands")
            }, 1000)
        }
        
        // else if (res?.response?.code === 400 && !res?.response?.success) {
        //     dispatch(updateWaistbandFailed(null));
        //     setError(res?.response?.fieldError as keyof FormValuesWaistband, { message: res?.response?.message })
        // } 
        
        else {
            dispatch(updateWaistbandFailed(null));
        }
    } catch (error: any) {
        dispatch(updateWaistbandFailed(null));
        // if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
        //     Inotification({
        //         type: 'error',
        //         message: 'Bạn không có quyền để thực hiện hành động này!'
        //     })
        //     setTimeout(function () {
        //         navigate('/')
        //     }, 1000);
        // } else {
        //     Inotification({
        //         type: 'error',
        //         message: 'Something went wrong!'
        //     })
        // }
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const getListSearchWaistband = async ({ params, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        const {value} = params
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListWaistbandStart());
        const res: any = await axiosClientJwt.get(`/waistband/search?waistbandName=${value}`
        , {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        );
        
        if (res?.status === 200 && res?.data && res?.data) {
            setTimeout(function () {
                dispatch(getListWaistbandSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getListWaistbandFailed(null));
        }
    } catch (error: any) {
        dispatch(getListWaistbandFailed(null));
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}
