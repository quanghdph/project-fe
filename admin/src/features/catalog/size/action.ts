import {
    getListSizeStart,
    getListSizeSuccess,
    getListSizeFailed,
    deleteSizeStart,
    deleteSizeSuccess,
    deleteSizeFailed,
    getSizeStart,
    getSizeSuccess,
    getSizeFailed,
    createSizeStart,
    createSizeSuccess,
    createSizeFailed,
    updateSizeStart,
    updateSizeSuccess,
    updateSizeFailed,
} from "./sizeSlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";
import { FormValuesCategory } from "src/components/Catalog/Categories/create-update";
// import { CreateCategoryParams, DeleteCategoryParams, GetCategoryParams, GetListCategoryParams, UpdateCategoryParams } from "./type";

export const getListSize = async ({ params, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        const {page, limit, filter} = params
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListSizeStart());
        const url = page || limit || filter ? `/size?page=${page}&limit=${limit}&filter=${filter}` : '/size'
        const res: any = await axiosClientJwt.get(url
        , {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        );
        
        if (res?.status === 200 && res?.data && res?.data.listSizes) {
            setTimeout(function () {
                dispatch(getListSizeSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getListSizeFailed(null));
        }
    } catch (error: any) {
        dispatch(getListSizeFailed(null));
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

export const deleteSize = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: any) => {
    try {
        dispatch(deleteSizeStart());
        // const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/size/${id}`
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );

        if(res.data.operationResult == "ERROR") {
            dispatch(deleteSizeFailed(res.data.operationMessage));
                setTimeout(function () {
                setIsModalOpen(false)
            }, 300)
            Inotification({
                type: 'error',
                message: res.data.operationMessage
            })
        }

        if(res.data.operationResult == "SUCCESS") {
            dispatch(deleteSizeFailed(res.data.operationMessage));
                setTimeout(function () {
                setIsModalOpen(false)
            }, 300)
            message.success(res.data.operationMessage);
            setIsModalOpen(false)
            setRefresh(!refresh)
        }


        // if (res?.response?.code === 200 && res?.response?.success) {
        //     setTimeout(function () {
        //         dispatch(deleteSizeSuccess(res.response.data))
        //         message.success('Xóa màu thành công!')
        //         setIsModalOpen(false)
        //         setRefresh(!refresh)
        //     }, 1000);
        // } else {
        //     dispatch(deleteSizeFailed(null));
        //     setTimeout(function () {
        //         setIsModalOpen(false)
        //     }, 1000)

        // }
    } catch (error: any) {
        dispatch(deleteSizeFailed(null));
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

export const createSize = async ({ size, dispatch, axiosClientJwt, navigate, message, setError }: any) => {
    try {
        const { sizeName, sizeCode } = size
        dispatch(createSizeStart());
        // const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.post(`/size`, {
            sizeName,
            sizeCode,
        }
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(createSizeSuccess(res.data));
                message.success('Tạo kích thước thành công!');
                navigate("/catalog/sizes")
            }, 1000);
        }
        // else if (res?.response?.code === 400 && !res?.response?.success) {
        //     dispatch(createSizeFailed(null));
        //     setError(res?.response?.fieldError as keyof FormValuesSize, { message: res?.response?.message })
        // } 
        else {
            dispatch(createSizeFailed(null));
        }
    } catch (error: any) {
        dispatch(createSizeFailed(null));
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

export const getSize= async ({ id, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        // const accessToken = localStorage.getItem("accessToken")
        dispatch(getSizeStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/size/${id}`
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        if (res?.status === 200) {
            setTimeout(function () {
                dispatch(getSizeSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getSizeFailed(null));
        }
    } catch (error: any) {
        dispatch(getSizeFailed(null));
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

export const updateSize = async ({ size, axiosClientJwt, dispatch, navigate, setError, message, id }: any) => {
    try {
        const { sizeName, sizeCode } = size
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateSizeStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/size/${id}`, {
                sizeName,
                sizeCode,
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
                dispatch(updateSizeSuccess(res.data));
                message.success('Cập nhật kích thước thành công');
                navigate("/catalog/sizes")
            }, 1000)
        }
        
        // else if (res?.response?.code === 400 && !res?.response?.success) {
        //     dispatch(updateSizeFailed(null));
        //     setError(res?.response?.fieldError as keyof FormValuesSize, { message: res?.response?.message })
        // } 
        
        else {
            dispatch(updateSizeFailed(null));
        }
    } catch (error: any) {
        dispatch(updateSizeFailed(null));
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
