import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUser } from '../../../api/apiUser';

export const getProfile = createAsyncThunk('me/getProfile', async () => {
    const rs = await apiUser.getProfile();
    return rs.data;
});

const meSlice = createSlice({
    name: 'me',
    initialState: {
        user: null,
    },
    reducers: {},
    extraReducers: {
        [getProfile.fulfilled]: (state, action) => {
            state.user = action.payload;
        },
    },
});

const meReducer = meSlice.reducer;

export const meSelector = (state) => state.meReducer.user;

export default meReducer;
