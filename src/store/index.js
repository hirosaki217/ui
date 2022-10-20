import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/loginReducer/loginSlice';

const store = configureStore({
    reducer: {
        loginReducer,
    },
});

export default store;
