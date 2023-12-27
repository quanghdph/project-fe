import {
    getListMaterialStart,
    getListMaterialSuccess,
    getListMaterialFailed,
    deleteMaterialStart,
    deleteMaterialSuccess,
    deleteMaterialFailed,
    getMaterialStart,
    getMaterialSuccess,
    getMaterialFailed,
    createMaterialStart,
    createMaterialSuccess,
    createMaterialFailed,
    updateMaterialStart,
    updateMaterialSuccess,
    updateMaterialFailed,
} from "./materialSlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";
import { FormValuesCategory } from "src/components/Catalog/Categories/create-update";
// import { CreateCategoryParams, DeleteCategoryParams, GetCategoryParams, GetListCategoryParams, UpdateCategoryParams } from "./type";

export const getListMaterial = async ({ params, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        const {page, limit, filter} = params
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListMaterialStart());
        const url = page || limit || filter ? `/material?page=${page}&limit=${limit}&filter=${filter}` : '/material'
        const res: any = await axiosClientJwt.get(url
        , {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        );
        
        if (res?.status === 200 && res?.data && res?.data.listMaterials) {
            setTimeout(function () {
                dispatch(getListMaterialSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getListMaterialFailed(null));
        }
    } catch (error: any) {
        dispatch(getListMaterialFailed(null));
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

export const deleteMaterial = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: any) => {
    try {
        dispatch(deleteMaterialStart());
        // const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/material/${id}`
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );

        if(res.data.operationResult == "ERROR") {
            dispatch(deleteMaterialFailed(res.data.operationMessage));
                setTimeout(function () {
                setIsModalOpen(false)
            }, 300)
            Inotification({
                type: 'error',
                message: res.data.operationMessage
            })
        }

        if(res.data.operationResult == "SUCCESS") {
            dispatch(deleteMaterialFailed(res.data.operationMessage));
                setTimeout(function () {
                setIsModalOpen(false)
            }, 300)
            message.success(res.data.operationMessage);
            setIsModalOpen(false)
            setRefresh(!refresh)
        }


        // if (res?.response?.code === 200 && res?.response?.success) {
        //     setTimeout(function () {
        //         dispatch(deleteMaterialSuccess(res.response.data))
        //         message.success('Xóa màu thành công!')
        //         setIsModalOpen(false)
        //         setRefresh(!refresh)
        //     }, 1000);
        // } else {
        //     dispatch(deleteMaterialFailed(null));
        //     setTimeout(function () {
        //         setIsModalOpen(false)
        //     }, 1000)

        // }
    } catch (error: any) {
        dispatch(deleteMaterialFailed(null));
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

export const createMaterial = async ({ material, dispatch, axiosClientJwt, navigate, message, setError }: any) => {
    try {
        const { materialName, materialCode } = material
        dispatch(createMaterialStart());
        // const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.post(`/material`, {
            materialName,
            materialCode,
        }
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(createMaterialSuccess(res.data));
                message.success('Tạo chất liệu thành công!');
                navigate("/catalog/material")
            }, 1000);
        }
        // else if (res?.response?.code === 400 && !res?.response?.success) {
        //     dispatch(createMaterialFailed(null));
        //     setError(res?.response?.fieldError as keyof FormValuesMaterial, { message: res?.response?.message })
        // } 
        else {
            dispatch(createMaterialFailed(null));
        }
    } catch (error: any) {
        dispatch(createMaterialFailed(null));
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

export const getMaterial= async ({ id, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        // const accessToken = localStorage.getItem("accessToken")
        dispatch(getMaterialStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/material/${id}`
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        if (res?.status === 200) {
            setTimeout(function () {
                dispatch(getMaterialSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getMaterialFailed(null));
        }
    } catch (error: any) {
        dispatch(getMaterialFailed(null));
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

export const updateMaterial = async ({ material, axiosClientJwt, dispatch, navigate, setError, message, id }: any) => {
    try {
        const { materialName, materialCode } = material
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateMaterialStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/material/${id}`, {
                materialName,
                materialCode,
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
                dispatch(updateMaterialSuccess(res.data));
                message.success('Cập nhật chất liệu thành công');
                navigate("/catalog/material")
            }, 1000)
        }
        
        // else if (res?.response?.code === 400 && !res?.response?.success) {
        //     dispatch(updateMaterialFailed(null));
        //     setError(res?.response?.fieldError as keyof FormValuesMaterial, { message: res?.response?.message })
        // } 
        
        else {
            dispatch(updateMaterialFailed(null));
        }
    } catch (error: any) {
        dispatch(updateMaterialFailed(null));
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
