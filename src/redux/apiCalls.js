import { 
    clearRefreshToken, 
    publicRequest, 
    updateRefreshToken, 
    userRequest 
} from "../requestMethods";
import { 
    getMessageStart, 
    getMessageSuccess, 
    getMessageFailure, 
    messageToggleReadStart, 
    messageToggleReadSuccess, 
    messageToggleReadFailure,
    messageReadStart,
    messageReadSuccess,
    messageReadFailure,
} from "./messageRedux";
import { 
    getOrderStart, 
    getOrderSuccess,
    getOrderFailure,
    deleteOrderStart,
    deleteOrderSuccess,
    deleteOrderFailure,
    updateOrderStart,
    updateOrderSuccess,
    updateOrderFailure, 
} from "./orderRedux";
import { 
    addProductFailure,
    addProductStart,
    addProductSuccess,
    deleteProductFailure, 
    deleteProductStart, 
    deleteProductSuccess, 
    getProductFailure, 
    getProductStart, 
    getProductSuccess, 
    updateProductFailure, 
    updateProductStart,
    updateProductSuccess,
} from "./productRedux";
import { 
    loginFailure, 
    loginStart, 
    loginSuccess,
    logoutStart, 
    logoutSuccess, 
    logoutFailure, 
    getUsersStart,
    getUsersSuccess,
    getUsersFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    updateUserSuccess,
    updateUserStart,
    updateUserFailure
 } from "./userRedux";


export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const { data } = await publicRequest.post("/auth/login", user)
        const { accessToken, refreshToken, refreshTokenId, ...others } = data;
        dispatch(loginSuccess(others));
        updateRefreshToken(refreshToken, refreshTokenId);
    } catch(err) {
        dispatch(loginFailure());
        console.log(err);
    }
};

export const logout = async (dispatch, refreshTokenId) => {
    dispatch(logoutStart());
    try {
        await userRequest.post("/auth/logout_post", refreshTokenId)
        dispatch(logoutSuccess());
        clearRefreshToken();
        delete userRequest.defaults.headers.common["token"];
    } catch(err) {
        dispatch(logoutFailure());
        console.log(err)
    }
};

export const getProducts = async (dispatch) => {
    dispatch(getProductStart());
    try {
        const res = await publicRequest.get("/products");
        dispatch(getProductSuccess(res.data))
    } catch(err) {
        dispatch(getProductFailure());
        console.log(err)
    }
};

export const deleteProduct = async (id, dispatch) => {
    dispatch(deleteProductStart());
    try {
        await userRequest.delete(`/products/${id}`)
        dispatch(deleteProductSuccess(id))
    } catch(err) {
        dispatch(deleteProductFailure());
        console.log(err)
    }
};

export const updateProduct = async (id, product, dispatch) => {
    dispatch(updateProductStart());
    try {
        // update 
        await userRequest.put(`/products/${id}`, product);
        dispatch(updateProductSuccess({id, product}))
    } catch(err) {
        dispatch(updateProductFailure());
        console.log(err)
    }
};

export const addProduct = async (product, dispatch) => {
    dispatch(addProductStart());
    try {
        const res = await userRequest.post(`/products`, product);
        dispatch(addProductSuccess(res.data));
    } catch(err) {
        dispatch(addProductFailure());
        console.log(err)
    }
};

export const getUsers = async (dispatch) => {
    dispatch(getUsersStart());
    try {
        const res = await userRequest.get('/users');
        dispatch(getUsersSuccess(res.data));
    } catch(err) {
        dispatch(getUsersFailure());
        console.log(err)
    }
};

export const deleteUser = async (id, dispatch) => {
    dispatch(deleteUserStart());
    try {
        await userRequest.delete(`/users/${id}`)
        dispatch(deleteUserSuccess(id))
    } catch(err) {
        dispatch(deleteUserFailure());
        console.log(err)
    }
};

export const updateUser = async (id, user, dispatch) => {
    dispatch(updateUserStart());
    try {
        const res = await userRequest.put(`/users/${id}`, user);
        const updatedUser = res.data;
        dispatch(updateUserSuccess({id, updatedUser}));
    } catch(err) {
        dispatch(updateUserFailure());
        console.log(err)
    }
};

export const getOrders = async (dispatch) => {
    dispatch(getOrderStart());
    try {
        const res = await userRequest.get("/orders");
        dispatch(getOrderSuccess(res.data))
    } catch(err) {
        dispatch(getOrderFailure());
        console.log(err)
    }
};

export const deleteOrder = async (id, dispatch) => {
    dispatch(deleteOrderStart());
    try {
        await userRequest.delete(`/orders/${id}`)
        dispatch(deleteOrderSuccess(id))
    } catch(err) {
        dispatch(deleteOrderFailure());
        console.log(err)
    }
};

export const updateOrder = async (id, order, dispatch) => {
    dispatch(updateOrderStart());
    try {
        // update 
        const res = await userRequest.put(`/orders/${id}`, order);
        const updatedOrder = res.data;
        dispatch(updateOrderSuccess({id, updatedOrder}))
    } catch(err) {
        dispatch(updateOrderFailure());
        console.log(err)
    }
};

export const getMessages = async (dispatch) => {
    dispatch(getMessageStart());
    try {
        const res = await userRequest.get("/notifications");
        dispatch(getMessageSuccess(res.data))
    } catch(err) {
        dispatch(getMessageFailure());
        console.log(err);
    }
};

export const updateMessage = async (id, message, dispatch) => {
    dispatch(messageToggleReadStart());
    try {
        await userRequest.put(`/notifications/${id}`, message);
        dispatch(messageToggleReadSuccess(id));
    } catch(err) {
        dispatch(messageToggleReadFailure());
        console.log(err)
    }
};

export const setMessageRead = async (id, message, dispatch) => {
    dispatch(messageReadStart());
    try {
        await userRequest.put(`/notifications/${id}`, message);
        dispatch(messageReadSuccess(id))
    } catch(err) {
        dispatch(messageReadFailure());
        console.log(err)
    }
};
