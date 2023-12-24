import { createSlice } from '@reduxjs/toolkit';
// import { Color } from 'src/types/color';

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

export const colorSlice = createSlice({
    name: 'color',
    initialState,
    reducers: {
        // ** Get color
        getListColorStart: (state) => {
            state.list.loading = true;
        },
        getListColorSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListColorFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete color
        deleteColorStart: (state) => {
            state.delete.loading = true;
        },
        deleteColorSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteColorFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get color
        getColorStart: (state) => {
            state.single.loading = true;
        },
        getColorSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getColorFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Create color
        createColorStart: (state) => {
            state.create.loading = true;
        },
        createColorSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createColorFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update color
        updateColorStart: (state) => {
            state.update.loading = true;
        },
        updateColorSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateColorFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
    },
});

export const {
    getListColorStart,
    getListColorSuccess,
    getListColorFailed,
    deleteColorStart,
    deleteColorSuccess,
    deleteColorFailed,
    getColorStart,
    getColorSuccess,
    getColorFailed,
    createColorStart,
    createColorSuccess,
    createColorFailed,
    updateColorStart,
    updateColorSuccess,
    updateColorFailed,
} = colorSlice.actions;

export default colorSlice.reducer;