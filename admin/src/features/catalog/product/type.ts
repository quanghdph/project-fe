import { Pagination } from "src/types";
import { NavigateFunction } from "react-router-dom";
import { MessageApi } from "antd/lib/message";
import { UseFormSetError } from "react-hook-form";
import type { AxiosInstance } from "axios";
import { AppDispatch } from "src/app/store";
import { FormValuesProduct } from "src/components/Catalog/Products/detail-update/ProductDetail";
import { FormValuesProductVariant } from "src/components/Catalog/Products/detail-update/ModalUpdateProductVariant";

export type CreateProductParams = {
    dispatch: AppDispatch;
    axiosClientJwt: AxiosInstance;
    product: Product;
    setError: UseFormSetError<FormValuesProductVariant>,
    navigate: NavigateFunction,
    message: MessageApi
};

export type Product = {
    name: string;
    description?: string;
    active: boolean;
    featured_asset_id?: number;
    options: { name: string, value: string[] }[]
    getValues: (field: string) => [string | number]
};

export type ProductOption = {
    name: string;
    value: Array<string>;
};


export type CreateProductOptionParams = {
    options: { name: string, value: string[] }[]
    axiosClientJwt: AxiosInstance
    productId: number
};

export type CreateProductVariantParams = {
    variants: Variant[]
    axiosClientJwt: AxiosInstance
}

export type Variant = {
    sku: string
    name: string
    option_ids: number[]
    product_id: number
    stock: number
    origin_price: number
    price: number
}

export interface GetListProductParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type DeleteProductParams = Omit<GetListProductParams, "pagination">
    & {
        id: number,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }

export type GetProductParams = Omit<GetListProductParams, "pagination"> & { id: number }

export type UpdateProductParams = Omit<GetListProductParams, "pagination">
    & {
        product: ProductUpdate,
        id: number,
        setError: UseFormSetError<FormValuesProduct>,
        message: MessageApi,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
    }

export type UpdateProductVariantParams = Omit<GetListProductParams, "pagination">
    & {
        productVariant: ProductVariantUpdate,
        id: number,
        setError: UseFormSetError<FormValuesProductVariant>,
        message: MessageApi,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
    }

export type ProductVariantUpdate = {
    name: string
    price: number
    origin_price: number
    sku: string
    stock: number
    featured_asset_id?: number
}

export type ProductUpdate = {
    name: string
    description?: string
    active: boolean
    featured_asset_id?: number
    category_id?: number | null
}

export type ProductVariantOption = {
    value: string
}

export type UpdateProductOptionParams = Omit<UpdateProductVariantParams, "productVariant" | "setError">
    & {
        productOption: ProductVariantOption,
    }

export type DeleteProductVariantParams = DeleteProductParams

export type CreateProductVariantOptionParams = {
    dispatch: AppDispatch;
    axiosClientJwt: AxiosInstance;
    options: { name: string, value: string[] }[]
    getValues: (field: string) => [string | number]
    setError: UseFormSetError<FormValuesProductVariant>,
    navigate: NavigateFunction,
    message: MessageApi
    productId: number
    productName: string
}