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
    singleImage: {
        result: Product | null;
        loading: boolean;
        error: boolean;
    }
    detail: {
        result: Product | null;
        loading: boolean;
        error: boolean;
    }
    variant: {
        result: Product | null;
        loading: boolean;
        error: boolean;
    }
    mainImage: {
        result: Product | null;
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
    },
    singleImage: {
        result: null,
        loading: false,
        error: false
    },
    detail: {
        result: null,
        loading: false,
        error: false
    },
    variant: {
        result: null,
        loading: false,
        error: false
    },
    mainImage: {
        result: null,
        loading: false,
        error: false
    },
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
        },
         // ** Get image
        getImageStart: (state) => {
            state.single.loading = true;
        },
        getImageSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getImageFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
         // ** Get product detail
         getProductDetailStart: (state) => {
            state.detail.loading = true;
        },
        getProductDetailSuccess: (state, action) => {
            state.detail.loading = false;
            state.detail.result = action.payload;
            state.detail.error = false
        },
        getProductDetailFailed: (state, action) => {
            state.detail.loading = false;
            state.detail.result = action.payload;
            state.detail.error = true;
        },
        // ** Get product variant
        getVariantProductStart: (state) => {
            state.variant.loading = true;
        },
        getVariantProductSuccess: (state, action) => {
            state.variant.loading = false;
            state.variant.result = action.payload;
            state.variant.error = false
        },
        getVariantProductFailed: (state, action) => {
            state.variant.loading = false;
            state.variant.result = action.payload;
            state.variant.error = true;
        },
         // ** Update main image
        updateMainImageProductStart: (state) => {
            state.mainImage.loading = true;
        },
        updateMainImageProductSuccess: (state, action) => {
            state.mainImage.loading = false;
            state.mainImage.result = action.payload;
            state.mainImage.error = false
        },
        updateMainImageProductFailed: (state, action) => {
            state.mainImage.loading = false;
            state.mainImage.result = action.payload;
            state.mainImage.error = true;
        },
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
    getImageStart,
    getImageSuccess,
    getImageFailed,
    getProductDetailStart,
    getProductDetailSuccess,
    getProductDetailFailed,
    getVariantProductStart,
    getVariantProductSuccess,
    getVariantProductFailed,
    updateMainImageProductStart,
    updateMainImageProductSuccess,
    updateMainImageProductFailed
} = productSlice.actions;

export default productSlice.reducer;