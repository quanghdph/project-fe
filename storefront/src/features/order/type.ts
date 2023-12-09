import { CreateToastFnReturn } from "@chakra-ui/react";
import { AxiosInstance } from "axios";
import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "src/app/store";
import { Pagination } from "src/shared/types";

export interface GetListOrderParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction,
    toast: CreateToastFnReturn
}

export interface CancelOrderParams extends Omit<GetListOrderParams, "pagination"> {
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
    id: number
}

export interface RefundOrderParams extends CancelOrderParams { }