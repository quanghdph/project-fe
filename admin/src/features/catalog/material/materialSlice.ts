import { createSlice } from '@reduxjs/toolkit';
// import { Material } from 'src/types/material';

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

export const materialSlice = createSlice({
    name: 'material',
    initialState,
    reducers: {
        // ** Get material
        getListMaterialStart: (state) => {
            state.list.loading = true;
        },
        getListMaterialSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListMaterialFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete material
        deleteMaterialStart: (state) => {
            state.delete.loading = true;
        },
        deleteMaterialSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteMaterialFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get material
        getMaterialStart: (state) => {
            state.single.loading = true;
        },
        getMaterialSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getMaterialFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Create material
        createMaterialStart: (state) => {
            state.create.loading = true;
        },
        createMaterialSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createMaterialFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update material
        updateMaterialStart: (state) => {
            state.update.loading = true;
        },
        updateMaterialSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateMaterialFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
    },
});

export const {
    getListMaterialStart,
    getListMaterialSuccess,
    getListMaterialFailed,
    deleteMaterialStart,
    deleteMaterialSuccess,
    deleteMaterialFailed,
    getMaterialStart,
    getMaterialSuccess,
    getMaterialFailed,
    createMaterialStart,
    createMaterialSuccess,
    createMaterialFailed,
    updateMaterialStart,
    updateMaterialSuccess,
    updateMaterialFailed,
} = materialSlice.actions;

export default materialSlice.reducer;