import { AxiosInstance } from "axios";
import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "src/app/store";
import { Pagination } from "src/types";
import { MessageApi } from "antd/lib/message";
import { UseFormSetError } from "react-hook-form";
import { FormValuesPromotion } from "src/components/Marketing/Promotions/create-update";

export interface GetListPromotionParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type DeletePromotionParams = Omit<GetListPromotionParams, "pagination">
    & {
        id: number,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }

export type CreatePromotionParams = Omit<GetListPromotionParams, "pagination"> & {
    promotion: PromotionCreate,
    setError: UseFormSetError<FormValuesPromotion>,
    message: MessageApi
}

export type PromotionCreate = {
    starts_at: string
    ends_at: string
    coupon_code: string
    active: boolean
    name: string
    limit?: number
    discount?: number
}

export type GetPromotionParams = Omit<GetListPromotionParams, "pagination"> & { id: number }

export interface UpdatePromotionParams extends CreatePromotionParams {
    id: number
}
