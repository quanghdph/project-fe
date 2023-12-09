import { createSlice } from '@reduxjs/toolkit';
import { Asset } from 'src/types/asset';

interface AssetState {
    list: {
        result: {
            assets: Array<Asset>
            skip: number
            take: number
            total: number
            totalPage: number
        } | null;
        loading: boolean;
        error: boolean;
    }
    delete: {
        result: any;
        loading: boolean;
        error: boolean;
    }
}

const initialState: AssetState = {
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
} as AssetState;

export const assetSlice = createSlice({
    name: 'asset',
    initialState,
    reducers: {
        // ** Get list asset
        getListAssetStart: (state) => {
            state.list.loading = true;
        },
        getListAssetSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListAssetFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;

            state.list.error = true;
        },
        // ** Delete asset
        deleteAssetStart: (state) => {
            state.delete.loading = true
        },
        deleteAssetSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteAssetFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
    },
});

export const {
    getListAssetStart,
    getListAssetSuccess,
    getListAssetFailed,
    deleteAssetStart,
    deleteAssetSuccess,
    deleteAssetFailed,
} = assetSlice.actions;

export default assetSlice.reducer;