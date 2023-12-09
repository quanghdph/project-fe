import { NavigateFunction } from "react-router-dom";
import { MessageApi } from "antd/lib/message";
import { UseFormSetError } from "react-hook-form";
import { FormValuesCustomer } from "src/components/Customers/create-update";
import { AxiosInstance } from "axios";
import { Pagination } from "src/types";
import { AppDispatch } from "src/app/store";

export type CreateCustomerParams = Omit<GetListCustomerParams, "pagination">
    & {
        customer: CustomerCreate,
        setError: UseFormSetError<FormValuesCustomer>,
        message: MessageApi
    }

export interface CustomerCreate {
    password: string
    first_name: string
    last_name: string
    gender: boolean
    date_of_birth?: string
    email: string
    phone?: string
    active: boolean
}

export interface UpdateCustomerParams {
    id: number
    customer: Omit<CustomerCreate, "password">,
    setError: UseFormSetError<Omit<FormValuesCustomer, "password">>,
    message: MessageApi
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    navigate: NavigateFunction
}

export interface GetListCustomerParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type DeleteCustomerParams = Omit<GetListCustomerParams, "pagination">
    & {
        id: number,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }

export type GetCustomerParams = Omit<GetListCustomerParams, "pagination"> & { id: number }