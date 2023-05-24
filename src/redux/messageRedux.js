import { createSlice, createSelector } from '@reduxjs/toolkit';


export const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: [],
        isFetching: false,
        error: false           
    },
    reducers: {
        // GET ALL
        getMessageStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getMessageSuccess: (state, action) => {
            state.isFetching = false;
            state.messages = action.payload.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        },
        getMessageFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        messageToggleReadStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        messageToggleReadSuccess: (state, action) => {
            state.isFetching = false;
            const id = action.payload;
            const index = state.messages.findIndex((message) => message._id === id);
            if (index !== -1) {
                state.messages[index].read = !state.messages[index].read
            }
        },
        messageToggleReadFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        messageReadStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        messageReadSuccess: (state, action) => {
            state.isFetching = false;
            const { id } = action.payload;
            const index = state.messages.findIndex((message) => message._id === id);
            if (index !== -1) {
                state.messages[index].read = true;
            }
        },
        messageReadFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        allMessagesReadStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        allMessagesReadSuccess: (state) => {
            state.messages.forEach(message => {
                message.read = true
            })
        },
        allMessagesReadFailure: (state) => {
            state.isFetching = false;
            state.error = true;            
        }
    },
});

export const { 
    getMessageStart,
    getMessageSuccess,
    getMessageFailure,
    messageToggleReadStart,
    messageToggleReadSuccess,
    messageToggleReadFailure,
    messageReadStart,
    messageReadSuccess,
    messageReadFailure,
    allMessagesReadStart,
    allMessagesReadSuccess,
    allMessagesReadFailure
} = messageSlice.actions;

export default messageSlice.reducer;

export const selectAllMessages = state => state.message.messages;

export const selectMessagesByUser = createSelector(
    [selectAllMessages, (state, userId) => userId],
    (messages, userId) => messages.filter(message => message.userId === userId)
);
