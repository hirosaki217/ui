import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFriend } from '../../../api/apiFriend';

export const findFriend = createAsyncThunk('friend/findFriend', async (username) => {
    const rs = await apiFriend.findFriend(username);
    return rs.data;
});

export const findFriendById = createAsyncThunk('friend/findFriendById', async (userId) => {
    const rs = await apiFriend.findFriendById(userId);
    return rs.data;
});

export const getFriends = createAsyncThunk('friend/list', async () => {
    const rs = await apiFriend.getFriends();
    return rs.data;
});

export const inviteFriend = createAsyncThunk('friend/invite', async (result) => {
    const rs = await apiFriend.inviteFriend(result._id);
    return result;
});

export const acceptFriend = createAsyncThunk('friend/accept', async (id) => {
    const rs = await apiFriend.acceptFriend(id);
    return id;
});

export const getListInvite = createAsyncThunk('friend/listInvite', async () => {
    const rs = await apiFriend.getListInvite();
    return rs.data;
});

export const getListMeInvite = createAsyncThunk('friend/listMeInvite', async () => {
    const rs = await apiFriend.getListMeInvite();
    return rs.data;
});

const friendSlice = createSlice({
    name: 'friend',
    initialState: {
        user: null,
        friends: [],
        friendInvites: [],
        friendMeInvites: [],
    },
    reducers: {
        recieveInvite: (state, action) => {
            if (action.payload) state.friendInvites = [action.payload, ...state.friendInvites];
        },
        deleteMeInvive: (state, action) => {
            state.friendMeInvites = state.friendMeInvites.filter(
                (friendMeInvite) => friendMeInvite._id !== action.payload,
            );
        },
        deleteInvite: (state, action) => {
            state.friendInvites = state.friendInvites.filter((friendInvite) => friendInvite._id !== action.payload);
        },
        setNewFriend: (state, action) => {
            const friend = state.friendMeInvites.find((friendMeInvite) => friendMeInvite._id === action.payload);
            const newList = state.friendMeInvites.filter((friendMeInvite) => friendMeInvite.id !== action.payload);
            state.friends = [friend, ...state.friends];
            state.friendMeInvites = newList;
        },
        setEmptyFriend: (state, action) => {
            state.user = '';
        },
    },
    extraReducers: {
        [findFriend.fulfilled]: (state, action) => {
            state.user = action.payload;
        },
        [findFriendById.fulfilled]: (state, action) => {
            state.user = action.payload;
        },
        [getFriends.fulfilled]: (state, action) => {
            state.friends = action.payload;
        },
        [inviteFriend.fulfilled]: (state, action) => {
            const { _id, name, username, avatar, avatarColor } = action.payload;
            const friendMeInvite = { _id, name, username, avatar, avatarColor };
            state.friendMeInvites = [friendMeInvite, ...state.friendMeInvites];
        },
        [acceptFriend.fulfilled]: (state, action) => {
            const friend = state.friendInvites.find((friend) => friend._id === action.payload);
            state.friendInvites = state.friendInvites.filter((friend) => friend._id !== action.payload);
            state.friends = [friend, ...state.friends];
        },
        [getListInvite.fulfilled]: (state, action) => {
            state.friendInvites = action.payload;
        },
        [getListMeInvite.fulfilled]: (state, action) => {
            state.friendMeInvites = action.payload;
        },
    },
});

const friendReducer = friendSlice.reducer;

export const friendSelector = (state) => state.friendReducer.user;
export const listFriendSelector = (state) => state.friendReducer.friends;
export const listFriendInviteSelector = (state) => state.friendReducer.friendInvites;
export const listFriendMeInviteSelector = (state) => state.friendReducer.friendMeInvites;

export const { recieveInvite, setNewFriend, setEmptyFriend } = friendSlice.actions;
export default friendReducer;
