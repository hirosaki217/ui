import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../../api/apiConfig';
import jwt from '../../../utils/jwt';

export const checkAuth = createAsyncThunk('login/checkAuth', async () => {
    const token = jwt.getToken();
    if (token) {
        localStorage.setItem('isLogin', true);
        return true;
    }

    if (!token) {
        const success = await jwt.getRefreshToken();
        if (success) {
            localStorage.setItem('isLogin', true);
            return true;
        }
    }
    localStorage.setItem('isLogin', false);
    return false;
});

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
            isLogin: false,
            token: '',
            isRegister: false,
        },
    },
    reducers: {
        // login(state, action) {
        //     state.user.isLogin = action.payload.isLogin;
        //     state.user.isRegister = action.payload.isRegister;
        // },
        isRegister(state, action) {
            state.user.isRegister = action.payload;
        },
    },
    extraReducers: {
        [login.pending]: (state, action) => {
            console.log('pending data to server ...');
        },
        [login.fulfilled]: (state, action) => {
            state.user.isLogin = action.payload;
            state.user.isRegister = false;
            console.log('done');
        },
        [login.rejected]: (state, action) => {
            state.user.isLogin = false;
            state.user.isRegister = false;
            console.log('failed');
        },
        [checkAuth.pending]: (state, action) => {
            console.log('checking login...');
        },
        [checkAuth.fulfilled]: (state, action) => {
            state.user.isLogin = action.payload;
            console.log(state.user.isLogin);
        },
        [checkAuth.rejected]: (state, action) => {
            console.log('user is logout');
            state.user.isLogin = action.payload;
        },
    },
});

const loginReducer = loginSlice.reducer;

export const loginSelector = (state) => state.loginReducer.user;

export const { isRegister } = loginSlice.actions;

export default loginReducer;
