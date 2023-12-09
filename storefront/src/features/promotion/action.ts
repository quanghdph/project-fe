import { AxiosInstance } from "axios";
import { AppDispatch } from "src/app/store";
import {
    getListPromotionStart,
    getListPromotionSuccess,
    getListPromotionFailed
} from "./promotionSlice";
import { IAxiosResponse, Pagination } from "src/shared/types";
import { CreateToastFnReturn } from "@chakra-ui/react";

interface GetListPromotionParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    toast: CreateToastFnReturn
}

export const getListPromotion = async ({ pagination, dispatch, axiosClientJwt, toast }: GetListPromotionParams) => {
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
            toast({
                status: 'warning',
                title: 'You do not have permission to perform this action!',
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
        } else {
            toast({
                status: 'error',
                title: 'Something went wrong!',
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
        }
    }
}

