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

export const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        // ** Get employee
        getListEmployeeStart: (state) => {
            state.list.loading = true;
        },
        getListEmployeeSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListEmployeeFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
        // ** Delete employee
        deleteEmployeeStart: (state) => {
            state.delete.loading = true;
        },
        deleteEmployeeSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteEmployeeFailed: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = true;
        },
        // ** Get employee
        getEmployeeStart: (state) => {
            state.single.loading = true;
        },
        getEmployeeSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getEmployeeFailed: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = true;
        },
        // ** Create employee
        createEmployeeStart: (state) => {
            state.create.loading = true;
        },
        createEmployeeSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createEmployeeFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Update employee
        updateEmployeeStart: (state) => {
            state.update.loading = true;
        },
        updateEmployeeSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateEmployeeFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
    },
});

export const {
    getListEmployeeStart,
    getListEmployeeSuccess,
    getListEmployeeFailed,
    deleteEmployeeStart,
    deleteEmployeeSuccess,
    deleteEmployeeFailed,
    getEmployeeStart,
    getEmployeeSuccess,
    getEmployeeFailed,
    createEmployeeStart,
    createEmployeeSuccess,
    createEmployeeFailed,
    updateEmployeeStart,
    updateEmployeeSuccess,
    updateEmployeeFailed,
} = employeeSlice.actions;

export default employeeSlice.reducer;