import { createSlice } from '@reduxjs/toolkit';
import { Product, ProductOption, ProductVariant } from 'src/types';

export interface ProductOptionType {
    name: string
    value: Array<string>
}

interface ProductState {
    createProduct: {
        result: Product | null;
        loading: boolean;
        error: boolean;
    },
    createProductVariantOption: {
        result: null;
        loading: boolean;
        error: boolean;
    },
    list: {
        result: {
            products: Array<Product>
            skip: number
            take: number
            total: number
            totalPage: number
        } | null;
        loading: boolean;
        error: boolean;
    }
    delete: {
        result: Product | null;
        loading: boolean;
        error: boolean;
    }
    single: {
        result: Product | null;
        loading: boolean;
        error: boolean;
    }
    update: {
        result: Product | null;
        loading: boolean;
        error: boolean;
    }
    productVariantUpdate: {
        result: ProductVariant | null;
        loading: boolean;
        error: boolean;
    }
    productOptionUpdate: {
        result: ProductOption | null;
        loading: boolean;
        error: boolean;
    }
    deleteProductVariant: {
        result: ProductVariant | null;
        loading: boolean;
        error: boolean;
    }
}

const initialState: ProductState = {
    createProduct: {
        result: null,
        loading: false,
        error: false,
    },
    list: {
        result: null,
        loading: false,
        error: false,
    },
    delete: {
        result: null,
        loading: false,
        error: false
    },
    single: {
        result: null,
        loading: false,
        error: false
    },
    update: {
        result: null,
        loading: false,
        error: false
    }
} as ProductState;

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // ** Create product
        createProductStart: (state) => {
            state.createProduct.loading = true;
        },
        createProductSuccess: (state, action) => {
            state.createProduct.loading = false;
            state.createProduct.result = action.payload;
            state.createProduct.error = false
        },
        createProductFailed: (state, action) => {
            state.createProduct.loading = false;
            state.createProduct.result = action.payload;
            state.createProduct.error = true;
        },
        // ** Get list product
        getListProductStart: (state) => {
            state.list.loading = true;
        },
        getListProductSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListProductFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete product
        deleteProductStart: (state) => {
            state.delete.loading = true;
        },
        deleteProductSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteProductFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get product
        getProductStart: (state) => {
            state.single.loading = true;
        },
        getProductSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getProductFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Update product
        updateProductStart: (state) => {
            state.update.loading = true;
        },
        updateProductSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateProductFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        }
    }
});

export const {
    createProductStart,
    createProductSuccess,
    createProductFailed,
    getListProductStart,
    getListProductSuccess,
    getListProductFailed,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailed,
    getProductStart,
    getProductSuccess,
    getProductFailed,
    updateProductStart,
    updateProductSuccess,
    updateProductFailed,
} = productSlice.actions;

export default productSlice.reducer;