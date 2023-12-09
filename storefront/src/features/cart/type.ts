import { CreateToastFnReturn } from "@chakra-ui/react";
import type { AxiosInstance } from "axios";
import { AppDispatch } from "src/app/store";

export type AddToCartParams = {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    cart: {
        quantity: number
    },
    id: number,
    toast: CreateToastFnReturn
}

export type GetListProductOnCartParams = Omit<AddToCartParams, "cart" | "id">

export type DeleteFromCartParams = Omit<AddToCartParams, "cart"> & {
    refresh: boolean,
    setRefresh: (refresh: boolean) => void
}

export type GetCartParams = Omit<AddToCartParams, "cart">

export type UpdateCartParams = AddToCartParams & {
    refresh: boolean,
    setRefresh: (refresh: boolean) => void,
    setError: Function
}