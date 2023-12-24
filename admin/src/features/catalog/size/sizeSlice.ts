import { createSlice } from '@reduxjs/toolkit';
// import { Size } from 'src/types/size';

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

export const sizeSlice = createSlice({
    name: 'size',
    initialState,
    reducers: {
        // ** Get size
        getListSizeStart: (state) => {
            state.list.loading = true;
        },
        getListSizeSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListSizeFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete size
        deleteSizeStart: (state) => {
            state.delete.loading = true;
        },
        deleteSizeSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteSizeFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get size
        getSizeStart: (state) => {
            state.single.loading = true;
        },
        getSizeSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getSizeFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Create size
        createSizeStart: (state) => {
            state.create.loading = true;
        },
        createSizeSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createSizeFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update size
        updateSizeStart: (state) => {
            state.update.loading = true;
        },
        updateSizeSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateSizeFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
    },
});

export const {
    getListSizeStart,
    getListSizeSuccess,
    getListSizeFailed,
    deleteSizeStart,
    deleteSizeSuccess,
    deleteSizeFailed,
    getSizeStart,
    getSizeSuccess,
    getSizeFailed,
    createSizeStart,
    createSizeSuccess,
    createSizeFailed,
    updateSizeStart,
    updateSizeSuccess,
    updateSizeFailed,
} = sizeSlice.actions;

export default sizeSlice.reducer;