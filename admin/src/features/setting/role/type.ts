import type { AxiosInstance } from "axios";
import { AppDispatch } from "src/app/store";
import { Pagination } from "src/types";
import { NavigateFunction } from "react-router-dom";
import { MessageApi } from "antd/lib/message";
import { UseFormSetError } from "react-hook-form";
import { FormValuesRole } from "src/components/Settings/Roles/create-update";

export type CreateRoleParams = Omit<GetListRoleParams, "pagination">
    & {
        role: RoleCreate,
        setError: UseFormSetError<FormValuesRole>,
        message: MessageApi
    }

export type RoleCreate = {
    role_code: string
    role_name: string
    description?: string
    permissions: string[]
}

export interface GetListRoleParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type DeleteRoleParams = Omit<GetListRoleParams, "pagination">
    & {
        id: number,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }

export type GetRoleParams = Omit<GetListRoleParams, "pagination"> & { id: number }


export interface UpdateRoleParams extends CreateRoleParams {
    id: number
}