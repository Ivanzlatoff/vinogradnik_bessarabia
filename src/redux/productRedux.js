import { createSlice } from '@reduxjs/toolkit';

export const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        // GET ALL
        getProductStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getProductSuccess: (state, action) => {
            state.isFetching = false;
            state.products = action.payload;
        },
        getProductFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },

        // DELETE ALL
        deleteProductStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteProductSuccess: (state, action) => {
            state.isFetching = false;
            state.products.splice(
                state.products.findIndex(item => item._id === action.payload.id),
                1
            );
        },
        deleteProductFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },

        // UPDATE ALL
        updateProductStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateProductSuccess: (state, action) => {
            const currentProduct = state.products.find((item) => item._id === action.payload.id)
            state.isFetching = false;
            state.products[state.products.findIndex((item) => item._id === action.payload.id)] = {
                ...currentProduct,
                ...action.payload.product,
                desc: {
                    ...currentProduct.desc,
                    ...action.payload.product.desc
                }
            };
        },
        updateProductFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },

        // ADD ALL
        addProductStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addProductSuccess: (state, action) => {
            state.isFetching = false;
            state.products.push(action.payload)
        },
        addProductFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    getProductStart,
    getProductSuccess,
    getProductFailure,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailure,
    updateProductStart,
    updateProductSuccess,
    updateProductFailure,
    addProductStart,
    addProductSuccess,
    addProductFailure
} = productSlice.actions;

export default productSlice.reducer;