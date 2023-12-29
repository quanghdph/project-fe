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

export const billSlice = createSlice({
    name: 'bill',
    initialState,
    reducers: {
        // ** Get bill
        getListBillStart: (state) => {
            state.list.loading = true;
        },
        getListBillSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListBillFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete bill
        deleteBillStart: (state) => {
            state.delete.loading = true;
        },
        deleteBillSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteBillFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get bill
        getBillStart: (state) => {
            state.single.loading = true;
        },
        getBillSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getBillFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Create bill
        createBillStart: (state) => {
            state.create.loading = true;
        },
        createBillSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createBillFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update bill
        updateBillStart: (state) => {
            state.update.loading = true;
        },
        updateBillSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateBillFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
    },
});

export const {
    getListBillStart,
    getListBillSuccess,
    getListBillFailed,
    deleteBillStart,
    deleteBillSuccess,
    deleteBillFailed,
    getBillStart,
    getBillSuccess,
    getBillFailed,
    createBillStart,
    createBillSuccess,
    createBillFailed,
    updateBillStart,
    updateBillSuccess,
    updateBillFailed,
} = billSlice.actions;

export default billSlice.reducer;