import { createSlice } from '@reduxjs/toolkit';
import { Promotion } from 'src/types/promotion';

interface PromotionState {
    delete: {
        result: Promotion | null;
        loading: boolean;
        error: boolean;
    },
    create: {
        result: Promotion | null,
        loading: boolean,
        error: boolean
    },
    update: {
        result: Promotion | null,
        loading: boolean,
        error: boolean
    },
    single: {
        result: Promotion | null;
        loading: boolean;
        error: boolean;
    },
    list: {
        result: {
            promotions: Array<Promotion>
            skip: number
            take: number
            total: number
            totalPage: number
        } | null;
        loading: boolean;
        error: boolean;
    },
}

const initialState: PromotionState = {
    delete: {
        result: null,
        loading: false,
        error: false
    },
    create: {
        result: null,
        loading: false,
        error: false
    },
    update: {
        result: null,
        loading: false,
        error: false
    },
    single: {
        result: null,
        loading: false,
        error: false
    },
    list: {
        result: null,
        loading: false,
        error: false
    },
} as PromotionState;

export const promotionSlice = createSlice({
    name: 'promotion',
    initialState,
    reducers: {
        // ** Delete promotion
        deletePromotionStart: (state) => {
            state.delete.loading = true;
        },
        deletePromotionSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deletePromotionFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Create promotion
        createPromotionStart: (state) => {
            state.create.loading = true;
        },
        createPromotionSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createPromotionFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update promotion
        updatePromotionStart: (state) => {
            state.update.loading = true;
        },
        updatePromotionSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updatePromotionFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
        // ** Get promotion
        getPromotionStart: (state) => {
            state.single.loading = true;
        },
        getPromotionSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getPromotionFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Get list promotion
        getListPromotionStart: (state) => {
            state.list.loading = true;
        },
        getListPromotionSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListPromotionFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
    }
});

export const {
    deletePromotionStart,
    deletePromotionSuccess,
    deletePromotionFailed,
    createPromotionStart,
    createPromotionSuccess,
    createPromotionFailed,
    updatePromotionStart,
    updatePromotionSuccess,
    updatePromotionFailed,
    getPromotionStart,
    getPromotionSuccess,
    getPromotionFailed,
    getListPromotionStart,
    getListPromotionSuccess,
    getListPromotionFailed
} = promotionSlice.actions;

export default promotionSlice.reducer;