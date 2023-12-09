import { NavigateFunction } from "react-router-dom";
import { MessageApi } from "antd/lib/message";
import { UseFormSetError } from "react-hook-form";
import { AxiosInstance } from "axios";
import { Pagination } from "src/types";
import { FormValuesAdministrator } from "src/components/Settings/Administrators/create-update";
import { AppDispatch } from "src/app/store";

export interface AdministratorCreate {
    password: string
    first_name: string
    last_name: string
    gender?: boolean
    date_of_birth?: string
    email: string
    phone?: string
    active: boolean
}

export type CreateAdministratorParams = Omit<GetListAdministratorParams, "pagination">
    & {
        administrator: AdministratorCreate,
        setError: UseFormSetError<FormValuesAdministrator>,
        message: MessageApi
    }


export interface AdministratorCreateUpdate extends Omit<AdministratorCreate, "password"> {
    role_ids: number[]
}

export interface UpdateAdministratorParams {
    id: number
    administrator: AdministratorCreateUpdate,
    setError: UseFormSetError<Omit<FormValuesAdministrator, "password">>,
    message: MessageApi
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    navigate: NavigateFunction
}

export interface GetListAdministratorParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type DeleteAdministratorParams = Omit<GetListAdministratorParams, "pagination">
    & {
        id: number,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }

export type GetAdministratorParams = Omit<GetListAdministratorParams, "pagination"> & { id: number }