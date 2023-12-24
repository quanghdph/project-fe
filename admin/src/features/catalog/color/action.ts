import {
    getListColorStart,
    getListColorSuccess,
    getListColorFailed,
    deleteColorStart,
    deleteColorSuccess,
    deleteColorFailed,
    getColorStart,
    getColorSuccess,
    getColorFailed,
    createColorStart,
    createColorSuccess,
    createColorFailed,
    updateColorStart,
    updateColorSuccess,
    updateColorFailed,
} from "./colorSlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";
import { FormValuesCategory } from "src/components/Catalog/Categories/create-update";
// import { CreateCategoryParams, DeleteCategoryParams, GetCategoryParams, GetListCategoryParams, UpdateCategoryParams } from "./type";

export const getListColor = async ({ params, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        const {page, limit, filter} = params
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListColorStart());
        const res: any = await axiosClientJwt.get(`/color?page=${page}&limit=${limit}&filter=${filter}`
        // , {
        //     params: {
        //         take,
        //         skip,
        //         search,
        //         status
        //     },
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        
        if (res?.status === 200 && res?.data && res?.data.listColors) {
            setTimeout(function () {
                dispatch(getListColorSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getListColorFailed(null));
        }
    } catch (error: any) {
        dispatch(getListColorFailed(null));
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

export const deleteColor = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: any) => {
    try {
        dispatch(deleteColorStart());
        // const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/color/${id}`
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );

        if(res.data.operationResult == "ERROR") {
            dispatch(deleteColorFailed(res.data.operationMessage));
                setTimeout(function () {
                setIsModalOpen(false)
            }, 300)
            Inotification({
                type: 'error',
                message: res.data.operationMessage
            })
        }

        if(res.data.operationResult == "SUCCESS") {
            dispatch(deleteColorSuccess(res.data.operationMessage))
                setTimeout(function () {
                setIsModalOpen(false)
            }, 300)
            message.success(res.data.operationMessage);
            setIsModalOpen(false)
            setRefresh(!refresh)
        }


        // if (res?.response?.code === 200 && res?.response?.success) {
        //     setTimeout(function () {
        //         dispatch(deleteColorSuccess(res.response.data))
        //         message.success('Xóa màu thành công!')
        //         setIsModalOpen(false)
        //         setRefresh(!refresh)
        //     }, 1000);
        // } else {
        //     dispatch(deleteColorFailed(null));
        //     setTimeout(function () {
        //         setIsModalOpen(false)
        //     }, 1000)

        // }
    } catch (error: any) {
        dispatch(deleteColorFailed(null));
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

export const createColor = async ({ color, dispatch, axiosClientJwt, navigate, message, setError }: any) => {
    try {
        const { colorName, colorCode } = color
        dispatch(createColorStart());
        // const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.post(`/color`, {
            colorName,
            colorCode,
        }
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        console.log(res);
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(createColorSuccess(res.data));
                message.success('Tạo màu sắc thành công!');
                navigate("/catalog/colors")
            }, 1000);
        }
        // else if (res?.response?.code === 400 && !res?.response?.success) {
        //     dispatch(createColorFailed(null));
        //     setError(res?.response?.fieldError as keyof FormValuesColor, { message: res?.response?.message })
        // } 
        else {
            dispatch(createColorFailed(null));
        }
    } catch (error: any) {
        dispatch(createColorFailed(null));
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

export const getColor= async ({ id, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        // const accessToken = localStorage.getItem("accessToken")
        dispatch(getColorStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/color/${id}`
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        if (res?.status === 200) {
            setTimeout(function () {
                dispatch(getColorSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getColorFailed(null));
        }
    } catch (error: any) {
        dispatch(getColorFailed(null));
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

export const updateColor = async ({ color, axiosClientJwt, dispatch, navigate, setError, message, id }: any) => {
    try {
        const { colorName, colorCode } = color
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateColorStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/color/${id}`, {
                colorName,
                colorCode,
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
                dispatch(updateColorSuccess(res.data));
                message.success('Cập nhật màu sắc thành công');
                navigate("/catalog/colors")
            }, 1000)
        }
        
        // else if (res?.response?.code === 400 && !res?.response?.success) {
        //     dispatch(updateColorFailed(null));
        //     setError(res?.response?.fieldError as keyof FormValuesColor, { message: res?.response?.message })
        // } 
        
        else {
            dispatch(updateColorFailed(null));
        }
    } catch (error: any) {
        dispatch(updateColorFailed(null));
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
