import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../../api/apiConfig';
import jwt from '../../../utils/jwt';

export const login = createAsyncThunk('login', async (data) => {
    try {
        const response = await axios.post('auth/login', data, { withCredentials: true });
        if (response.data.token) {
            jwt.setToken(response.data.token);
            return true;
        }
    } catch (error) {}
    return false;
});

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        user: {
            username: '',
            password: '',
            _id: '',
            isLogin: false,
            token: '',
            isRegister: false,
        },
    },
    reducers: {
        checkLogin(state, action) {
            state.user.isLogin = true;
            state.user._id = action.payload;
        },
        isRegister(state, action) {
            state.user.isRegister = action.payload;
        },
    },
    extraReducers: {
        [login.pending]: (state, action) => {},
        [login.fulfilled]: (state, action) => {
            state.user.isLogin = action.payload;
            state.user.isRegister = false;
        },
        [login.rejected]: (state, action) => {
            state.user.isLogin = false;
            state.user.isRegister = false;
        },
    },
});

const loginReducer = loginSlice.reducer;

export const loginSelector = (state) => state.loginReducer.user;

export const { isRegister, checkLogin } = loginSlice.actions;

export default loginReducer;
