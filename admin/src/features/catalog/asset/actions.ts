import {
    getListAssetStart,
    getListAssetSuccess,
    getListAssetFailed,
    deleteAssetStart,
    deleteAssetSuccess,
} from "./assetSlice";
import { Inotification } from 'src/common';
import { IAxiosResponse } from "src/types/axiosResponse";
import { DeleteAssetParams, GetListAssetParams } from "./type";

export const getListAsset = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListAssetParams) => {
    try {
        const { skip, take, search } = pagination;
        dispatch(getListAssetStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.get('/asset', {
            params: {
                take,
                skip,
                search
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getListAssetSuccess(res.response.data));
            }, 1000);
        } else {
            getListAssetFailed(null)
        }
    } catch (error: any) {
        dispatch(getListAssetFailed(null));
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

export const deleteAsset = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteAssetParams) => {
    try {
        dispatch(deleteAssetStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/asset/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteAssetSuccess(res.response.data))
                message.success('Xóa ảnh thành công!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteAssetSuccess(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deleteAssetSuccess(null));
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
