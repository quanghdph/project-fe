import { createSlice } from '@reduxjs/toolkit';
import { Cart } from 'src/shared/types';

interface CartState {
    addToCart: {
        result: Cart | null;
        loading: boolean;
        error: boolean;
    },
    listProductOnCart: {
        result: Cart[] | null;
        loading: boolean;
        error: boolean;
    },
    deleteProductFromCart: {
        result: Cart | null;
        loading: boolean;
        error: boolean;
    },
    cart: {
        result: Cart | null;
        loading: boolean;
        error: boolean;
    },
    update: {
        result: Cart | null;
        loading: boolean;
        error: boolean;
    }
}

const initialState: CartState = {
    addToCart: {
        result: null,
        loading: false,
        error: false
    },
    listProductOnCart: {
        result: null,
        loading: false,
        error: false
    },
    deleteProductFromCart: {
        result: null,
        loading: false,
        error: false
    },
    cart: {
        result: null,
        loading: false,
        error: false
    },
    update: {
        result: null,
        loading: false,
        error: false
    }
} as CartState;

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Add to cart
        addToCartStart: (state) => {
            state.addToCart.loading = true;
        },
        addToCartSuccess: (state, action) => {
            state.addToCart.loading = false;
            state.addToCart.result = action.payload;
            state.addToCart.error = false
        },
        addToCartFailed: (state, action) => {
            state.addToCart.loading = false;
            state.addToCart.result = action.payload;
            state.addToCart.error = true;
        },
        // Get list product on cart
        getListProductOnCartStart: (state) => {
            state.listProductOnCart.loading = true;
        },
        getListProductOnCartSuccess: (state, action) => {
            state.listProductOnCart.loading = false;
            state.listProductOnCart.result = action.payload;
            state.listProductOnCart.error = false
        },
        getListProductOnCartFailed: (state, action) => {
            state.listProductOnCart.loading = false;
            state.listProductOnCart.result = action.payload;
            state.listProductOnCart.error = true;
        },
        // Delete product from cart
        deleteProductFromCartStart: (state) => {
            state.deleteProductFromCart.loading = true;
        },
        deleteProductFromCartSuccess: (state, action) => {
            state.deleteProductFromCart.loading = false;
            state.deleteProductFromCart.result = action.payload;
            state.deleteProductFromCart.error = false
        },
        deleteProductFromCartFailed: (state, action) => {
            state.deleteProductFromCart.loading = false;
            state.deleteProductFromCart.result = action.payload;
            state.deleteProductFromCart.error = true;
        },
        // Get cart
        getCartStart: (state) => {
            state.cart.loading = true;
        },
        getCartSuccess: (state, action) => {
            state.cart.loading = false;
            state.cart.result = action.payload;
            state.cart.error = false
        },
        getCartFailed: (state, action) => {
            state.cart.loading = false;
            state.cart.result = action.payload;
            state.cart.error = true;
        },
        // Update cart
        updateCartStart: (state) => {
            state.update.loading = true;
        },
        updateCartSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateCartFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },

    },
});

export const {
    addToCartStart,
    addToCartSuccess,
    addToCartFailed,
    getListProductOnCartStart,
    getListProductOnCartSuccess,
    getListProductOnCartFailed,
    deleteProductFromCartStart,
    deleteProductFromCartSuccess,
    deleteProductFromCartFailed,
    getCartStart,
    getCartSuccess,
    getCartFailed,
    updateCartStart,
    updateCartSuccess,
    updateCartFailed
} = cartSlice.actions;

export default cartSlice.reducer;