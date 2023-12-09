import { createSlice } from '@reduxjs/toolkit';
import { Promotion } from 'src/shared/types';

interface PromotionState {
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
    getListPromotionStart,
    getListPromotionSuccess,
    getListPromotionFailed
} = promotionSlice.actions;

export default promotionSlice.reducer;