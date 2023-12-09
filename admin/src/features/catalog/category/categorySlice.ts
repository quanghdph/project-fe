import { createSlice } from '@reduxjs/toolkit';
import { Cateogry } from 'src/types/category';

interface CategoryState {
    list: {
        result: {
            categories: Array<Cateogry>
            skip: number
            take: number
            total: number
            totalPage: number
        } | null;
        loading: boolean;
        error: boolean;
    },
    delete: {
        result: Cateogry | null;
        loading: boolean;
        error: boolean;
    },
    update: {
        result: Cateogry | null;
        loading: boolean;
        error: boolean;
    },
    single: {
        result: Cateogry | null;
        loading: boolean;
        error: boolean;
    },
    create: {
        result: Cateogry | null,
        loading: boolean,
        error: boolean
    },
}

const initialState: CategoryState = {
    create: {
        result: null,
        loading: false,
        error: false
    },
    list: {
        result: null,
        loading: false,
        error: false
    },
    delete: {
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
    }
} as CategoryState;

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        // ** Get categories
        getListCategoryStart: (state) => {
            state.list.loading = true;
        },
        getListCategorySuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListCategoryFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete category
        deleteCategoryStart: (state) => {
            state.delete.loading = true;
        },
        deleteCategorySuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteCategoryFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get category
        getCategoryStart: (state) => {
            state.single.loading = true;
        },
        getCategorySuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getCategoryFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Create category
        createCategoryStart: (state) => {
            state.create.loading = true;
        },
        createCategorySuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createCategoryFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update category
        updateCategoryStart: (state) => {
            state.update.loading = true;
        },
        updateCategorySuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateCategoryFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
    },
});

export const {
    getListCategoryStart,
    getListCategorySuccess,
    getListCategoryFailed,
    deleteCategoryStart,
    deleteCategorySuccess,
    deleteCategoryFailed,
    getCategoryStart,
    getCategorySuccess,
    getCategoryFailed,
    createCategoryStart,
    createCategorySuccess,
    createCategoryFailed,
    updateCategoryStart,
    updateCategorySuccess,
    updateCategoryFailed,
} = categorySlice.actions;

export default categorySlice.reducer;