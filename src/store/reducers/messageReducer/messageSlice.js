import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiMessage } from '../../../api/apiMessage';

export const getMessages = createAsyncThunk('messages/list', async (id, thunkApi) => {
    // thunkApi.dispatch(messageLoading(true));
    const list = await apiMessage.getList(id);
    return list.data;
});

export const sendMessage = createAsyncThunk('message/sended', async (data) => {
    const { conversationId, content, type } = data;
    const response = await apiMessage.sendText({ conversationId, content, type });
    return response.data;
});

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        chatting: {},
        messages: [],
        loading: false,
        error: false,
        members: [],
    },
    reducers: {
        setChatting(state, action) {
            state.chatting = action.payload;
        },
        messageLoading(state, action) {
            state.loading = action.payload;
        },
        rerenderMessage(state, action) {
            state.messages.data = [...state.messages.data, action.payload];
        },
    },
    extraReducers: {
        // [getMessages.pending]: (state, action) => {},
        [getMessages.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = false;
            state.messages = action.payload;
        },
        [sendMessage.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = false;
        },
    },
});

const { actions, reducer } = messageSlice;
const messageReducer = reducer;

export const messagesSelector = (state) => state.messageReducer.messages;

export const { setChatting, messageLoading, rerenderMessage } = actions;

export default messageReducer;
