import { createSlice } from '@reduxjs/toolkit';
import { Rating } from 'src/shared/types';

interface RatingState {
    list: {
        result: {
            rates: Array<Rating>
            skip: number
            take: number
            total: number
            totalPage: number
        } | null;
        loading: boolean;
        error: boolean;
    },
    create: {
        result: Rating| null;
        loading: boolean;
        error: boolean;
    }
}

const initialState: RatingState = {
    list: {
        result: null,
        loading: false,
        error: false
    },
    create: {
        result: null,
        loading: false,
        error: false
    },
} as RatingState;

export const ratingSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {
        // Get list rating
        getListRatingStart: (state) => {
            state.list.loading = true;
        },
        getListRatingSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListRatingFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // Create rating
        createRatingStart: (state) => {
            state.create.loading = true;
        },
        createRatingSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createRatingFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
    },
});

export const {
    getListRatingStart,
    getListRatingSuccess,
    getListRatingFailed,
    createRatingStart,
    createRatingSuccess,
    createRatingFailed
} = ratingSlice.actions;

export default ratingSlice.reducer;