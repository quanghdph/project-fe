
import { CreateToastFnReturn } from "@chakra-ui/react";
import { AxiosInstance } from "axios";
import { MessageApi } from "antd/lib/message";
import { AppDispatch } from "src/app/store";

export type DeleteAddressParams = {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    id: number,
    toast: CreateToastFnReturn,
    setIsModalOpen: (open: boolean) => void,
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
}

export interface CreateAddressParams extends Omit<DeleteAddressParams, "id"> {
    address: AddressCreate
}

export interface GetAddressParams extends Omit<DeleteAddressParams, "setIsModalOpen" | "setRefresh" | "refresh" | "message"> { }

export interface AddressCreate {
    street_line_1: string
    street_line_2: string
    country: string
    city: string
    postal_code: string
    province: string
    customer_id: number
}

export interface UpdateAddressParams extends CreateAddressParams {
    id: number
}

export interface SetDefaultShippingAddressParams {
    id: number
    customer_id: number
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    message: MessageApi,
    toast: CreateToastFnReturn,
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
}