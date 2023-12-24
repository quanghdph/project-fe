import { createSlice } from '@reduxjs/toolkit';
// import { Waistband } from 'src/types/waistband';

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

export const waistbandSlice = createSlice({
    name: 'waistband',
    initialState,
    reducers: {
        // ** Get waistband
        getListWaistbandStart: (state) => {
            state.list.loading = true;
        },
        getListWaistbandSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListWaistbandFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete waistband
        deleteWaistbandStart: (state) => {
            state.delete.loading = true;
        },
        deleteWaistbandSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteWaistbandFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get waistband
        getWaistbandStart: (state) => {
            state.single.loading = true;
        },
        getWaistbandSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getWaistbandFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Create waistband
        createWaistbandStart: (state) => {
            state.create.loading = true;
        },
        createWaistbandSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createWaistbandFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update waistband
        updateWaistbandStart: (state) => {
            state.update.loading = true;
        },
        updateWaistbandSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateWaistbandFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
    },
});

export const {
    getListWaistbandStart,
    getListWaistbandSuccess,
    getListWaistbandFailed,
    deleteWaistbandStart,
    deleteWaistbandSuccess,
    deleteWaistbandFailed,
    getWaistbandStart,
    getWaistbandSuccess,
    getWaistbandFailed,
    createWaistbandStart,
    createWaistbandSuccess,
    createWaistbandFailed,
    updateWaistbandStart,
    updateWaistbandSuccess,
    updateWaistbandFailed,
} = waistbandSlice.actions;

export default waistbandSlice.reducer;