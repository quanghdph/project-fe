import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
};

export const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {
        // ** Get brand
        getListBrandStart: (state) => {
            state.list.loading = true;
        },
        getListBrandSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListBrandFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete brand
        deleteBrandStart: (state) => {
            state.delete.loading = true;
        },
        deleteBrandSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteBrandFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get brand
        getBrandStart: (state) => {
            state.single.loading = true;
        },
        getBrandSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getBrandFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Create brand
        createBrandStart: (state) => {
            state.create.loading = true;
        },
        createBrandSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createBrandFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update brand
        updateBrandStart: (state) => {
            state.update.loading = true;
        },
        updateBrandSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateBrandFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
    },
});

export const {
    getListBrandStart,
    getListBrandSuccess,
    getListBrandFailed,
    deleteBrandStart,
    deleteBrandSuccess,
    deleteBrandFailed,
    getBrandStart,
    getBrandSuccess,
    getBrandFailed,
    createBrandStart,
    createBrandSuccess,
    createBrandFailed,
    updateBrandStart,
    updateBrandSuccess,
    updateBrandFailed,
} = brandSlice.actions;

export default brandSlice.reducer;