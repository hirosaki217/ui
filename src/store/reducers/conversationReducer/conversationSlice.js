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

export const addManager = createAsyncThunk('conversation/addManager', async (params, _) => {
    const { conversationId, managerId } = params;
    const managerIds = [managerId];
    const response = await apiConversations.addManager({ conversationId, managerIds });
    return response.data;
});

export const removeManager = createAsyncThunk('conversation/removeManager', async (params, _) => {
    const { conversationId, managerId } = params;
    const managerIds = [managerId];
    const response = await apiConversations.deleteManager({ conversationId, managerIds });
    return response.data;
});

export const removeMember = createAsyncThunk('conversation/removeMember', async (params, _) => {
    const { conversationId, userId } = params;

    const response = await apiConversations.removeMember({ conversationId, userId });
    return response.data;
});

export const addMember = createAsyncThunk('conversation/addMember', async (params, _) => {
    const { conversationId, userId } = params;

    const response = await apiConversations.addMember({ conversationId, userId });
    return response.data;
});

export const leaveGroup = createAsyncThunk('conversation/leaveGroup', async (params, _) => {
    const { conversationId } = params;

    const response = await apiConversations.leaveGroup(conversationId);
    return response.data;
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
        addManager1: (state, action) => {
            const { conversationId, managerIds } = action.payload;
            if (conversationId === state.currentConversation) {
                const index = state.conversations.findIndex((ele) => ele._id === conversationId);

                const tempManagerIds = state.conversations[index].managerIds.concat(managerIds);
                if (index > -1) {
                    state.conversations[index] = {
                        ...state.conversations[index],
                        managerIds: tempManagerIds,
                    };
                }
            }
        },
        removeManager1: (state, action) => {
            const { conversationId, managerIds } = action.payload;
            if (conversationId === state.currentConversation) {
                const index = state.conversations.findIndex((ele) => ele._id === conversationId);

                const tempManagerIds = state.conversations[index].managerIds.filter((ele) => ele !== managerIds[0]);
                if (index > -1) {
                    state.conversations[index] = {
                        ...state.conversations[index],
                        managerIds: tempManagerIds,
                    };
                }
            }
        },
        leaveGroup1: (state, action) => {
            const conversations = state.conversations.filter(
                (conversation) => conversation._id !== action.conversationId,
            );
            state.conversations = [...conversations];
        },
        updateMemberInconver: (state, action) => {
            const { conversationId, newMember } = action.payload;
            state.memberInConversation = newMember;
            const index = state.conversations.findIndex((ele) => ele._id === conversationId);
            if (index > -1) {
                state.conversations[index].totalMembers = newMember.length;
            }
        },
        removeMember1: (state, action) => {
            const { conversationId } = action.payload;
            const index = state.conversations.findIndex((ele) => ele._id === conversationId);
            if (index > -1) {
                state.conversations[index].totalMembers = state.conversations[index].totalMembers - 1;
            }
        },
        updateAvatarWhenUpdateMember: (state, action) => {
            const { conversationId, avatar, totalMembers } = action.payload;

            const index = state.conversations.findIndex((ele) => ele._id === conversationId);

            state.conversations[index].totalMembers = totalMembers;
            if (index > -1 && typeof state.conversations[index].avatar === 'object') {
                state.conversations[index].avatar = avatar;
            }
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
        [addManager.fulfilled]: (state, action) => {
            let { conversationId, managerIds } = action.payload;
            const conver = state.conversations.find((conversation) => conversation._id === conversationId);
            if (conver) {
                conver.managerIds = managerIds;

                const conversations = state.conversations.filter((conversation) => conversation._id !== conversationId);
                state.conversations = [conver, ...conversations];
            }
        },
        [removeManager.fulfilled]: (state, action) => {
            let { conversationId, managerIds } = action.payload;
            const conver = state.conversations.find((conversation) => conversation._id === conversationId);
            if (conver) {
                managerIds.forEach((id) => {
                    const index = conver.managerIds.findIndex((idEle) => idEle === id);
                    if (index !== -1) {
                        conver.managerIds.splice(index, 1);
                    }
                });

                const conversations = state.conversations.filter((conversation) => conversation._id !== conversationId);
                state.conversations = [conver, ...conversations];
            }
        },
        [leaveGroup.fulfilled]: (state, action) => {
            console.log('leaveGroup');
        },
        [addMember.fulfilled]: (state, action) => {
            console.log('addMember');
        },
        [removeMember.fulfilled]: (state, action) => {
            console.log('removeMember');
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
    addManager1,
    removeManager1,
    updateMemberInconver,
    updateAvatarWhenUpdateMember,
} = actions;
export default conversationReducer;
