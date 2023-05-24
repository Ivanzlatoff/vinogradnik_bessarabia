import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        isFetching: false,
        error: false,
        users: []
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        logoutStart: (state) => {
            state.isFetching = true
        },
        logoutSuccess: (state) => {
            state.isFetching = false;
            state.currentUser = null;
            state.error = false;
        },
        logoutFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        getUsersStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getUsersSuccess: (state, action) => {
            state.isFetching = false;
            state.users = action.payload;
        },
        getUsersFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        updateUserStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateUserSuccess: (state, action) => {
            const { id, updatedUser } = action.payload;
            const index = state.users.findIndex((user) => user._id === id);
            if (index !== -1) {
                state.users[index] = { ...state.users[index], ...updatedUser};
            }
            state.isFetching = false;
        },
        updateUserFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        deleteUserStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteUserSuccess: (state, action) => {
            state.isFetching = false;
            state.users.splice(
                state.products.findIndex(item => item._id === action.payload.id),
                1
            );
        },
        deleteUserFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        }
    },
});

export const { 
    loginStart, 
    loginSuccess, 
    loginFailure,
    logoutStart,
    logoutSuccess,
    logoutFailure,
    getUsersStart,
    getUsersSuccess,
    getUsersFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure
} = userSlice.actions;
export default userSlice.reducer;

export const selectAllUsers = state => state.user.users;