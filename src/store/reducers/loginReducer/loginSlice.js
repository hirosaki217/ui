import { createSlice } from '@reduxjs/toolkit';

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
        login(state, action) {
            state.user.isLogin = action.payload.isLogin;
            state.user.isRegister = action.payload.isRegister;
        },
        isRegister(state, action) {
            state.user.isRegister = action.payload;
        },
    },
});

const loginReducer = loginSlice.reducer;

export const loginSelector = (state) => state.loginReducer.user;

export const { login, isRegister } = loginSlice.actions;

export default loginReducer;
