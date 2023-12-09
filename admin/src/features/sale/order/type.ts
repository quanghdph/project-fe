import { MessageApi } from "antd/lib/message";
import { AxiosInstance } from "axios";
import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "src/app/store";
import { Pagination } from "src/types";

export interface GetListOrderParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type GetOrderParams = Omit<GetListOrderParams, "pagination"> & { id: number }

export interface CancelOrderParams extends GetOrderParams {
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
    message: MessageApi
}

export interface ConfirmOrderParams extends CancelOrderParams { }

export interface ShippedOrderParams extends CancelOrderParams { }

export interface CompletedOrderParams extends CancelOrderParams { }

export interface RefundOrderParams extends CancelOrderParams { }

export type DeleteOrderParams = Omit<GetListOrderParams, "pagination">
    & {
        id: number,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }