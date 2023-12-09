import { UseFormSetError } from "react-hook-form";
import { FormValuesCategory } from "src/components/Catalog/Categories/create-update";
import { Pagination } from "src/types";
import { AxiosInstance } from "axios";
import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "src/app/store";
import { MessageApi } from "antd/lib/message";

export interface GetListCategoryParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type DeleteCategoryParams = Omit<GetListCategoryParams, "pagination">
    & {
        id: number,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }

export type CreateCategoryParams = Omit<GetListCategoryParams, "pagination"> & {
    category: CategoryCreate,
    setError: UseFormSetError<FormValuesCategory>,
    message: MessageApi
}

export type CategoryCreate = {
    category_name: string
    category_code: string
    description?: string
    active: boolean
    parent_id?: number
}

export type GetCategoryParams = Omit<GetListCategoryParams, "pagination"> & { id: number }

export interface UpdateCategoryParams extends CreateCategoryParams {
    id: number
}