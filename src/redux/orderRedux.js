import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        isFetching: false,
        error: false
    },
    reducers: {
        getOrderStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getOrderSuccess: (state, action) => {
            state.isFetching = false;
            state.orders = action.payload
        },
        getOrderFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        deleteOrderStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteOrderSuccess: (state, action) => {
            state.isFetching = false;
            state.orders.splice(
                state.orders.findIndex(item => item._id === action.payload.id),
                1
            );
        },
        deleteOrderFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        updateOrderStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateOrderSuccess: (state, action) => {
            const { id, updatedOrder } = action.payload;
            const index = state.orders.findIndex((item) => item._id === id);
            if (index !== -1) {
                state.orders[index] = { ...state.orders[index], ...updatedOrder };
            }
            state.isFetching = false;
        },
        updateOrderFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        addOrderStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addOrderSuccess: (state, action) => {
            state.isFetching = false;
            state.orders.push(action.payload);
        },
        addOrderFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    getOrderStart,
    getOrderSuccess,
    getOrderFailure,
    deleteOrderStart,
    deleteOrderSuccess,
    deleteOrderFailure,
    updateOrderStart,
    updateOrderSuccess,
    updateOrderFailure,
    addOrderStart,
    addOrderSuccess,
    addOrderFailure
} = orderSlice.actions;

export default orderSlice.reducer;