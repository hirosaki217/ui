import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiConversations } from '../../../api/apiConversation';
import dateUtils from '../../../utils/dateUtils';

export const getList = createAsyncThunk('conversation/getList', async ({ name, type }) => {
    const response = await apiConversations.getList(name ? name : '', (type = 0));
    return response.data;
});

export const getConversationById = createAsyncThunk('conversation/getConversationById', async (id) => {
    const response = await apiConversations.getConversationById(id);
    return response.data;
});

export const createGroupConversation = createAsyncThunk(
    'conversation/createGroupConversation',
    async ({ name, userIds }) => {
        console.log('ids:', userIds);
        const response = await apiConversations.createGroupConversation({ name, userIds });
        return response.data;
    },
);

export const getLastViewOfMembers = createAsyncThunk(`conversation/getLastViewOfMembers`, async (params, _) => {
    const { conversationId } = params;
    const lastViews = await apiConversations.getLastViewOfMembers(conversationId);

    return lastViews.data;
});

export const getListMembers = createAsyncThunk('conversation/getListMember', async (params, _) => {
    const { conversationId } = params;
    const response = await apiConversations.getListMember(conversationId);
    return response.data;
});

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        currentConversation: '',
        conversations: [],
        conversation: {},
        toTalUnread: 0,
        members: [],
        lastViewOfMember: [],
    },
    reducers: {
        getConversation: (state, action) => {
            state.numberUnread = action.payload.numberUnread;
        },
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload._id;
            state.conversation = action.payload;
        },
        setLastMessageInConversation: (state, action) => {
            const { conversationId, message } = action.payload;
            const index = state.conversations.findIndex((conversation) => conversation._id === conversationId);
            const searchConversation = state.conversations[index];
            searchConversation.numberUnread = searchConversation.numberUnread + 1;
            searchConversation.lastMessage = {
                ...message,
                createdAt: dateUtils.toTime(message.createdAt),
            };
            if (conversationId === state.currentConversation) searchConversation.numberUnread = 0;
            const conversationTempt = state.conversations.filter((conversation) => conversation._id !== conversationId);

            state.conversations = [searchConversation, ...conversationTempt];
        },
        // updateLastViewOfMembers: (state, action) => {
        //     const { conversationId, userId, lastView } = action.payload;

        //     if (conversationId === state.currentConversation) {
        //         const index = state.lastViewOfMember.findIndex((ele) => ele.user._id === userId);
        //         state.lastViewOfMember[index].lastView = lastView;
        //     }
        // },
        updateTimeForConver: (state, action) => {
            const { isOnline, id, lastLogin } = action.payload;
            const index = state.conversations.findIndex((ele) => ele._id === id);
            const newConver = {
                ...state.conversations[index],
                isOnline,
                lastLogin,
            };
            state.conversations[index] = newConver;
        },
        setNumberUnreadForNewFriend: (state, action) => {
            const id = action.payload;
            const index = state.conversations.findIndex((ele) => ele._id === id);
            const numberUnread = state.conversations[index].numberUnread + 1;
            state.conversations[index] = {
                ...state.conversations[index],
                numberUnread,
            };
        },
        setToTalUnread: (state, action) => {
            let tempCount = 0;
            state.conversations.forEach((ele, index) => {
                if (ele.numberUnread > 0) tempCount += 1;
            });
            state.toTalUnread = tempCount;
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
        [createGroupConversation.fulfilled]: (state, action) => {
            console.log('đã tạo nhóm');
        },
        [getLastViewOfMembers.fulfilled]: (state, action) => {
            state.lastViewOfMember = action.payload;
        },
        [getListMembers.fulfilled]: (state, action) => {
            state.members = action.payload;
        },
    },
});

const { reducer, actions } = conversationSlice;
const conversationReducer = reducer;
export const conversationSelector = (state) => state.conversationReducer.conversations;
export const currentConversationSelector = (state) => state.conversationReducer.currentConversation;
export const currentAConverSelector = (state) => state.conversationReducer.conversation;
export const toTalUnreadSelector = (state) => state.conversationReducer.toTalUnread;
export const listMemberSelector = (state) => state.conversationReducer.members;
export const {
    getConversation,
    updateTimeForConver,
    setCurrentConversation,
    // updateLastViewOfMembers,
    setLastMessageInConversation,
    setNumberUnreadForNewFriend,
    setToTalUnread,
} = actions;
export default conversationReducer;
