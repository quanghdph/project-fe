import { AppDispatch } from "src/app/store";
import { PaymentMethod } from 'src/pages/CheckoutPage';
import { CreateToastFnReturn } from "@chakra-ui/react";
import { Axios, AxiosInstance } from "axios";

export interface CheckPromotionParams {
    dispatch: AppDispatch,
    setError: Function,
    axiosClient: Axios
    toast: CreateToastFnReturn,
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
    coupon_code: string
}

export interface ResetPromotionActionParams {
    dispatch: AppDispatch,
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
}

export interface CreateOrderParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    toast: CreateToastFnReturn,
    navigate: Function
    order: OrderCreate
}

export interface OrderCreate {
    address_id: number,
    payment_method: PaymentMethod,
    product_variant_id: number,
    quantity: number,
    promotion_id?: number
}
