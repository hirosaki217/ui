import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiConversations } from '../../../api/apiConversation';

export const getList = createAsyncThunk('conversation/getList', async ({ name, type }) => {
    const response = await apiConversations.getList(name ? name : '', (type = 0));
    return response.data;
});

export const getConversationById = createAsyncThunk('conversation/getConversationById', async (id) => {
    const response = await apiConversations.getConversationById(id);
    return response.data;
});

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        currentConversation: '',
        conversations: [],
        conversation: {},
    },
    reducers: {
        getConversation: (state, action) => {},
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload._id;
            state.conversation = action.payload;
        },
    },
    extraReducers: {
        [getList.pending]: (state, action) => {},
        [getList.fulfilled]: (state, action) => {
            state.conversations = action.payload;
        },
        [getConversationById.fulfilled]: (state, action) => {
            state.conversations = [action.payload, ...state.conversations];
        },
    },
});

const { reducer, actions } = conversationSlice;
const conversationReducer = reducer;
export const conversationSelector = (state) => state.conversationReducer.conversations;
export const currentConversationSelector = (state) => state.conversationReducer.currentConversation;
export const currentAConverSelector = (state) => state.conversationReducer.conversation;

export const { getConversation, setCurrentConversation } = actions;
export default conversationReducer;
