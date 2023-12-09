import { MessageApi } from "antd/lib/message";
import type { AxiosInstance } from "axios";
import { Pagination } from "src/types";
import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "src/app/store";

export interface GetListAssetParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type DeleteAssetParams = Omit<GetListAssetParams, "pagination">
    & {
        id: number,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }